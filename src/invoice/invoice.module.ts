import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ShipmentService } from 'src/shipment/shipment.service';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
import { usersProviders } from 'src/users/users';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UsersModule } from 'src/users/users.module';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    ShipmentService,
    NotificationService,
    UsersService,
    ...usersProviders,
    TransactionService,
  ],
  imports: [UsersModule],
})
export class InvoiceModule {}
