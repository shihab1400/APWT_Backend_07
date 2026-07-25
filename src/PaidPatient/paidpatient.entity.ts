import { AdminEntity } from 'src/admin/admin.entity';
import { 
  Entity, 
  Column, 
  PrimaryColumn, 
  BeforeInsert, 
  JoinColumn,
  ManyToOne
} from 'typeorm';


@Entity('paidpatient')

export class PaidPatientEntity {


  @PrimaryColumn()
  patientId: string;


  @Column({
    type:'varchar',
    length:100,
    unique:true
  })
  username: string;



  @Column({
    type:'varchar',
    length:150
  })
  fullName: string;



  @Column({
    type:'varchar'
  })
  phone: string;



  @Column({
    type:'varchar'
  })
  password: string;



  @Column({
    default:false
  })
  isActive: boolean;



  @Column({
    type:'varchar',
    nullable:true
  })
  filename: string | null;



  @BeforeInsert()
  generateId(){


    const timerand = String(Date.now()).slice(-4);

    const now = new Date();

    const day = String(now.getDate())
    .padStart(2,'0');


    const month = String(now.getMonth()+1)
    .padStart(2,'0');


    const year = String(now.getFullYear())
    .slice(2,4);


    const rand = String(
      Math.floor(10 + Math.random()*90)
    );


    this.patientId =
    `PP-${timerand}-${day}${month}${year}-${rand}`;


  }


// @ManyToOne(() => AdminEntity, (admin) => admin.paidPatients)
  // @JoinColumn({ name: 'adminId' }) // Optional: Explicitly naming the foreign key column 'adminId'
  // admin: AdminEntity;
}