import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.correlationId = req.headers['x-correlation-id'] || uuid();
    res.setHeader('x-correlation-id', req.correlationId);
    next();
  }
}


