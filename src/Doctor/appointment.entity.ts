import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DoctorEntity } from './doctor.entity';


export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  appointmentId: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  patientName: string;

  @Column({
    type: 'varchar',
  })
  appointmentDate: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  reason: string | null;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: 'int',
    nullable: true,
  })
  userId: number | null;

  @ManyToOne(
    () => UserEntity,
    (user) => user.appointments,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity | null;

  @ManyToOne(
    () => DoctorEntity,
    (doctor) => doctor.appointments,
    {
      onDelete: 'CASCADE',
    },
  )
  doctor: DoctorEntity;
}