import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserStatus } from '../users/enums/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
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

    // Tạo token xác thực email
    const emailToken = randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // Token hết hạn sau 24 giờ

    // Tạo user mới với vai_tro mặc định là 'user' và status là 'inactive'
    const createUserDto: CreateUserDto = {
      ...dto,
      mat_khau: hashedPassword,
      vai_tro: 'user',
      avatar_url: '',
      so_dien_thoai: dto.so_dien_thoai || '',
      email_verified: false,
      email_token: emailToken,
      token_expires: tokenExpires,
      status: UserStatus.INACTIVE,
    };
    const user = await this.usersService.create(createUserDto);

    // Gửi email xác thực
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        emailToken,
        user.ho_ten,
      );
    } catch (error) {
      console.error('Lỗi gửi email xác thực:', error);
      // Không throw error để không ảnh hưởng đến việc tạo user
    }

    return {
      message:
        'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      user: {
        id: user.id,
        ho_ten: user.ho_ten,
        email: user.email,
        vai_tro: user.vai_tro,
        email_verified: user.email_verified,
      },
    };
  }

  async login(dto: LoginDto) {
    const users = await this.usersService.findAll();
    const user = users.find((u) => u.email === dto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(dto.mat_khau, user.mat_khau);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user.email_verified) {
      throw new UnauthorizedException(
        'Vui lòng xác thực email trước khi đăng nhập',
      );
    }

    if (user.status === UserStatus.ACTIVE) {
      const payload = {
        email: user.email,
        sub: user.id,
        vai_tro: user.vai_tro,
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          ho_ten: user.ho_ten,
          email: user.email,
          vai_tro: user.vai_tro,
          email_verified: user.email_verified,
        },
      };
    }
  }

  async verifyEmail(token: string) {
    const users = await this.usersService.findAll();
    const user = users.find((u) => u.email_token === token);

    if (!user) {
      throw new BadRequestException('Token xác thực không hợp lệ');
    }

    if (user.email_verified) {
      throw new BadRequestException('Email đã được xác thực trước đó');
    }

    if (user.token_expires && new Date() > user.token_expires) {
      throw new BadRequestException('Token xác thực đã hết hạn');
    }

    // Cập nhật trạng thái xác thực
    await this.usersService.update(user.id, {
      email_verified: true,
      email_token: '',
      token_expires: '',
      status: UserStatus.ACTIVE,
    } as any); // Sử dụng type assertion tạm thời

    // Gửi email chào mừng
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.ho_ten);
    } catch (error) {
      console.error('Lỗi gửi email chào mừng:', error);
    }

    return {
      message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.',
    };
  }

  async resendVerificationEmail(email: string) {
    const users = await this.usersService.findAll();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    if (user.email_verified) {
      throw new BadRequestException('Email đã được xác thực');
    }

    // Tạo token mới
    const emailToken = randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24);

    // Cập nhật token mới
    await this.usersService.update(user.id, {
      email_token: emailToken,
      token_expires: tokenExpires,
    } as any); // Sử dụng type assertion tạm thời

    // Gửi email xác thực mới
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        emailToken,
        user.ho_ten,
      );
    } catch (error) {
      console.error('Lỗi gửi email xác thực:', error);
      throw new BadRequestException('Không thể gửi email xác thực');
    }

    return {
      message:
        'Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.',
    };
  }
}
