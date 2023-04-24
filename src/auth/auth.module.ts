import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/users';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from 'src/config';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ...usersProviders,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  imports: [UsersModule],
})
export class AuthModule {}
