// Core
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Tools
import { IJwtPayload } from '../interfaces/auth';

export const GetUsername = createParamDecorator(
  (data: keyof IJwtPayload | undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user.username;
  },
);
