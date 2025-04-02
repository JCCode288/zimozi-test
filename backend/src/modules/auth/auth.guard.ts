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

      if (!auth) throw new UnauthorizedException('unauthenticated');

      const [type, token] = auth.split(' ');

      if (!type || type !== 'Bearer' || !token)
        throw new UnauthorizedException('unauthenticated_1');

      // check token here
      const fbsUser = await this.authService.validateToken(token);
      const user = await this.authService.findUser(fbsUser.uid);

      if (!user) throw new UnauthorizedException('unauthenticated_1');

      req.user = user;

      return true;
    } catch (err) {
      console.error(err);
      if (err instanceof UnauthorizedException) throw err;

      throw new UnauthorizedException('unauthenticated_2');
    }
  }
}
