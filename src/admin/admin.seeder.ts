import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async seed() {
    const adminExists = await this.adminRepository.findOne({
      where: { email: 'admin@admin.com' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = this.adminRepository.create({
        ho_ten: 'Admin',
        email: 'admin@admin.com',
        mat_khau: hashedPassword,
        avatar_url: 'https://ui-avatars.com/api/?name=Admin',
      });

      await this.adminRepository.save(admin);
      console.log('Admin seeded successfully');
    } else {
      console.log('Admin already exists');
    }
  }
}
