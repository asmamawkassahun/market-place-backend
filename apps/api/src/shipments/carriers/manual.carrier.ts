import { Injectable } from '@nestjs/common';
import { CarrierAdapter, CarrierCreateResult } from './carrier.interface';

@Injectable()
export class ManualCarrier implements CarrierAdapter {
  name() { return 'manual'; }
  async createShipment(orderId: string): Promise<CarrierCreateResult> {
    return { trackingCode: 'MAN-' + orderId.slice(0, 6).toUpperCase() };
  }
}


