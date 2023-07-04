import { NextApiRequest, NextApiResponse } from "next";
import fetchCategories from "../../../../utils/fetching/categories/etsyCategories";
import { ShopSectionResponse } from "../../../../types/EtsyAPITypes";

export interface APICategoriesResponse {
    categories: ShopSectionResponse[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APICategoriesResponse>) {
    const categories = await fetchCategories();
    res.status(200).json({
        categories,
    });
}
