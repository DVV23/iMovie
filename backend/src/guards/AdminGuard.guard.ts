import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { currentUser } = context.switchToHttp().getRequest();
    if (currentUser?.role === 'admin') return currentUser;
    return false;
  }
}
