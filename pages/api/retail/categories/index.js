import cacheData from "memory-cache";
import fetchCategories from "../../../../utils/fetching/categories/etsyCategories";

export default async function handler(req, res) {
    const urlKey = "/api/retail/categories";
    const categoriesData = cacheData.get(urlKey);
    if (categoriesData) {
        res.status(200).json({
            categories: categoriesData,
        });
    } else {
        const categories = await fetchCategories();
        cacheData.put(urlKey, categories, 24 * 1000 * 60 * 60);
        res.status(200).json({
            categories,
        });
    }
}
