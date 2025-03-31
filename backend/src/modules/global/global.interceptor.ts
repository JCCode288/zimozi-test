import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();
        const path = context.switchToHttp().getRequest().path;

        if (path.includes('image')) {
          res.set('Content-Type', 'image');

          return res.send(data);
        }

        return { status: res.statusCode, message: 'OK', data };
      }),
    );
  }
}
