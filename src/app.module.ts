import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShipmentModule } from './shipment/shipment.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ShipmentModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
