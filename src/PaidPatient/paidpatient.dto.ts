import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class PaidPatientDto {

  
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'Name must not contain special characters',
  })
  name?: string;

  
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^01[0-9]{9}$/, {
    message: 'Phone number must start with 01 and contain valid digits',
  })
  phone?: string;

 
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  password?: string;

  
  file?: string;
}