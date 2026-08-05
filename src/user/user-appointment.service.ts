import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../Doctor/appointment.entity';
import { DoctorEntity } from '../Doctor/doctor.entity';
import {
  BookAppointmentDTO,
  UpdateAppointmentDTO,
} from './user-appointment.dto';
import { StressLevel, UserEntity } from './user.entity';
import { UserMailService } from './userMail/userMail.service';

@Injectable()
export class UserAppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,

    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userMailService: UserMailService,
  ) {}

  getDoctors(): Promise<DoctorEntity[]> {
    return this.doctorRepository.find({
      select: {
        doctorId: true,
        name: true,
        email: true,
        specialization: true,
        licenseNumber: true,
        profilePic: true,
        isActive: true,
      },
      order: {
        doctorId: 'ASC',
      },
    });
  }

  async bookAppointment(
    userId: number,
    doctorId: number,
    dto: BookAppointmentDTO,
  ): Promise<AppointmentEntity> {
    const user = await this.userRepository.findOne({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Non-Paid Patient account not found',
      );
    }

    const doctor = await this.doctorRepository.findOne({
      where: {
        doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException(
        `Doctor with ID ${doctorId} not found`,
      );
    }

    if (user.latestStressLevel !== StressLevel.HIGH) {
      throw new BadRequestException(
        'Doctor booking is available when the latest stress level is high',
      );
    }

    const appointmentDate = new Date(dto.appointmentDate);

    if (appointmentDate.getTime() <= Date.now()) {
      throw new BadRequestException(
        'Appointment date must be in the future',
      );
    }

    const appointment =
      this.appointmentRepository.create({
        patientName: user.fullName,
        appointmentDate: dto.appointmentDate,
        reason: dto.reason ?? null,
        userId: user.userId,
        user,
        doctor,
      });

    const savedAppointment =
      await this.appointmentRepository.save(appointment);

    if (user.email) {
      await this.userMailService.sendAppointmentEmail(
        user.email,
        user.fullName,
        doctor.name,
        dto.appointmentDate,
      );
    }

    return savedAppointment;
  }

  async getMyAppointments(
    userId: number,
  ): Promise<AppointmentEntity[]> {
    return this.appointmentRepository.find({
      where: {
        userId,
      },
      relations: {
        doctor: true,
      },
      order: {
        appointmentId: 'DESC',
      },
    });
  }

  async updateAppointment(
    userId: number,
    appointmentId: number,
    dto: UpdateAppointmentDTO,
  ): Promise<AppointmentEntity> {
    const appointment =
      await this.appointmentRepository.findOne({
        where: {
          appointmentId,
          userId,
        },
        relations: {
          doctor: true,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    if (dto.appointmentDate) {
      const appointmentDate = new Date(
        dto.appointmentDate,
      );

      if (appointmentDate.getTime() <= Date.now()) {
        throw new BadRequestException(
          'Appointment date must be in the future',
        );
      }

      appointment.appointmentDate =
        dto.appointmentDate;
    }

    if (dto.reason !== undefined) {
      appointment.reason = dto.reason;
    }

    return this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(
    userId: number,
    appointmentId: number,
  ): Promise<{ message: string }> {
    const appointment =
      await this.appointmentRepository.findOne({
        where: {
          appointmentId,
          userId,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    await this.appointmentRepository.remove(appointment);

    return {
      message: `Appointment with ID ${appointmentId} deleted successfully`,
    };
  }
}