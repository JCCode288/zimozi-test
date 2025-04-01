import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export default class GlobalExceptionHandler implements ExceptionFilter {
  constructor(private readonly httpAdapter: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    Logger.error(exception, 'GlobalException');
    const { httpAdapter } = this.httpAdapter;

    const res = host.switchToHttp().getResponse();
    const status = this.getStatus(exception);
    const data = this.getMessage(exception);
    const message = 'error happened';

    httpAdapter.reply(res, { status, message, data }, status);
  }

  getStatus(exception: unknown) {
    switch (true) {
      case exception instanceof HttpException:
        return exception.getStatus();

      default:
        return 500;
    }
  }

  getMessage(exception: unknown): string[] {
    let message: string[] | undefined;
    switch (true) {
      case exception instanceof BadRequestException:
        const resBad = (exception as any).getResponse();
        message = resBad.message ?? resBad;

        if (Array.isArray(message)) message = message;
        if (typeof message === 'string') message = [message];

        if (!message) message = ['internal server error'];

        return message;
      case exception instanceof HttpException:
        const res = exception.getResponse();

        if (Array.isArray(res)) message = res;
        if (typeof res === 'string') message = [res];

        if (!message) message = ['internal server error'];

        return message;

      default:
        return ['internal server error'];
    }
  }
}
