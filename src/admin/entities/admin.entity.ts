import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ho_ten: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mat_khau: string;

  @Column()
  avatar_url: string;

  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
