import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginTeacherDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  mat_khau: string;
}
