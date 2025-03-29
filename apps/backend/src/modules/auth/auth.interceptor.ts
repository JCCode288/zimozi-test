import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminService } from '../user/admin/admin.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly adminService: AdminService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
