import { IsAlpha, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export default class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsInt()
  userId: number;

  @IsString()
  service: string;

  @IsInt()
  invoiceId: number;

  @IsEnum(['in', 'out'])
  type: string;
}
