import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      if (compareSync(password, user.password)) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: await this.jwtService.signAsync(payload) };
      }
    } else {
      return null;
    }
  }
}
