import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    Logger.debug(user, 'User Context');
    return user;
  },
);
