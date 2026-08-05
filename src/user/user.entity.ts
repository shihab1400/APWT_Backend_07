import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentEntity } from '../Doctor/appointment.entity';
import { UserChatEntity } from './user-chat.entity';
import { UserProfileEntity } from './user-profile.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum MembershipStatus {
  NON_PAID = 'non-paid',
  PAID = 'paid',
}

export enum StressLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('non_paid_patients')
@Check(`"age" >= 0`)
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  userId: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  fullName: string;

  @Column({
    type: 'int',
  })
  age: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
    nullable: true,
  })
  email: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  password: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  documentFile: string | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.NON_PAID,
  })
  membershipStatus: MembershipStatus;

  @Column({
    type: 'enum',
    enum: StressLevel,
    nullable: true,
  })
  latestStressLevel: StressLevel | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
    select: false,
  })
  otp: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => UserChatEntity,
    (chat) => chat.user,
  )
  chatMessages: UserChatEntity[];

  @OneToMany(
    () => AppointmentEntity,
    (appointment) => appointment.user,
  )
  appointments: AppointmentEntity[];

  @OneToOne(
    () => UserProfileEntity,
    (profile) => profile.user,
  )
  profile: UserProfileEntity | null;
}