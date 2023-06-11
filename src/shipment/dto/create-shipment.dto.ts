import { Type } from 'class-transformer';
import {
  IsEnum,
  IsAlphanumeric,
  IsAlpha,
  Length,
  IsDateString,
  IsString,
} from 'class-validator';
import { ContainerTypes, ShipmentStatus } from 'src/types';

export class CreateShipmentDto {
  @IsDateString()
  arrivalDate: Date;

  @IsDateString()
  departureDate: Date;

  @IsEnum(ContainerTypes)
  containerType: string;

  @IsAlphanumeric()
  container: string;

  @IsEnum(ShipmentStatus)
  status: number;

  @IsAlphanumeric()
  seal: string;

  @IsAlpha()
  @Length(2, 2)
  departureCountry: string;

  @IsAlpha()
  @Length(2, 2)
  arrivalCountry: string;

  @IsString()
  departureCity: string;

  @IsString()
  arrivalCity: string;
}
