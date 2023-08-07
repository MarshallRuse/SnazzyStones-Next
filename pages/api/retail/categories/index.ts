import { NextApiRequest, NextApiResponse } from "next";
import { fetchCategoriesFromCache } from "../../../../utils/fetching/categories/etsyCategories";
import { CategoriesMinAPIData } from "../../../../types/Types";

export interface APICategoriesResponse {
    categories: CategoriesMinAPIData[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APICategoriesResponse>) {
    const categories = await fetchCategoriesFromCache();
    res.status(200).json({
        categories,
    });
}
