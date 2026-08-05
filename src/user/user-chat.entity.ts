import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum UserChatSender {
  USER = 'user',
  BOT = 'bot',
}

@Entity('non_paid_user_chats')
export class UserChatEntity {
  @PrimaryGeneratedColumn('uuid')
  chatId: string;

  @Column({
    type: 'text',
  })
  message: string;

  @Column({
    type: 'enum',
    enum: UserChatSender,
  })
  sender: UserChatSender;

  @Column({
    type: 'int',
  })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => UserEntity,
    (user) => user.chatMessages,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;
}