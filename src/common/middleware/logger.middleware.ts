// export function logger(req, res, next) {
//   const { method, path } = req;
//   console.log(`${method} ${path}`);
//   next();
// }
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request... + 这是啥');
    next();
  }
}
