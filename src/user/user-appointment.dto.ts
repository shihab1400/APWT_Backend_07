import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class BookAppointmentDTO {
  @IsDateString(
    {},
    {
      message: 'Appointment date must be a valid ISO date',
    },
  )
  @IsNotEmpty({
    message: 'Appointment date is required',
  })
  appointmentDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Reason cannot exceed 500 characters',
  })
  reason?: string;
}

export class UpdateAppointmentDTO {
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Appointment date must be a valid ISO date',
    },
  )
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Reason cannot exceed 500 characters',
  })
  reason?: string;
}