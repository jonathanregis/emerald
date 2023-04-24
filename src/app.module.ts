import { Module } from '@nestjs/common';
import { ShipmentModule } from './shipment/shipment.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ShipmentModule, UsersModule, AuthModule, DatabaseModule],
})
export class AppModule {}
