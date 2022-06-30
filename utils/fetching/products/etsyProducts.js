import he from "he";
import Bottleneck from "bottleneck";

// fetchProducts shared by categories index page getStaticProps and will be
// be shared by an api called by the client for infinite loading
export default async function fetchProducts({ categoryId = "", fetchImages = true, limit = 100 } = {}) {
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
        let { results: activeShopListings = [] } = await activeShopListingsResponse.json();

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
                const listingsWithImages = await listingImagesResponse.json();
                activeShopListings = listingsWithImages.results;
            }
            const activeShopListingsFormatted = activeShopListings.map((l) => ({ ...l, title: he.decode(l.title) }));

            return activeShopListingsFormatted;
        }

        return activeShopListings;
    } catch (err) {
        console.log(err);
        return null;
    }
}
