import { NextResponse } from 'next/server';
import { ProductMinAPIData } from '@/types/Types';
import { fetchProductsFromCache } from '@/utils/fetching/products/etsyProducts';

export interface APIProductsResponse {
    products: Partial<ProductMinAPIData>[] | ProductMinAPIData[];
}

export async function GET(request: Request) {
    const shopListings = await fetchProductsFromCache();
    const { searchParams } = new URL(request.url);
    const fields = searchParams.get('fields');

    let activeShopListingsFormatted: Partial<ProductMinAPIData>[] | undefined = undefined;

    if (fields) {
        const fieldList = fields.split(',');
        activeShopListingsFormatted = shopListings?.map((prod) => {
            const obj: Partial<ProductMinAPIData> = {};
            for (const field of fieldList) {
                obj[field] = prod[field];
            }
            return obj;
        });
    }

    return NextResponse.json<APIProductsResponse>({
        products: activeShopListingsFormatted !== undefined ? activeShopListingsFormatted : shopListings,
    });
}
