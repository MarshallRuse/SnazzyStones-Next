import type {
	ListingReview,
	ListingReviewResponse,
} from "@/types/EtsyAPITypes";
import { getEtsyApiKey } from "../etsy.util";

export async function fetchReviewsFromEtsy(product_id: number) {
	try {
		const apiKey = getEtsyApiKey();
		const listingReviewsResponse = await fetch(
			`https://api.etsy.com/v3/application/listings/${product_id}/reviews?limit=100`,
			{
				method: "GET",
				headers: {
					"x-api-key": apiKey,
				},
				cache: "no-store",
			},
		);

		if (!listingReviewsResponse.ok) {
			const errorBody = await listingReviewsResponse.text();
			console.error("Etsy reviews request failed:", {
				listingId: product_id,
				status: listingReviewsResponse.status,
				statusText: listingReviewsResponse.statusText,
				body: errorBody.slice(0, 500),
			});
			return [];
		}

		const listingReviews: ListingReviewResponse =
			await listingReviewsResponse.json();
		let reviews: ListingReview[] = [];

		if (listingReviews.results && Array.isArray(listingReviews.results)) {
			reviews = listingReviews.results.filter(
				(review) => review.listing_id === product_id,
			);
		}

		return reviews;
	} catch (error) {
		console.error("Error fetching reviews:", error);
		return [];
	}
}
