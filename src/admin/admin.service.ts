import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async login(dto: LoginAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email }
    });

    if (!admin) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Note: In production, you should use bcrypt to compare hashed passwords
    if (admin.mat_khau !== dto.mat_khau) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    return admin;
  }
}
