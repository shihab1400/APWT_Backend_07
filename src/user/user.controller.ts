import { Body, Controller, Get, Post, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { PatientDTO } from './patient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAllUsers')
  getAllUsers(): object { 
    return this.userService.getAllUsers();
  }

  @Get('chatbot-limit-status')
  getChatbotLimitStatus(): object {
    return this.userService.getChatbotLimitStatus();
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('myfile', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) cb(null, true);
        else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      },
      limits: { fileSize: 2000000 },
      storage: diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  createPatient(@Body() patientData: PatientDTO, @UploadedFile() myfile: Express.Multer.File): object {
    if (myfile) {
      patientData.profilePic = myfile.filename;
    }
    patientData.id = Number(patientData.id);
    return this.userService.createPatient(patientData);
  }
}
