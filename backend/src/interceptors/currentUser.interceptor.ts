import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const { user } = request.session || {};
    if (user) {
      // const { email } = user;
      // const currentUser = await this.authService.findUser(email);
      request.currentUser = user;
    }
    next.handle();
  }
}
