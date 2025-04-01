import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const path = req.path;
    const method = req.method;

    Logger.verbose('request to path: ' + path, method);

    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();

        if (path.includes('image')) {
          res.set('Content-Type', 'image');

          return res.send(data);
        }

        if (data.data) {
          return { status: res.statusCode, message: 'OK', ...data };
        }

        return { status: res.statusCode, message: 'OK', data };
      }),
    );
  }
}
