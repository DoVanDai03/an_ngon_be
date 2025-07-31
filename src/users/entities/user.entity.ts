import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // tên bảng trong MySQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ho_ten: string;

  @Column()
  email: string;

  @Column()
  mat_khau: string;

  @Column()
  vai_tro: string;

  @Column()
  so_dien_thoai: string;

  @Column()
  avatar_url: string;

  @CreateDateColumn({ type: 'datetime' })
  ngay_tao: Date;
}
