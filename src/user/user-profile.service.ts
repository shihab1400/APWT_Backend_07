import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserProfileDTO,
  UpdateUserProfileDTO,
} from './user-profile.dto';
import { UserProfileEntity } from './user-profile.entity';
import { UserEntity } from './user.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly profileRepository: Repository<UserProfileEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createProfile(
    userId: number,
    dto: CreateUserProfileDTO,
  ): Promise<UserProfileEntity> {
    const user = await this.userRepository.findOne({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Non-Paid Patient account not found',
      );
    }

    const existingProfile =
      await this.profileRepository.findOne({
        where: {
          user: {
            userId,
          },
        },
      });

    if (existingProfile) {
      throw new ConflictException(
        'A profile already exists for this user',
      );
    }

    const profile = this.profileRepository.create({
      address: dto.address,
      emergencyContact: dto.emergencyContact,
      bloodGroup: dto.bloodGroup ?? null,
      occupation: dto.occupation ?? null,
      bio: dto.bio ?? null,
      user,
    });

    return this.profileRepository.save(profile);
  }

  async getProfile(
    userId: number,
  ): Promise<UserProfileEntity> {
    const profile =
      await this.profileRepository.findOne({
        where: {
          user: {
            userId,
          },
        },
      });

    if (!profile) {
      throw new NotFoundException(
        'User profile was not found',
      );
    }

    return profile;
  }

  async updateProfile(
    userId: number,
    dto: UpdateUserProfileDTO,
  ): Promise<UserProfileEntity> {
    const profile = await this.getProfile(userId);

    if (dto.address !== undefined) {
      profile.address = dto.address;
    }

    if (dto.emergencyContact !== undefined) {
      profile.emergencyContact =
        dto.emergencyContact;
    }

    if (dto.bloodGroup !== undefined) {
      profile.bloodGroup = dto.bloodGroup;
    }

    if (dto.occupation !== undefined) {
      profile.occupation = dto.occupation;
    }

    if (dto.bio !== undefined) {
      profile.bio = dto.bio;
    }

    return this.profileRepository.save(profile);
  }

  async deleteProfile(
    userId: number,
  ): Promise<{ message: string }> {
    const profile = await this.getProfile(userId);

    await this.profileRepository.remove(profile);

    return {
      message: 'User profile deleted successfully',
    };
  }
}