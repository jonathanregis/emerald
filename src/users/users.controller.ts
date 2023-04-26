import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './users.model';
import { CreateUserDto } from './create-user.dto';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { Admin } from 'src/common/decorators/Admin';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private userRepo: UsersService,
    private authService: AuthService,
  ) {}

  @Admin()
  @Get('/')
  getAll() {
    return this.userRepo.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string, @Req() req: Request) {
    const requestUser = this.authService.getRequestUser(req);
    if (requestUser?.sub === parseInt(id) || requestUser.role === 'admin') {
      return this.userRepo.getById(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Admin()
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const existingUser = await User.findAll({
        where: { email: createUserDto.email },
        limit: 1,
      });
      if (existingUser.length) {
        res.status(400).json({
          message: 'This email already exists',
          error: 'User exists',
        });
      } else {
        const user = await User.create(createUserDto);
        res.status(201).json({
          message: 'User created successfully',
          user,
        });
      }
    } catch (e) {
      throw e;
    }
  }
}
