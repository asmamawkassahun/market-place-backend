import { Injectable } from '@nestjs/common';

@Injectable()
export class ChapaProvider {
  async initiate(amount: number, meta: Record<string, any>) {
    return {
      provider: 'chapa',
      reference: 'CH-' + Math.random().toString(36).slice(2, 10),
      redirectUrl: 'https://chapa.example/checkout',
      meta,
    };
  }
}


