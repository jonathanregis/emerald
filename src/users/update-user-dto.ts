import { IsNumberString, IsAlpha, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsAlpha()
  firstName?: string;

  @IsAlpha()
  lastName?: string;

  @IsNumberString()
  phoneNumber?: string;

  @IsEnum({ admin: 'admin', customer: 'customer' })
  role?: 'admin' | 'customer';
}
