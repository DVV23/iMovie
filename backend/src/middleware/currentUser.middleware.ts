import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserDocument } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(request: any, response: Response, next: NextFunction) {
    const { email } = request.session || {};
    if (email) {
      const user = await this.usersService.findUser(email);
      request.currentUser = user;
    }
    next();
  }
}
