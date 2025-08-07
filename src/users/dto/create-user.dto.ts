import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum UserStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  BLOCKED = 'blocked'
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  ho_ten: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  mat_khau: string;

  @IsString({ message: 'Vai trò phải là chuỗi ký tự' })
  vai_tro: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @IsOptional()
  so_dien_thoai?: string;

  @IsString({ message: 'Avatar URL phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Avatar URL không được để trống' })
  avatar_url: string;

  @IsOptional()
  email_verified: boolean;

  @IsOptional()
  email_token?: string;

  @IsOptional()
  token_expires?: Date;

  @IsEnum(UserStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: UserStatus;
}
