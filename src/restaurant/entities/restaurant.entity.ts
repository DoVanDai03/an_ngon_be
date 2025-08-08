import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RestaurantStatus } from '../enums/status.enum';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ten_nha_hang: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mat_khau: string;

  @Column()
  dia_chi: string;

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
    enum: RestaurantStatus,
    default: RestaurantStatus.INACTIVE
  })
  status: RestaurantStatus;

  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;

  @UpdateDateColumn({ type: 'datetime' })
  ngay_cap_nhat: Date;
}
