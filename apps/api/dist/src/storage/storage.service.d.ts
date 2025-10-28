export declare class StorageService {
    private s3;
    upload(key: string, body: Buffer, contentType: string): Promise<{
        url: string;
    }>;
}
