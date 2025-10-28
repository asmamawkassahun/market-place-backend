import { CarrierAdapter, CarrierCreateResult } from './carrier.interface';
export declare class ManualCarrier implements CarrierAdapter {
    name(): string;
    createShipment(orderId: string): Promise<CarrierCreateResult>;
}
