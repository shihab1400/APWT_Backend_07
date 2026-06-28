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
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

import { PaidPatientService } from './paidpatient.service';
import { PaidPatientDto } from './paidpatient.dto';

@Controller('paid-patient')
export class PaidPatientController {
  constructor(private readonly paidPatientService: PaidPatientService) {}

  
  
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
  ): PaidPatientDto {
    dto.file = file?.filename;
    return this.paidPatientService.createRecord(dto);
  }

  
  @Put('update-record/:name')
  updateRecord(
    @Param('name') name: string,
    @Body() dto: PaidPatientDto,
  ): object {
    return this.paidPatientService.updateRecord(name, dto);
  }
}