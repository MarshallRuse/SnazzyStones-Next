//Name both cache SDK imports redis so they can be swapped out if one were to blow through the cache limit
//import { kv as redis } from "@vercel/kv";
import { Redis } from "@upstash/redis";
import { ShopSectionResponse } from "../../../types/EtsyAPITypes";
import { CategoriesMinAPIData } from "../../../types/Types";

// Comment out if using kv
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
    const minimalCategoriesData: CategoriesMinAPIData[] = categories.map((cat) => ({
        shop_section_id: cat.shop_section_id,
        title: cat.title,
    }));
    redis.set("categories", JSON.stringify(minimalCategoriesData));
    redis.set("timeSinceLastEtsyCategoriesFetch", Date.now());
    return minimalCategoriesData;
}

export async function fetchCategoriesFromCache(): Promise<CategoriesMinAPIData[]> {
    const timeSinceLastEtsyCategoriesFetch = await redis.get("timeSinceLastEtsyCategoriesFetch");

    // if more than 48 hours since last fetch, fetch again
    if (
        timeSinceLastEtsyCategoriesFetch === undefined ||
        Date.now() - Number(timeSinceLastEtsyCategoriesFetch) > 1000 * 60 * 60 * 48
    ) {
        console.log("fetching categories from etsy");
        const categories = await setCategoriesCache();
        return categories;
    }

    const cachedCategories: CategoriesMinAPIData[] = await redis.get("categories");

    if (cachedCategories && cachedCategories.length > 0) {
        return cachedCategories;
    } else {
        const categories = await setCategoriesCache();
        return categories;
    }
}
