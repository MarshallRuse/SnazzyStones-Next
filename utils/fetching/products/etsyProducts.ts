import he from "he";
import Bottleneck from "bottleneck";
//Name both cache SDK imports redis so they can be swapped out if one were to blow through the cache limit
//import { kv as redis } from "@vercel/kv";
import { Redis } from "@upstash/redis";
import { ShopListingResponse, ShopListingsResponse } from "../../../types/EtsyAPITypes";
import { ProductMinAPIData } from "../../../types/Types";

// Comment out if using kv
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export interface FetchProductsParams {
    categoryId?: number | null;
    fetchImages?: boolean;
    limit?: number;
}

// fetchProducts shared by categories index page getStaticProps and will be
// be shared by an api called by the client for infinite loading
export async function fetchProductsFromEtsy({
    categoryId = null,
    fetchImages = true,
    limit = 100,
}: FetchProductsParams = {}): Promise<ShopListingResponse[]> {
    try {
        // using bottleneck for rate limiting
        const limiter = new Bottleneck({
            minTime: 1000,
            maxConcurrent: 1,
        });

        const url = categoryId
            ? `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/shop-sections/listings?shop_section_ids=${categoryId}&limit=${limit}`
            : `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/listings/active?limit=${limit}`;

        // get all active shop listings
        const activeShopListingsResponse = await limiter.schedule(() =>
            fetch(url, {
                method: "GET",
                headers: {
                    "x-api-key": process.env.ETSY_API_KEYSTRING,
                },
            })
        );
        let { results: activeShopListings = [] }: { results: ShopListingResponse[] } =
            await activeShopListingsResponse.json();

        if (activeShopListings && activeShopListings.length > 0) {
            if (fetchImages) {
                const listingIds = activeShopListings.map((listing) => listing.listing_id).join(",");
                const listingImagesResponse = await limiter.schedule(() =>
                    fetch(
                        `https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${listingIds}&includes=Images`,
                        {
                            method: "GET",
                            headers: {
                                "x-api-key": process.env.ETSY_API_KEYSTRING,
                            },
                        }
                    )
                );
                const listingsWithImages: ShopListingsResponse = await listingImagesResponse.json();
                activeShopListings = listingsWithImages.results;
            }
            return activeShopListings.map((l) => ({ ...l, title: he.decode(l.title) }));
        }

        return activeShopListings;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function setProductsCache({ categoryId = null, fetchImages = true, limit = 100 }: FetchProductsParams = {}) {
    const products = await fetchProductsFromEtsy({ categoryId, fetchImages, limit });
    const minimalProductsData: ProductMinAPIData[] = products.map((product) => {
        return {
            listing_id: product.listing_id,
            title: product.title,
            description: product.description,
            images: product.images.map((image) => ({
                url_75x75: image.url_75x75,
                url_170x135: image.url_170x135,
                url_fullxfull: image.url_fullxfull,
            })),
            //price: product.price,
            shop_section_id: product.shop_section_id,
            original_creation_timestamp: product.original_creation_timestamp,
            num_favorers: product.num_favorers,
            url: product.url,
            production_partners: product.production_partners,
            quantity: product.quantity,
            tags: product.tags,
        };
    });
    await redis.set("products", JSON.stringify(minimalProductsData));
    await redis.set("timeSinceLastEtsyFetch", Date.now());
    return minimalProductsData;
}

export async function fetchProductsFromCache({
    categoryId = null,
    fetchImages = true,
    limit = 100,
}: FetchProductsParams = {}): Promise<ProductMinAPIData[]> {
    const timeSinceLastEtsyFetch = await redis.get("timeSinceLastEtsyFetch");

    // if more than 48 hours since last fetch, fetch again
    if (timeSinceLastEtsyFetch === undefined || Date.now() - Number(timeSinceLastEtsyFetch) > 1000 * 60 * 60 * 48) {
        console.log("fetching products from etsy");
        const products = await setProductsCache({ categoryId: null, fetchImages: true }); // fetch all products
        return products;
    }

    const cachedProducts: ProductMinAPIData[] = await redis.get("products");

    if (cachedProducts && cachedProducts.length > 0) {
        let selectedProducts = cachedProducts;
        if (categoryId) {
            selectedProducts = cachedProducts.filter((product) => product.shop_section_id === categoryId);
        }
        if (limit && limit < selectedProducts.length) {
            selectedProducts = selectedProducts.slice(0, limit);
        }

        return selectedProducts.slice(0, limit);
    } else {
        const products = await setProductsCache({ categoryId: null, fetchImages: true });
        return products.slice(0, limit);
    }
}
