import { NextResponse } from 'next/server';
import { fetchCategoriesFromCache } from '@/utils/fetching/categories/etsyCategories';
import { CategoriesMinAPIData } from '@/types/Types';

export interface APICategoriesResponse {
    categories: CategoriesMinAPIData[];
}

export async function GET() {
    const categories = await fetchCategoriesFromCache();

    return NextResponse.json<APICategoriesResponse>({
        categories,
    });
}
