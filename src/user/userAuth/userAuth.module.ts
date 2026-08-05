import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { UserMailModule } from '../userMail/userMail.module';
import { UserAuthController } from './userAuth.controller';
import { UserAuthGuard } from './userAuth.guard';
import { UserAuthService } from './userAuth.service';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([
      UserEntity,
    ]),

    JwtModule.registerAsync({
      imports: [
        ConfigModule,
      ],
      inject: [
        ConfigService,
      ],
      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
          configService.get<string>(
            'USER_JWT_SECRET',
          ),
        signOptions: {
          expiresIn: '30m',
        },
      }),
    }),

    UserMailModule,
  ],

  controllers: [
    UserAuthController,
  ],

  providers: [
    UserAuthService,
    UserAuthGuard,
  ],

  exports: [
    UserAuthService,
    UserAuthGuard,
    JwtModule,
  ],
})
export class UserAuthModule {}