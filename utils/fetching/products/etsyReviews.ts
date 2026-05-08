import type {
	ListingReview,
	ListingReviewResponse,
} from "@/types/EtsyAPITypes";
import { getEtsyApiKey } from "../etsy.util";

export async function fetchReviewsFromEtsy(product_id: number) {
	const apiKey = getEtsyApiKey();
	if (!apiKey) {
		throw new Error("API key not configured");
	}

	try {
		const listingReviewsResponse = await fetch(
			`https://api.etsy.com/v3/application/listings/${product_id}/reviews?limit=100`,
			{
				method: "GET",
				headers: {
					"x-api-key": apiKey,
				},
			},
		);

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
