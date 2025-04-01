import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule],
  providers: [AuthGuard, AuthService, AuthInterceptor],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
