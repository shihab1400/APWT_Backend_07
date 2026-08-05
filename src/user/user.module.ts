import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from '../Doctor/appointment.entity';
import { DoctorEntity } from '../Doctor/doctor.entity';
import { UserAppointmentController } from './user-appointment.controller';
import { UserAppointmentService } from './user-appointment.service';
import { UserChatController } from './user-chat.controller';
import { UserChatEntity } from './user-chat.entity';
import { UserChatService } from './user-chat.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfileEntity } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserAuthModule } from './userAuth/userAuth.module';
import { UserMailModule } from './userMail/userMail.module';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([
      UserEntity,
      UserChatEntity,
      DoctorEntity,
      AppointmentEntity,
      UserProfileEntity,
    ]),

    UserAuthModule,
    UserMailModule,
  ],

  controllers: [
    UserController,
    UserChatController,
    UserAppointmentController,
    UserProfileController,
  ],

  providers: [
    UserService,
    UserChatService,
    UserAppointmentService,
    UserProfileService,
  ],

  exports: [
    UserService,
    UserChatService,
    UserAppointmentService,
    UserProfileService,
    TypeOrmModule,
  ],
})
export class UserModule {}