import { Injectable } from '@nestjs/common';
import { PatientDTO } from './patient.dto';

@Injectable()
export class UserService {
  private patientData: PatientDTO[] = [
    {
      id: 1,
      name: 'Sadia',
      email: 'sadia@aiub.edu',
      password: 'Pass123',
      gender: 'female',
      phone: '01711111111',
      profilePic: 'default.jpg'
    }
  ];

  getAllUsers(): object { 
    return this.patientData;
  }

  getChatbotLimitStatus(): object {
    return {
      userCategory: 'FreePatient',
      dailyTotalLimit: 5,
      messagesUsedToday: 2,
      messagesRemaining: 3,
      status: 'Active',
      notice: 'Upgrade to Premium for unlimited access to our AI Chatbot!',
    };
  }

  createPatient(data: PatientDTO): object {
    this.patientData.push(data);
    return {
      message: 'Patient profile created with image successfully!',
      data: data
    };
  }
}
