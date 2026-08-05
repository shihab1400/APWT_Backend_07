import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  doctorId: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
  })
  specialization: string;

  @Column({
    type: 'varchar',
  })
  licenseNumber: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  profilePic: string | null;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  otp: string | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @OneToMany(
    () => AppointmentEntity,
    (appointment) => appointment.doctor,
  )
  appointments: AppointmentEntity[];
}