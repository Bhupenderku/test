import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    default: 'other',
  })
  gender: string;

  @Column({ nullable: true })
  photo: string;

  @OneToOne(() => User, (user) => user.details, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
