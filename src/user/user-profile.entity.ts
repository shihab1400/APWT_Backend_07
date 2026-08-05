import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('non_paid_user_profiles')
export class UserProfileEntity {
  @PrimaryGeneratedColumn()
  profileId: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  emergencyContact: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  bloodGroup: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  occupation: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  bio: string | null;

  @OneToOne(
    () => UserEntity,
    (user) => user.profile,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;
}