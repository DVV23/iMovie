import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserDocument } from 'src/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(request: any, response: Response, next: NextFunction) {
    const { email } = request.session || {};
    if (email) {
      const user = await this.authService.findUser(email);
      request.currentUser = user;
    }
    next();
  }
}
