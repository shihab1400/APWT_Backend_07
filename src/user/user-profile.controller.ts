import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserProfileDTO,
  UpdateUserProfileDTO,
} from './user-profile.dto';
import { UserProfileEntity } from './user-profile.entity';
import { UserProfileService } from './user-profile.service';
import { UserAuthGuard } from './userAuth/userAuth.guard';
import type { RequestWithUser } from './userAuth/userAuth.guard';

@Controller('users/account/profile')
@UseGuards(UserAuthGuard)
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
  ) {}

  @Post()
  createProfile(
    @Req() request: RequestWithUser,
    @Body() dto: CreateUserProfileDTO,
  ): Promise<UserProfileEntity> {
    return this.userProfileService.createProfile(
      request.user.sub,
      dto,
    );
  }

  @Get()
  getProfile(
    @Req() request: RequestWithUser,
  ): Promise<UserProfileEntity> {
    return this.userProfileService.getProfile(
      request.user.sub,
    );
  }

  @Put()
  updateProfile(
    @Req() request: RequestWithUser,
    @Body() dto: UpdateUserProfileDTO,
  ): Promise<UserProfileEntity> {
    return this.userProfileService.updateProfile(
      request.user.sub,
      dto,
    );
  }

  @Delete()
  deleteProfile(
    @Req() request: RequestWithUser,
  ): Promise<{ message: string }> {
    return this.userProfileService.deleteProfile(
      request.user.sub,
    );
  }
}