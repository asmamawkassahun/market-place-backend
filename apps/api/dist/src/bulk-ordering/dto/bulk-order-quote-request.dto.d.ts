export declare class QuoteItemDto {
    productId: string;
    skuId?: string;
    quantity: number;
}
export declare class BulkOrderQuoteRequestDto {
    merchantId: string;
    items: QuoteItemDto[];
    notes?: string;
}
