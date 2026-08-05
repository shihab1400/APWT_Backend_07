import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  LabTwoUserDTO,
  UpdateStatusDTO,
  UpdateUserDTO,
  UserDTO,
} from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('active')
  getActiveUsers(): Promise<UserEntity[]> {
    return this.userService.getActiveUsers();
  }

  @Get()
  getAllUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }

  @Get('inactive')
  getInactiveUsers(): Promise<UserEntity[]> {
    return this.userService.getInactiveUsers();
  }

  @Get('older-than')
  getUsersOlderThan(
    @Query(
      'age',
      new DefaultValuePipe(40),
      ParseIntPipe,
    )
    age: number,
  ): Promise<UserEntity[]> {
    return this.userService.getUsersOlderThan(age);
  }

  @Get(':id')
  getUserById(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(
    @Body()
    data: UserDTO,
  ): Promise<UserEntity> {
    return this.userService.createUser(data);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    statusData: UpdateStatusDTO,
  ): Promise<UserEntity> {
    return this.userService.changeStatus(
      id,
      statusData,
    );
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    data: UpdateUserDTO,
  ): Promise<UserEntity> {
    return this.userService.updateUser(
      id,
      data,
    );
  }

  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }

  @Post('validate-profile')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  validateProfile(
    @Body()
    data: LabTwoUserDTO,

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /^(application\/pdf|image\/jpeg)$/,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: 400,
        }),
    )
    file: Express.Multer.File,
  ): object {
    return this.userService.validateLabTwoData(
      data.fullName,
      data.phone,
      file.originalname,
      file.mimetype,
    );
  }
}