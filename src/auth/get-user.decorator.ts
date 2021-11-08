import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// Get the current user based on the JWT token
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
