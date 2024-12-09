import { Injectable, NestMiddleware } from '@nestjs/common';
import xss from 'xss';

@Injectable()
export class XSSMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void) {
    console.log('entered middleware');
    if (req.body) {
      req.body = xss(req.body);
      console.log('sanitizied body');
    }
    next();
  }
}
