import { IsNotEmpty, Matches, Length, IsIn } from 'class-validator';

export class PatientDTO {
  id: number;
  name?: string;

  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^.*@aiub\.edu$/, { message: 'Email must use aiub.edu domain' })
  email?: string;

  @Length(6, 20, { message: 'Password must be at least 6 characters' })
  @Matches(/[A-Z]/, { message: 'Password must contain one uppercase letter' })
  password?: string;

  @IsIn(['male', 'female'], { message: 'Gender must be male or female' })
  gender?: string;

  @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
  phone?: string;

  profilePic?: string;
}
