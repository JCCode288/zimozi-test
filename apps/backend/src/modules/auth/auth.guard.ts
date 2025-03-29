import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminService } from '../user/admin/admin.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const auth = context.switchToHttp().getRequest()?.headers?.authorization;

      if (!auth) throw new UnauthorizedException('unauthorized');

      const [type, token] = auth.split(' ');

      if (!type || type !== 'Bearer' || !token)
        throw new UnauthorizedException('unauthorized_1');

      return true;
    } catch (err) {
      throw new UnauthorizedException('unauthorized_2');
    }
  }
}
