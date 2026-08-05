import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserStatus } from './user.entity';

export class UserDTO {
  @IsString()
  @IsNotEmpty({
    message: 'Full name is required',
  })
  @MaxLength(100, {
    message: 'Full name cannot be longer than 100 characters',
  })
  fullName: string;

  @Type(() => Number)
  @IsInt({
    message: 'Age must be an integer number',
  })
  @Min(0, {
    message: 'Age cannot be negative',
  })
  age: number;

  @IsOptional()
  @IsEnum(UserStatus, {
    message: 'Status must be active or inactive',
  })
  status?: UserStatus;
}

export class LabTwoUserDTO {
  @IsString()
  @IsNotEmpty({
    message: 'Name is required',
  })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: 'Name must not contain any special character',
  })
  fullName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase character',
  })
  password: string;

  @IsString()
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  @Matches(/^01[0-9]+$/, {
    message: 'Phone number must start with 01 and contain only numbers',
  })
  phone: string;
}

export class UpdateStatusDTO {
  @IsEnum(UserStatus, {
    message: 'Status must be active or inactive',
  })
  status: UserStatus;
}
export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100, {
    message: 'Full name cannot be longer than 100 characters',
  })
  fullName: string;

  @Type(() => Number)
  @IsInt({ message: 'Age must be an integer number' })
  @Min(0, { message: 'Age cannot be negative' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^01[0-9]+$/, {
    message: 'Phone number must start with 01 and contain only numbers',
  })
  phone: string;
}
