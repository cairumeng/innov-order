import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos/auth.dto';

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
    return this.authService.login(authDTO);
  }
}
