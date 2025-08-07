import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: { token: string }) {
    if (!body.token) {
      throw new BadRequestException('Token xác thực không được cung cấp');
    }
    return this.authService.verifyEmail(body.token);
  }

  @Post('resend-verification')
  resendVerificationEmail(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email không được cung cấp');
    }
    return this.authService.resendVerificationEmail(body.email);
  }
}
