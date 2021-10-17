import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../../entity/User';
import { PasswordDTO } from './dtos/password.dto';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos/auth.dto';
import { JwtAuthGuard } from './guards/jwt-guard';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() authDTO: AuthDTO) {
    return await this.authService.signUp(authDTO);
  }

  @Post('login')
  async login(@Body() authDTO: AuthDTO) {
    const token = await this.authService.login(authDTO);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async update(@Body() PasswordDTO: PasswordDTO, @Req() req: any) {
    const user: User = req.user;
    return await this.authService.changePassword(user, PasswordDTO);
  }
}
