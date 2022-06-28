import he from "he";
import Bottleneck from "bottleneck";
import cacheData from "memory-cache";

// fetchProducts shared by categories index page getStaticProps and will be
// be shared by an api called by the client for infinite loading
export default async function fetchProducts({
    categoryId = "",
    fetchImages = true,
    limit = 100,
    fetchFromCache = true,
} = {}) {
    // using bottleneck for rate limiting
    const limiter = new Bottleneck({
        minTime: 1000,
        maxConcurrent: 1,
    });

    // one key for cache - all products stored in cache with image urls
    // regardless of parameters to avoid redundant caches
    const cacheKey = `fetchProducts?fetchImages=${fetchImages}`;
    const productsData = cacheData.get(cacheKey);

    if (fetchFromCache && productsData !== null) {
        // if the productsData cache exists, return it
        console.log("fetching from cache...");
        return categoryId === ""
            ? productsData
            : productsData.filter((listing) => listing.shop_section_id === categoryId);
    } else if (fetchFromCache && !productsData) {
        console.log("establishing cache...");
        // if products are to be fetched from cache and productsData cache doesn't exists, fetch all products with image urls
        try {
            // get all active shop listings
            const activeShopListingsResponse = await limiter.schedule(() =>
                fetch(
                    `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/listings/active?limit=100`,
                    {
                        method: "GET",
                        headers: {
                            "x-api-key": process.env.ETSY_API_KEYSTRING,
                        },
                    }
                )
            );
            const { results: activeShopListings = [] } = await activeShopListingsResponse.json();

            if (activeShopListings && activeShopListings.length > 0) {
                const activeShopListingsFormatted = activeShopListings.map((l) => ({
                    ...l,
                    title: he.decode(l.title),
                }));

                if (fetchImages) {
                    // For cached products, get images for listings
                    for (const listing of activeShopListingsFormatted) {
                        const listingImagesResponse = await limiter.schedule(() =>
                            fetch(`https://openapi.etsy.com/v3/application/listings/${listing.listing_id}/images`, {
                                method: "GET",
                                headers: {
                                    "x-api-key": process.env.ETSY_API_KEYSTRING,
                                },
                            })
                        );
                        const images = await listingImagesResponse.json();
                        listing.images = images.results;
                    }
                }

                cacheData.put(cacheKey, activeShopListingsFormatted, 24 * 60 * 60 * 1000);
                // because all products were fetched to put in cache, filter here based on parameters
                return categoryId === ""
                    ? activeShopListings
                    : activeShopListings.filter((listing) => listing.shop_section_id === categoryId);
            } else {
                return [];
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    } else {
        console.log("nah not caching...");
        // not fetching from cache
        try {
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
            const { results: activeShopListings = [] } = await activeShopListingsResponse.json();

            if (activeShopListings && activeShopListings.length > 0) {
                const activeShopListingsFormatted = activeShopListings.map((l) => ({
                    ...l,
                    title: he.decode(l.title),
                }));

                if (fetchImages) {
                    // Get images for listings

                    for (const listing of activeShopListingsFormatted) {
                        const listingImagesResponse = await limiter.schedule(() =>
                            fetch(`https://openapi.etsy.com/v3/application/listings/${listing.listing_id}/images`, {
                                method: "GET",
                                headers: {
                                    "x-api-key": process.env.ETSY_API_KEYSTRING,
                                },
                            })
                        );
                        const images = await listingImagesResponse.json();
                        listing.images = images.results;
                    }
                }

                return activeShopListingsFormatted;
            }

            return activeShopListings;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
