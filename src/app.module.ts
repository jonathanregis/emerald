import { Module } from '@nestjs/common';
import { ShipmentModule } from './shipment/shipment.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
      global: true,
    }),
    ShipmentModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
  ],
})
export class AppModule {}
