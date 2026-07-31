import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('doctor')
export class DoctorEntity {
    @PrimaryGeneratedColumn()
    id!: number;

  @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    uniqueId!: string;

  @Column({
        type: 'varchar',
        nullable: true,
    })
    name!: string;

  @Column()
    password!: string;

  @Column()
    appointmentDate!: string;

  @Column()
    socialMedia!: string;

  @Column({
        nullable: true,
    })
    patientReport!: string;

  @CreateDateColumn()
    joiningDate!: Date;
    @Column({
        type: 'varchar',
        length: 30,
        default: 'Unknown',
    })
    country!: string;

  @BeforeInsert()
  generateUUID() {
    this.uniqueId = randomUUID();
  }
}