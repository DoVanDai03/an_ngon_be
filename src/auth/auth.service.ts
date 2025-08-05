import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const users = await this.usersService.findAll();
    const existed = users.find((u) => u.email === dto.email);
    if (existed) {
      throw new BadRequestException('Email đã được sử dụng');
    }
    // Hash mật khẩu
    const hashedPassword: string = await bcrypt.hash(dto.mat_khau, 10);
    // Tạo user mới với vai_tro mặc định là 'user'
    const createUserDto: CreateUserDto = {
      ...dto,
      mat_khau: hashedPassword,
      vai_tro: 'user',
      avatar_url: '',
      so_dien_thoai: '',
    };
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  async login(dto: LoginDto) {
    const users = await this.usersService.findAll();
    const user = users.find((u) => u.email === dto.email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    if (!dto.mat_khau) {
      throw new BadRequestException('Mật khẩu là bắt buộc');
    }
    if (!user.mat_khau) {
      throw new BadRequestException('Tài khoản này chưa có mật khẩu');
    }
    const isPasswordValid = await bcrypt.compare(dto.mat_khau, user.mat_khau);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }
    // Sinh JWT
    const payload = { sub: user.id, email: user.email, vai_tro: user.vai_tro };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
}
