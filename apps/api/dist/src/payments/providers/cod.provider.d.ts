export declare class CodProvider {
    initiate(amount: number, meta: Record<string, any>): Promise<{
        provider: string;
        reference: string;
        meta: Record<string, any>;
    }>;
}
