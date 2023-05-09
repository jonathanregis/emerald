import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  shipmentId?: number;

  @ValidateIf((o) => !o.cbm)
  @IsNumber()
  bal?: number;

  @ValidateIf((o) => !o.bal)
  @IsNumber()
  cbm?: number;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;
}
