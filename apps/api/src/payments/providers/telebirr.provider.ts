import { Injectable } from '@nestjs/common';

@Injectable()
export class TelebirrProvider {
  async initiate(amount: number, meta: Record<string, any>) {
    // Stub: return redirect URL and reference
    return {
      provider: 'telebirr',
      reference: 'TB-' + Math.random().toString(36).slice(2, 10),
      redirectUrl: 'https://telebirr.example/checkout',
      meta,
    };
  }
}


