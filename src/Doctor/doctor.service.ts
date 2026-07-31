import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorEntity } from './doctor.entity';
import { DoctorDTO } from './doctor.dto';
import { Between } from 'typeorm/browser';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
  ) {}

  getHelloDoctor(): string {
    return 'Hello Doctor';
  }

  async getProfile(id: number): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found!`);
    }

    return doctor;
  }

  async getAvailabilitySchedule(id: number): Promise<object> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found!`);
    }

    return {
      message: 'Availability Schedule',
      doctorId: doctor.id,
      doctorName: doctor.name,
      available: 'Monday, Tuesday and Friday',
      time: '7 PM',
      location: 'Ibn Sina Dhanmondi 9/A',
    };
  }

  async getPatientRecord(
    id: number,
    patientId: number,
  ): Promise<object> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found!`);
    }

    return {
      message: 'Patient Record',
      doctorId: id,
      patientId: patientId,
      patientReport: doctor.patientReport,
    };
  }

  async getEarningsHistory(
    id: number,
    type: string,
  ): Promise<object> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found!`);
    }

    return {
      message: 'Earnings History',
      doctorId: id,
      type: type,
      totalIncome: '50000 BDT',
    };
  }

  async getAllDoctor(): Promise<DoctorEntity[]> {
    return await this.doctorRepository.find();
  }

  async getDoctorById(id: number): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found!`);
    }

    return doctor;
  }

  async postDoctor(data: DoctorDTO): Promise<DoctorEntity> {
    const doctor = this.doctorRepository.create(data);
    return await this.doctorRepository.save(doctor);
  }

  async updateDoctor(
    id: number,
    doctorObj: DoctorDTO,
  ): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found!`);
    }

    await this.doctorRepository.update(id, doctorObj);

    const updatedDoctor = await this.doctorRepository.findOne({
      where: { id },
    });

    return updatedDoctor!;
  }

async getDoctorByJoiningDate(joiningDate: string): Promise<any> {
  console.log(joiningDate);

  return await this.doctorRepository.find();
}
  async updateCountry(
  id: number,
  country: string,
): Promise<DoctorEntity> {
  const doctor = await this.doctorRepository.findOne({
    where: { id },
  });

  if (!doctor) {
    throw new NotFoundException(`Doctor with ID ${id} not found!`);
  }

  doctor.country = country;

  return await this.doctorRepository.save(doctor);
}

async getDoctorWithDefaultCountry(): Promise<DoctorEntity[]> {
  return await this.doctorRepository.find({
    where: {
      country: 'Unknown',
    },
  });
}
  async deleteDoctor(id: number): Promise<object> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found!`);
    }

    await this.doctorRepository.delete(id);

    return {
      message: `Doctor with ID ${id} deleted successfully!`,
    };
  }
}