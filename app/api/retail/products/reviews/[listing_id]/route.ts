import { ListingReviewResponse, ListingReview } from '../../../../../../types/EtsyAPITypes';
import { NextResponse } from 'next/server';

export interface APIReviewsResponse {
    reviews?: ListingReview[];
    error?: string;
}

export async function GET(_: Request, { params }: { params: { listing_id: string } }) {
    const listing_id = params.listing_id;
    const product_id = Number(listing_id);

    if (!process.env.ETSY_API_KEYSTRING) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const listingReviewsResponse = await fetch(
            `https://openapi.etsy.com/v3/application/listings/${product_id}/reviews?limit=100`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': process.env.ETSY_API_KEYSTRING,
                },
            }
        );

        const listingReviews: ListingReviewResponse = await listingReviewsResponse.json();
        let reviews: ListingReview[] = [];

        if (listingReviews.results && Array.isArray(listingReviews.results)) {
            reviews = listingReviews.results.filter((review) => review.listing_id === product_id);
        }

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
