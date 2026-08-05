import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  LoginUserDTO,
  RegisterUserDTO,
  VerifyOtpUserDTO,
} from './userAuth.dto';
import { UserAuthGuard } from './userAuth.guard';
import type { RequestWithUser } from './userAuth.guard';
import { UserAuthService } from './userAuth.service';

@Controller('users/auth')
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
  ) {}

  @Post('register')
  register(
    @Body() dto: RegisterUserDTO,
  ): Promise<object> {
    return this.userAuthService.register(dto);
  }

  @Post('verify-otp')
  verifyOtp(
    @Body() dto: VerifyOtpUserDTO,
  ): Promise<{ message: string }> {
    return this.userAuthService.verifyOtp(
      dto.email,
      dto.otp,
    );
  }

  @Post('login')
  login(
    @Body() dto: LoginUserDTO,
  ): Promise<{ access_token: string }> {
    return this.userAuthService.login(dto);
  }

  @UseGuards(UserAuthGuard)
  @Get('profile')
  getProfile(
    @Req() request: RequestWithUser,
  ): Promise<object> {
    return this.userAuthService.getProfile(
      request.user.sub,
    );
  }
}