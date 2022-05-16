import he from "he";
import Bottleneck from "bottleneck";

// fetchProducts shared by categories index page getStaticProps and will be
// be shared by an api called by the client for infinite loading
export const fetchProducts = async ({ categoryId = "", fetchImages = true, limit = 100 } = {}) => {
    try {
        const url = categoryId
            ? `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/shop-sections/listings?shop_section_ids=${categoryId}`
            : `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/listings/active?limit=${limit}`;

        // get all active shop listings
        const activeShopListingsResponse = await fetch(url, {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        });
        const { results: activeShopListings } = await activeShopListingsResponse.json();
        const activeShopListingsFormatted = activeShopListings.map((l) => ({ ...l, title: he.decode(l.title) }));

        if (fetchImages) {
            // Get images for listings
            // using bottleneck for rate limiting
            const limiter = new Bottleneck({
                minTime: 100,
                maxConcurrent: 1,
            });

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
    } catch (err) {
        console.log(err);
        return null;
    }
};
