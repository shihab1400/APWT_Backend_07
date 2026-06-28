import { Injectable, NotFoundException } from '@nestjs/common';
import { PaidPatientDto } from './paidpatient.dto';

@Injectable()
export class PaidPatientService {

  
  private patientData: PaidPatientDto[] = [
    {
      name: 'Rahim',
      phone: '01711111111',
      password: 'abc123',
      file: 'file1.pdf',
    },
    {
      name: 'Karim',
      phone: '01999999999',
      password: 'pass123',
      file: 'file2.pdf',
    },
  ];

  
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

  
  createRecord(dto: PaidPatientDto): PaidPatientDto {
    const exists = this.patientData.find(
      (p) => p.phone === dto.phone,
    );

    if (exists) {
      throw new NotFoundException('Patient already exists');
    }

    this.patientData.push(dto);

    return dto;
  }

  
  updateRecord(name: string, dto: PaidPatientDto): object {
    const index = this.patientData.findIndex(
      (p) => p.name === name,
    );

    if (index === -1) {
      throw new NotFoundException('Patient not found');
    }

    
    if (dto.name) {
      this.patientData[index].name = dto.name;
    }

    if (dto.phone) {
      this.patientData[index].phone = dto.phone;
    }

    if (dto.password) {
      this.patientData[index].password = dto.password;
    }

    if (dto.file) {
      this.patientData[index].file = dto.file;
    }

    return {
      message: 'Updated successfully',
      data: this.patientData[index],
    };
  }

  
  getAllPatients(): PaidPatientDto[] {
    return this.patientData;
  }
}