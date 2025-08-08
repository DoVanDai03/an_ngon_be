import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginRestaurantDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  mat_khau: string;
}
