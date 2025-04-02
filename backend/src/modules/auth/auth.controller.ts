import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './interfaces/auth.interface';
import { AuthGuard } from './auth.guard';
import { User } from '../user/user.decorator';
import UserEntity from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('v1/register')
  register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @Get('v1/validate')
  @UseGuards(AuthGuard)
  validateUser(@User() user: UserEntity) {
    return user;
  }
}
