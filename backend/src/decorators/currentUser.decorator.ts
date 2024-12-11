import {
  createParamDecorator,
  ExecutionContext,
  Session,
} from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const { currentUser } = context.switchToHttp().getRequest();
    return currentUser;
  },
);
