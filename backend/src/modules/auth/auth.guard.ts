import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const auth = req?.headers?.authorization;

      if (!auth) throw new UnauthorizedException('unauthorized');

      const [type, token] = auth.split(' ');

      if (!type || type !== 'Bearer' || !token)
        throw new UnauthorizedException('unauthorized_1');

      // check token here
      const fbsUser = await this.authService.validateToken(token);
      const user = await this.authService.findUser(fbsUser.uid);

      if (!user || !user.admin)
        throw new UnauthorizedException('unauthorized_1');

      req.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException('unauthorized_2');
    }
  }
}
