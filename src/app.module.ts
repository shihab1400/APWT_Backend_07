import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserAuthModule } from './user/userAuth/userAuth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,

        host:
          configService.get<string>('DB_HOST') ??
          'localhost',

        port: Number(
          configService.get<string>('DB_PORT') ??
            5432,
        ),

        username:
          configService.get<string>('DB_USERNAME') ??
          'postgres',

        password:
          configService.get<string>('DB_PASSWORD') ??
          '',

        database:
          configService.get<string>('DB_DATABASE') ??
          'Test',

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    UserModule,
    UserAuthModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}