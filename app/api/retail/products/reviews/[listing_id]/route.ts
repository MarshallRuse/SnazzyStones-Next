import { NextResponse } from "next/server";
import type { ListingReview } from "@/types/EtsyAPITypes";
import { fetchReviewsFromEtsy } from "@/utils/fetching/products/etsyReviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface APIReviewsResponse {
	reviews?: ListingReview[];
	error?: string;
}

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ listing_id: string }> },
) {
	try {
		const { listing_id } = await params;
		const reviews = await fetchReviewsFromEtsy(Number(listing_id));
		return NextResponse.json({ reviews });
	} catch (error) {
		console.error("[reviews API]", error);
		return NextResponse.json(
			{ reviews: [], error: "Failed to load reviews" },
			{ status: 500 },
		);
	}
}
