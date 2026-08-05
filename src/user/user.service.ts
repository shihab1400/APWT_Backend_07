import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import {
  UpdateStatusDTO,
  UpdateUserDTO,
  UserDTO,
} from './user.dto';
import {
  UserEntity,
  UserStatus,
} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({
      order: {
        userId: 'ASC',
      },
    });
  }

  getActiveUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: {
        status: UserStatus.ACTIVE,
      },
      order: {
        userId: 'ASC',
      },
    });
  }

  getInactiveUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: {
        status: UserStatus.INACTIVE,
      },
      order: {
        userId: 'ASC',
      },
    });
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Non-Paid Patient with ID ${id} was not found`,
      );
    }

    return user;
  }

  async createUser(data: UserDTO): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      fullName: data.fullName,
      age: data.age,
      status: data.status ?? UserStatus.ACTIVE,
    });

    return this.userRepository.save(newUser);
  }

  async changeStatus(
    id: number,
    statusData: UpdateStatusDTO,
  ): Promise<UserEntity> {
    const user = await this.getUserById(id);

    user.status = statusData.status;

    return this.userRepository.save(user);
  }

  getUsersOlderThan(age: number): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: {
        age: MoreThan(age),
      },
      order: {
        age: 'ASC',
      },
    });
  }

  async updateUser(
    id: number,
    data: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = await this.getUserById(id);

    user.fullName = data.fullName;
    user.age = data.age;
    user.phone = data.phone;

    return this.userRepository.save(user);
  }

  async deleteUser(
    id: number,
  ): Promise<{ message: string }> {
    const user = await this.getUserById(id);

    await this.userRepository.remove(user);

    return {
      message: `Non-Paid Patient with ID ${id} deleted successfully`,
    };
  }

  validateLabTwoData(
    fullName: string,
    phone: string,
    fileName: string,
    mimeType: string,
  ): object {
    let fileType = mimeType;

    if (mimeType === 'application/pdf') {
      fileType = 'PDF';
    }

    if (mimeType === 'image/jpeg') {
      fileType = 'JPG/JPEG';
    }

    return {
      message: 'Lab 2 Task 3 validation successful',
      role: 'Non-Paid Patient',
      fullName,
      phone,
      uploadedFile: fileName,
      fileType,
    };
  }
}