import { getCategories } from "../../../../utils/fetching/categories/cachedCategories";

export default async function handler(req, res) {
    const fetchedCategories = await getCategories();
    const categories = fetchedCategories.results;
    res.status(200).json({
        categories,
    });
}
