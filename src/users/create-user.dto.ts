import {
  IsEmail,
  IsNumberString,
  IsAlpha,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumberString()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum({ admin: 'admin', customer: 'customer' })
  @IsOptional()
  role: 'admin' | 'customer';
}
