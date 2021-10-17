import { isNotEmpty, IsNotEmpty, MinLength } from 'class-validator';

export class PasswordDTO {
  @IsNotEmpty()
  @MinLength(6, { message: 'Password should not be shorter than 6 characters' })
  newPassword: string;

  @IsNotEmpty()
  currentPassword: string;
}
