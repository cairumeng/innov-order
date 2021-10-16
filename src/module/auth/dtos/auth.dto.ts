import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password should not be shorter than 6 characters' })
  password: string;
}
