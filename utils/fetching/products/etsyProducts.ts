import he from "he";
import Bottleneck from "bottleneck";
import { kv } from "@vercel/kv";
import { ShopListingResponse, ShopListingsResponse } from "../../../types/EtsyAPITypes";

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
    await kv.set("products", JSON.stringify(products));
    await kv.set("timeSinceLastEtsyFetch", Date.now());
    return products;
}

export async function fetchProductsFromCache({
    categoryId = null,
    fetchImages = true,
    limit = 100,
}: FetchProductsParams = {}): Promise<ShopListingResponse[]> {
    const timeSinceLastEtsyFetch = await kv.get("timeSinceLastEtsyFetch");

    // if more than 24 hours since last fetch, fetch again
    if (timeSinceLastEtsyFetch === undefined || Date.now() - Number(timeSinceLastEtsyFetch) > 1000 * 60 * 60 * 24) {
        console.log("fetching products from etsy");
        const products = await setProductsCache({ categoryId: null, fetchImages: true, limit });
        return products;
    }

    const cachedProducts: ShopListingResponse[] = await kv.get("products");

    if (cachedProducts && cachedProducts.length > 0) {
        let selectedProducts = cachedProducts;
        if (categoryId) {
            selectedProducts = cachedProducts.filter((product) => product.shop_section_id === categoryId);
        }
        if (limit && limit < selectedProducts.length) {
            selectedProducts = selectedProducts.slice(0, limit);
        }

        return selectedProducts;
    } else {
        const products = await setProductsCache({ categoryId: null, fetchImages: true, limit });
        return products;
    }
}
