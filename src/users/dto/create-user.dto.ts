import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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

  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsString({ message: 'Vai trò phải là chuỗi ký tự' })
  vai_tro: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  so_dien_thoai: string;

  @IsString({ message: 'Avatar URL phải là chuỗi ký tự' })
  avatar_url: string;
}
