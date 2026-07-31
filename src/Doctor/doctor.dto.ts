import { Transform } from 'class-transformer';
import {
  IsAlpha,
  IsNotEmpty,
  Matches,
  IsDateString,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class DoctorDTO {
  @IsOptional()
  @IsAlpha(undefined, {
    message: 'Name should contain only alphabets',
  })
  name?: string;

  @IsNotEmpty({
    message: 'Password field is required',
  })
  @Matches(/^(?=.*[@#$&]).+$/, {
    message: 'Password must contain one special character (@,#,$,&)',
  })
  password?: string;

  @IsDateString(
    {},
    {
      message: 'Please enter a valid appointment date',
    },
  )
  appointmentDate?: string;

  @IsUrl(
    {},
    {
      message: 'Social media link must be a valid URL',
    },
  )
  socialMedia?: string;
  
  @IsOptional()
country?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  patientReport?: string;
}