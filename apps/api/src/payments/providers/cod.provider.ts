import { Injectable } from '@nestjs/common';

@Injectable()
export class CodProvider {
  async initiate(amount: number, meta: Record<string, any>) {
    return {
      provider: 'cod',
      reference: 'COD-' + Math.random().toString(36).slice(2, 10),
      meta,
    };
  }
}


