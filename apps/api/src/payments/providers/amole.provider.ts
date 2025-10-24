import { Injectable } from '@nestjs/common';

@Injectable()
export class AmoleProvider {
  async initiate(amount: number, meta: Record<string, any>) {
    return {
      provider: 'amole',
      reference: 'AM-' + Math.random().toString(36).slice(2, 10),
      redirectUrl: 'https://amole.example/checkout',
      meta,
    };
  }
}


