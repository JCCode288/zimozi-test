import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export default class GlobalExceptionHandler implements ExceptionFilter {
  constructor(private readonly httpAdapter: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapter;

    const res = host.switchToHttp().getResponse();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    httpAdapter.reply(res, { status, message });
  }

  getStatus(exception: unknown) {
    switch (true) {
      case exception instanceof HttpException:
        return exception.getStatus();

      default:
        return 500;
    }
  }

  getMessage(exception: unknown) {
    switch (true) {
      case exception instanceof HttpException:
        return exception.getResponse() as string;

      default:
        return 'ise_0';
    }
  }
}
