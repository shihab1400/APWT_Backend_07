import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100, {
    message: 'Full name cannot be longer than 100 characters',
  })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: 'Full name must not contain special characters',
  })
  fullName: string;

  @Type(() => Number)
  @IsInt({ message: 'Age must be an integer number' })
  @Min(0, { message: 'Age cannot be negative' })
  age: number;

  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase character',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^01[0-9]+$/, {
    message: 'Phone number must start with 01 and contain only numbers',
  })
  phone: string;
}

export class LoginUserDTO {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
export class VerifyOtpUserDTO {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Matches(/^[0-9]{6}$/, {
    message: 'OTP must contain exactly 6 digits',
  })
  otp: string;
}