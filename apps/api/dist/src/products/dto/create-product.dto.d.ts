export declare class CreateSku {
    name: string;
    unitType: string;
    unitIncrement?: number;
    packageSize?: number;
    pricePerCanonicalUnit?: number;
    currency?: string;
    active?: boolean;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    categoryId?: string;
    description?: string;
    images?: string[];
    skus?: CreateSku[];
}
