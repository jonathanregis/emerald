import { Module } from '@nestjs/common';
import { ShipmentModule } from './shipment/shipment.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ShipmentModule, UsersModule, AuthModule],
})
export class AppModule {}
