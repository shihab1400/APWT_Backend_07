import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserProfileDTO {
  @IsString()
  @IsNotEmpty({
    message: 'Address is required',
  })
  @MaxLength(200, {
    message: 'Address cannot exceed 200 characters',
  })
  address: string;

  @IsString()
  @IsNotEmpty({
    message: 'Emergency contact is required',
  })
  @Matches(/^01[0-9]{9}$/, {
    message:
      'Emergency contact must start with 01 and contain exactly 11 digits',
  })
  emergencyContact: string;

  @IsOptional()
  @IsIn(
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    {
      message: 'Blood group is invalid',
    },
  )
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Occupation cannot exceed 100 characters',
  })
  occupation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Bio cannot exceed 500 characters',
  })
  bio?: string;
}

export class UpdateUserProfileDTO {
  @IsOptional()
  @IsString()
  @MaxLength(200, {
    message: 'Address cannot exceed 200 characters',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01[0-9]{9}$/, {
    message:
      'Emergency contact must start with 01 and contain exactly 11 digits',
  })
  emergencyContact?: string;

  @IsOptional()
  @IsIn(
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    {
      message: 'Blood group is invalid',
    },
  )
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Occupation cannot exceed 100 characters',
  })
  occupation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Bio cannot exceed 500 characters',
  })
  bio?: string;
}