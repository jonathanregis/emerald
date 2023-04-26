import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export type AuthUserType = {
  role: 'admin' | 'customer';
  sub: string | number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    if (user) {
      if (compareSync(password, user.password)) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: await this.jwtService.signAsync(payload) };
      }
    } else {
      return null;
    }
  }

  getRequestToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  getRequestUser(request: Request): AuthUserType | undefined {
    const token = this.getRequestToken(request);
    if (token) {
      const user = this.jwtService.verify(token);
      return user;
    } else {
      return undefined;
    }
  }
}
