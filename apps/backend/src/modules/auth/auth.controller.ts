import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './interfaces/auth.interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    if (!loginDto.email || !loginDto.password)
      throw new HttpException('invalid credential', 400);

    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDTO) {
    if (!registerDto.email || !registerDto.name || !registerDto.password)
      throw new HttpException('fields not filled', 400);

    return this.authService.register(registerDto)
  }
}
