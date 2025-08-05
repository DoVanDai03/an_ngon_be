import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);
    return {
      status: true,
      message: 'Đăng ký thành công',
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { user, token } = await this.authService.login(dto);
    return {
      status: true,
      message: 'Đăng nhập thành công',
      token,
      data: user,
    };
  }
}
