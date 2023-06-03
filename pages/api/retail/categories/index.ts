import { NextApiRequest, NextApiResponse } from "next";
import fetchCategories from "../../../../utils/fetching/categories/etsyCategories";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const categories = await fetchCategories();
    res.status(200).json({
        categories,
    });
}
