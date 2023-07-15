import { kv } from "@vercel/kv";
import { ShopSectionResponse } from "../../../types/EtsyAPITypes";

export async function fetchCategoriesFromEtsy(): Promise<ShopSectionResponse[]> {
    // get a list of Etsy shop sections from which to draw category names
    const sectionsResponse = await fetch(
        `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/sections`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );
    const { results: categories }: { results: ShopSectionResponse[] } = await sectionsResponse.json();
    return categories.filter((cat) => cat.active_listing_count > 0);
}

async function setCategoriesCache() {
    const categories = await fetchCategoriesFromEtsy();
    kv.set("categories", JSON.stringify(categories));
    kv.set("timeSinceLastEtsyCategoriesFetch", Date.now());
    return categories;
}

export async function fetchCategoriesFromCache(): Promise<ShopSectionResponse[]> {
    const timeSinceLastEtsyCategoriesFetch = await kv.get("timeSinceLastEtsyCategoriesFetch");

    // if more than 24 hours since last fetch, fetch again
    if (
        timeSinceLastEtsyCategoriesFetch === undefined ||
        Date.now() - Number(timeSinceLastEtsyCategoriesFetch) > 1000 * 60 * 60 * 24
    ) {
        console.log("fetching categories from etsy");
        const categories = await setCategoriesCache();
        return categories;
    }

    const cachedCategories: ShopSectionResponse[] = await kv.get("categories");

    if (cachedCategories && cachedCategories.length > 0) {
        return cachedCategories;
    } else {
        const categories = await setCategoriesCache();
        return categories;
    }
}
