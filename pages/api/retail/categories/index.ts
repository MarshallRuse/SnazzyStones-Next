import { NextApiRequest, NextApiResponse } from "next";
import { fetchCategoriesFromCache } from "../../../../utils/fetching/categories/etsyCategories";
import { ShopSectionResponse } from "../../../../types/EtsyAPITypes";

export interface APICategoriesResponse {
    categories: ShopSectionResponse[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APICategoriesResponse>) {
    const categories = await fetchCategoriesFromCache();
    res.status(200).json({
        categories,
    });
}
