import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const user = req?.user;

      if (!user || !user.admin) throw new UnauthorizedException('unauthorized');

      return true;
    } catch (err) {
      console.error(err);
      if (err instanceof UnauthorizedException) throw err;

      throw new UnauthorizedException('unauthorized_2');
    }
  }
}
