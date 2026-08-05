import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  MembershipStatus,
  UserEntity,
  UserStatus,
} from '../user.entity';
import { UserMailService } from '../userMail/userMail.service';
import {
  LoginUserDTO,
  RegisterUserDTO,
} from './userAuth.dto';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,

    private readonly userMailService: UserMailService,
  ) {}

  async register(
    dto: RegisterUserDTO,
  ): Promise<object> {
    const normalizedEmail = dto.email
      .trim()
      .toLowerCase();

    const existingUser =
      await this.userRepository.findOne({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingUser) {
      throw new HttpException(
        'An account already exists with this email',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword =
      await bcrypt.hash(dto.password, 10);

    const generatedOtp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = this.userRepository.create({
      fullName: dto.fullName,
      age: dto.age,
      email: normalizedEmail,
      password: hashedPassword,
      phone: dto.phone,
      status: UserStatus.ACTIVE,
      membershipStatus:
        MembershipStatus.NON_PAID,
      latestStressLevel: null,
      documentFile: null,
      isVerified: false,
      otp: generatedOtp,
    });

    const savedUser =
      await this.userRepository.save(user);

    await this.userMailService.sendOtpEmail(
      normalizedEmail,
      dto.fullName,
      generatedOtp,
    );

    return {
      message:
        'Registration successful. The verification OTP was sent to your email.',
      userId: savedUser.userId,
      email: normalizedEmail,
    };
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ message: string }> {
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.otp')
      .where('user.email = :email', {
        email: normalizedEmail,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(
        'Non-Paid Patient account not found',
      );
    }

    if (user.isVerified) {
      throw new BadRequestException(
        'Account is already verified',
      );
    }

    if (user.otp !== otp) {
      throw new BadRequestException(
        'Invalid OTP',
      );
    }

    user.isVerified = true;
    user.otp = null;

    await this.userRepository.save(user);

    if (user.email) {
      await this.userMailService.sendWelcomeEmail(
        user.email,
        user.fullName,
      );
    }

    return {
      message:
        'Account verified successfully',
    };
  }

  async login(
    dto: LoginUserDTO,
  ): Promise<{ access_token: string }> {
    const normalizedEmail = dto.email
      .trim()
      .toLowerCase();

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', {
        email: normalizedEmail,
      })
      .getOne();

    if (!user || !user.password) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Verify your account before logging in',
      );
    }

    const passwordMatched =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!passwordMatched) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      role: 'non-paid-patient',
    };

    return {
      access_token:
        await this.jwtService.signAsync(
          payload,
        ),
    };
  }

  async getProfile(
    userId: number,
  ): Promise<object> {
    const user =
      await this.userRepository.findOne({
        where: {
          userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Non-Paid Patient account not found',
      );
    }

    return {
      userId: user.userId,
      fullName: user.fullName,
      age: user.age,
      email: user.email,
      phone: user.phone,
      status: user.status,
      membershipStatus:
        user.membershipStatus,
      latestStressLevel:
        user.latestStressLevel,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}