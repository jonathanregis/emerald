import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignInDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() signInDto: SignInDto, @Res() res: Response) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    if (token) {
      res.status(200).json({
        message: 'Logged in successfully',
        token,
      });
    } else {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'User login failed, please check credentials and try again',
      });
    }
  }
}
