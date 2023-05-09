import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ShipmentService } from 'src/shipment/shipment.service';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, ShipmentService],
})
export class InvoiceModule {}
