import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      console.log(req.headers);
      const auth = req?.headers?.authorization;

      Logger.debug('token: ' + auth, 'AuthGuard');

      // if (!auth) throw new UnauthorizedException('unauthorized');

      // const [type, token] = auth.split(' ');

      // console.log(type, token);

      // if (!type || type !== 'Bearer' || !token)
      //   throw new UnauthorizedException('unauthorized_1');

      // // check token here
      // const fbsUser = await this.authService.validateToken(token);
      // const user = await this.authService.findUser(fbsUser.uid);

      // if (!user || !user.admin)
      //   throw new UnauthorizedException('unauthorized_1');

      // req.user = user;

      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('unauthorized_2');
    }
  }
}
