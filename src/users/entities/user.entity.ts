import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';

@Entity('users') // tên bảng trong MySQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ho_ten: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mat_khau: string;

  @Column()
  vai_tro: string;

  @Column({ nullable: true })
  so_dien_thoai: string;

  @Column()
  avatar_url: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  email_token: string;

  @Column({ nullable: true })
  token_expires: Date;

  @Column({ 
    type: 'enum',
    enum: ['inactive', 'active', 'blocked'],
    default: 'inactive'
  })
  status: string;

  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
