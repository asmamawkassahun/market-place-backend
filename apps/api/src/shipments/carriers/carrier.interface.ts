export interface CarrierCreateResult {
  trackingCode?: string;
}

export interface CarrierAdapter {
  name(): string;
  createShipment(orderId: string): Promise<CarrierCreateResult>;
}


