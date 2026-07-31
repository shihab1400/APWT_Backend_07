import { Body,
   Controller,
  Get,
  Param,
  Query,
  Post,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorDTO } from './doctor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  getHelloDoctor(): string {
    return this.doctorService.getHelloDoctor();
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: number): object {
    return this.doctorService.getProfile(id);
  }

  @Get('availability/:id')
  getAvailabilitySchedule(@Param('id') id: number): object {
    return this.doctorService.getAvailabilitySchedule(id);
  }

  @Get('patientrecord')
  getPatientRecord(
    @Query('id') id: number,
    @Query('patientId') patientId: number,
  ): object {
    return this.doctorService.getPatientRecord(id, patientId);
  }

  @Get('earnings')
  getEarningsHistory(
    @Query('id') id: number,
    @Query('type') type: string,
  ): object {
    return this.doctorService.getEarningsHistory(id, type);
  }

  @Get('alldoctor')
  getAllDoctor(): object {
    return this.doctorService.getAllDoctor();
  }

  @Get('getdoctorbyid/:id')
  getDoctorById(@Param('id') id: number): object {
     return this.doctorService.getDoctorById(id);
  }

  @Get('getdoctorbyjoiningdate')
  getDoctorByJoiningDate( @Query('joiningDate') joiningDate: string,
  ): object {
    return this.doctorService.getDoctorByJoiningDate(joiningDate);
  }

  @UseInterceptors(
    FileInterceptor('report', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf|doc|docx)$/))
        cb(null, true);
         else {
           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'report'), false); }
      },
      limits: { fileSize: 5000000 },
      storage: diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  @Post('postdoctor')
  @UsePipes(new ValidationPipe())
  postDoctor(
    @Body() doctorData: DoctorDTO,
    @UploadedFile() report: Express.Multer.File,
  ): object {
    doctorData.patientReport = report.filename;
    return this.doctorService.postDoctor(doctorData);
  }

  @Put('updatedoctor/:id')
  updateDoctor(
    @Param('id') id: number,
    @Body() doctorData: DoctorDTO,
  ): object {
    return this.doctorService.updateDoctor(id, doctorData);
  }
  @Put('updatecountry/:id')
updateCountry(
  @Param('id') id: number,
  @Body('country') country: string,
): object {
  return this.doctorService.updateCountry(id, country);
}
@Get('getdoctorwithdefaultcountry')
getDoctorWithDefaultCountry(): object {
  return this.doctorService.getDoctorWithDefaultCountry();
}

  @Delete('deletedoctor/:id')
  deleteDoctor(@Param('id') id: number): object {
    return this.doctorService.deleteDoctor(id);
  }
}