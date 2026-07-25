import { Module } from '@nestjs/common';
import { PaidPatientController } from './paidpatient.controller';
import { PaidPatientService } from './paidpatient.service';
import { PaidPatientEntity } from './paidpatient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([PaidPatientEntity])],
  controllers: [PaidPatientController],
  providers: [PaidPatientService],
})
export class PaidPatientModule {}