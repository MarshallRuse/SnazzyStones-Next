import { getCategories } from "../../../../utils/fetching/categories/cachedCategories";

export default async function handler(req, res) {
    const categories = await getCategories();
    res.status(200).json({
        categories,
    });
}
