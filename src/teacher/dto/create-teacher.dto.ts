import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  ho_ten: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  mat_khau: string;

  @IsNotEmpty()
  @IsString()
  so_dien_thoai: string;

  @IsNotEmpty()
  avatar_url: string;
}
