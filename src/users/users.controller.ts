import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { Public } from 'src/common/decorators/Public';

@Controller('users')
export class UsersController {
  constructor(
    private userRepo: UsersService,
    private authService: AuthService,
  ) {}

  @Admin()
  @Get('/')
  async getAll(@Req() req: Request, @Res() res: Response) {
    const users =
      req.query.role === 'admin'
        ? await this.userRepo.getAdmins()
        : await this.userRepo.getAll();
    res.status(200).json({
      users,
    });
  }

  @Get('me')
  getCurrent(@Req() req: Request) {
    const { sub } = req['user'];
    return this.getById(sub, req);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const requestUser = req['user'];
    if (requestUser?.sub === id || requestUser.role === 'admin') {
      return this.userRepo.getById(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get(':id/shipments')
  getShipments(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const requestUser = req['user'];
    if (requestUser?.sub === id || requestUser.role === 'admin') {
      return this.userRepo.getShipments(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get(':id/items')
  getItems(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const requestUser = req['user'];
    if (requestUser?.sub === id || requestUser.role === 'admin') {
      return this.userRepo.getItems(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get(':id/stats')
  getStats(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const requestUser = req['user'];
    if (requestUser?.sub === id || requestUser.role === 'admin') {
      return this.userRepo.getUserStats(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get(':id/transactions')
  getTransactions(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const requestUser = req['user'];
    if (requestUser?.sub === id || requestUser.role === 'admin') {
      return this.userRepo.getTransactions(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Public()
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
