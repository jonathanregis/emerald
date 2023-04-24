import {
  IsEmail,
  IsNumberString,
  IsAlpha,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;

  @IsNumberString()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
