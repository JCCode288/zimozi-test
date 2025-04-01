import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('v1/register')
  register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }
}
