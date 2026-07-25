import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Put,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  Delete,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

import { PaidPatientService } from './paidpatient.service';
import { PaidPatientDto } from './paidpatient.dto';
import { PaidPatientEntity } from './paidpatient.entity';
import { AdminEntity } from 'src/admin/admin.entity';

@Controller('paid-patient')
export class PaidPatientController {
  constructor(private readonly paidPatientService: PaidPatientService) {}

  @Get('all-patients')
  getAllpatients(): Promise<PaidPatientEntity[]> {
    return this.paidPatientService.getAllPatients();
  }
  @Get('fullName/:fullName')
  getPatientByFullName(@Param('fullName') fullName: string): Promise<PaidPatientEntity[]> {
    return this.paidPatientService.getPatientByFullName(fullName);
  }
   @Get('getpatientbyusername/:username')
  getPatientByUsername(@Param('username') username: string): Promise<PaidPatientEntity> {
    return this.paidPatientService.getPatientByUsername(username);
  }

//@Get('getadmininfobypatientid/:id')
  //getAdminInfoByPatientId(@Param('id') id: string): Promise<AdminEntity> {
   // return this.paidPatientService.getAdminInfoByPatientId(id);
 // }

  @Get('getpatientbyusernamewithoutpassword/:username')
  getPatientByUsernameWithoutPassword(@Param('username') username: string): Promise<object> {
    return this.paidPatientService.getPatientByUsernameWithoutPassword(username);
  }

  @Get('getpatientbyusernamewithoutspecific/:username')
  getPatientByUsernameWithoutSpecific(@Param('username') username: string): Promise<object> {
    return this.paidPatientService.getPatientByUsernameWithoutSpecific(username);
  }



  @Delete('delete-record/:username')

  deleteRecord(@Param('username') username: string): Promise<object> {
    return this.paidPatientService.deleteRecord(username);
  }
  @Get('chat-history')
  getChatHistory(): object {
    return this.paidPatientService.getChatHistory();
  }

  
  @Get('assessment-quiz')
  getAssessmentQuiz(): object {
    return this.paidPatientService.getAssessmentQuiz();
  }

  
  @Get('appointment-details/:id')
  getAppointmentDetails(@Param('id') id: string): object {
    return this.paidPatientService.getAppointmentDetails(Number(id));
  }

  @Get('payment-records')
  getPaymentRecords(
    @Query('userId') userId: string,
    @Query('type') type: string,
  ): object {
    return this.paidPatientService.getPaymentRecords(Number(userId), type);
  }

  
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
       
        if (file.originalname.match(/^.*\.pdf$/)) {
          cb(null, true);
        } else {
          cb(
            new MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF allowed'),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  @Post('create-record')
  createRecord(
    @Body() dto: PaidPatientDto,
    @UploadedFile() file: Express.Multer.File,
  ): object {
    dto.file = file?.filename;
    return this.paidPatientService.createRecord(dto);
  }

  
  @Put('update-record/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() dto: PaidPatientDto,
  ): object {
    return this.paidPatientService.updateRecord(id, dto);
  }
}