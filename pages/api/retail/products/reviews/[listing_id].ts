import { ListingReviewResponse, ListingReview } from "../../../../../types/EtsyAPITypes";
import { NextApiRequest, NextApiResponse } from "next";

export interface APIReviewsResponse {
    reviews: ListingReview[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIReviewsResponse>) {
    let { listing_id } = req.query;
    const product_id = typeof listing_id === "string" ? Number(listing_id) : Number(listing_id[0]);

    const listingReviewsResponse = await fetch(
        `https://openapi.etsy.com/v3/application/listings/${product_id}/reviews?limit=100`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );

    const listingReviews: ListingReviewResponse = await listingReviewsResponse.json();
    let reviews = [];
    if (listingReviews.results && Array.isArray(listingReviews.results)) {
        reviews = listingReviews.results.filter((review) => review.listing_id === product_id);
    }

    res.status(200).json({
        reviews,
    });
}
