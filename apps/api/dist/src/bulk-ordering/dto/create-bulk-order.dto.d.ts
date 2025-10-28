export declare class BulkOrderItemDto {
    productId: string;
    skuId?: string;
    quantity: number;
    notes?: string;
}
export declare class CreateBulkOrderDto {
    merchantId: string;
    items: BulkOrderItemDto[];
    notes?: string;
}
