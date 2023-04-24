import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { User } from './users.model';
import { CreateUserDto } from './create-user.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/Public';

@Controller('users')
export class UsersController {
  @Get('/')
  getAll() {
    return User.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return User.findOne({ where: { id } });
  }

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
