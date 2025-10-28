export declare class ChapaProvider {
    initiate(amount: number, meta: Record<string, any>): Promise<{
        provider: string;
        reference: string;
        redirectUrl: string;
        meta: Record<string, any>;
    }>;
}
