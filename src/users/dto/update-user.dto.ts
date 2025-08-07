import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  ho_ten?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  mat_khau?: string;

  @IsOptional()
  @IsString({ message: 'Vai trò phải là chuỗi ký tự' })
  vai_tro?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  so_dien_thoai?: string;

  @IsOptional()
  @IsString({ message: 'Avatar URL phải là chuỗi ký tự' })
  avatar_url?: string;

  @IsOptional()
  @IsBoolean({ message: 'Email verified phải là boolean' })
  email_verified?: boolean;

  @IsOptional()
  @IsString({ message: 'Email token phải là chuỗi ký tự' })
  email_token?: string;

  @IsOptional()
  token_expires?: Date;
}
