import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    const admin = await this.adminService.login(loginAdminDto);
    return {
      status: true,
      message: 'Đăng nhập admin thành công',
      data: admin,
    };
  }
}
