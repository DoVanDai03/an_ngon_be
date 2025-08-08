import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TeacherStatus } from '../enums/status.enum';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ho_ten: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mat_khau: string;

  @Column()
  so_dien_thoai: string;

  @Column()
  avatar_url: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  verify_token: string;

  @Column({ 
    type: 'enum',
    enum: TeacherStatus,
    default: TeacherStatus.INACTIVE
  })
  status: TeacherStatus;

  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
