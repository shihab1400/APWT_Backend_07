import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentEntity } from '../Doctor/appointment.entity';
import { DoctorEntity } from '../Doctor/doctor.entity';
import {
  BookAppointmentDTO,
  UpdateAppointmentDTO,
} from './user-appointment.dto';
import { UserAppointmentService } from './user-appointment.service';
import { UserAuthGuard } from './userAuth/userAuth.guard';
import type { RequestWithUser } from './userAuth/userAuth.guard';

@Controller('users/appointments')
@UseGuards(UserAuthGuard)
export class UserAppointmentController {
  constructor(
    private readonly userAppointmentService: UserAppointmentService,
  ) {}

  @Get('doctors')
  getDoctors(): Promise<DoctorEntity[]> {
    return this.userAppointmentService.getDoctors();
  }

  @Post('book/:doctorId')
  bookAppointment(
    @Req() request: RequestWithUser,
    @Param('doctorId', ParseIntPipe)
    doctorId: number,
    @Body() dto: BookAppointmentDTO,
  ): Promise<AppointmentEntity> {
    return this.userAppointmentService.bookAppointment(
      request.user.sub,
      doctorId,
      dto,
    );
  }

  @Get('my')
  getMyAppointments(
    @Req() request: RequestWithUser,
  ): Promise<AppointmentEntity[]> {
    return this.userAppointmentService.getMyAppointments(
      request.user.sub,
    );
  }

  @Put(':appointmentId')
  updateAppointment(
    @Req() request: RequestWithUser,
    @Param('appointmentId', ParseIntPipe)
    appointmentId: number,
    @Body() dto: UpdateAppointmentDTO,
  ): Promise<AppointmentEntity> {
    return this.userAppointmentService.updateAppointment(
      request.user.sub,
      appointmentId,
      dto,
    );
  }

  @Delete(':appointmentId')
  deleteAppointment(
    @Req() request: RequestWithUser,
    @Param('appointmentId', ParseIntPipe)
    appointmentId: number,
  ): Promise<{ message: string }> {
    return this.userAppointmentService.deleteAppointment(
      request.user.sub,
      appointmentId,
    );
  }
}