import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  shipmentId: number;
}
