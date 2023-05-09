import { IsDateString, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  shipmentId: number;

  @IsDateString()
  dueDate: Date;
}
