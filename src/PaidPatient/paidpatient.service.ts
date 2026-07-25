import { Injectable, NotFoundException } from '@nestjs/common';
import { PaidPatientDto } from './paidpatient.dto';
import { PaidPatientEntity } from './paidpatient.entity';
import{ Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/admin.entity';

@Injectable()
export class PaidPatientService {

  constructor(
    @InjectRepository(PaidPatientEntity)
    private readonly paidPatientRepository: Repository<PaidPatientEntity>
  ) {}

  

  async getAllPatients(): Promise<PaidPatientEntity[]> {
    return await this.paidPatientRepository.find();
  }
  getChatHistory(): object {
    return {
      message: 'Chat history fetched successfully',
      data: [],
    };
  }

 
  getAssessmentQuiz(): object {
    return {
      message: 'Assessment quiz fetched successfully',
      data: [],
    };
  }

  
  getAppointmentDetails(id: number): object {
    const data = [
      { id: 1, name: 'Nipa', age: 60 },
      { id: 2, name: 'Akter', age: 60 },
      { id: 3, name: 'Nilima', age: 60 },
    ];

    const result = data.find((d) => d.id === id);

    if (!result) {
      throw new NotFoundException(`Appointment not found`);
    }

    return result;
  }

  
  getPaymentRecords(userId: number, type: string): object {
    const payments = [
      { userid: 1, name: 'Nipa', type: 'monthly', amount: 100 },
      { userid: 2, name: 'Neela', type: 'yearly', amount: 10000 },
      { userid: 3, name: 'Sadia', type: 'monthly', amount: 5000 },
    ];

    const result = payments.filter(
      (p) => p.userid === userId && p.type === type,
    );

    if (result.length === 0) {
      throw new NotFoundException('No payment records found');
    }

    return result;
  }
 async getPatientByFullName(fullName: string): Promise<PaidPatientEntity[]> {
    return await this.paidPatientRepository.find({
      where: { fullName: Like(`%${fullName}%`) },
    });
  }
  async getPatientByUsernameWithoutSpecific(username: string): Promise<object> {

  const patient = await this.paidPatientRepository.findOne({
    where: { username: Like(`%${username}%`) },

    select: {
      patientId: true,
      username: true,
      fullName: true,
    },
  });


  if (!patient) {
    throw new NotFoundException('Patient not found');
  }

  return patient;
}
  async getPatientByUsername(username: string): Promise<PaidPatientEntity> {
    const patient = await this.paidPatientRepository.findOne({
      where: { username: username },
      // relations: {
      //   admin: true, // 👈 Use an object mapping instead of a string array
      // },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }
 // async getAdminInfoByPatientId(id: string): Promise<AdminEntity> {
   // const patient = await this.paidPatientRepository.findOne({
     // where: { patientId: id },
      // relations: {
      //   admin: true, // 👈 Use an object mapping instead of a string array
      // },
   // });
   // if (!patient) {
    //  throw new NotFoundException('Patient not found');
   // }
   // return patient.admin;
 // }
 

  async getPatientByUsernameWithoutPassword(username: string): Promise<object> {
    const patient = await this.paidPatientRepository.findOne({
      where: { username: username },
      
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const { password, ...patientWithoutPassword } = patient;
    return patientWithoutPassword;
  }
 
  async deleteRecord(username: string): Promise<object> {
    const patient = await this.paidPatientRepository.findOne({
      where: { username: username },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    await this.paidPatientRepository.remove(patient);
    return { message: 'Patient record deleted successfully' };
  }
  
async createRecord(dto: PaidPatientDto): Promise<PaidPatientEntity> {
   // const { adminId, ...patientData } = dto;
    //const paidpatient = this.paidPatientRepository.create({
     // ...patientData,
      //admin: adminId ? { adminId: adminId } : undefined,
    //});
    const paidpatient = this.paidPatientRepository.create(dto);
    return await this.paidPatientRepository.save(paidpatient);
  }
 

  
  async updateRecord(id: string, dto: PaidPatientDto): Promise<object> {
    const index = this.paidPatientRepository.findOneBy({ patientId: id });

    if (!index) {
      throw new NotFoundException('Patient not found');
    }

    await this.paidPatientRepository.update({ patientId: id }, dto);

    return {
      message: 'Patient record updated successfully',
    };
  }

    
    
}