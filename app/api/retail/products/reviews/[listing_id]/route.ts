import { ListingReviewResponse, ListingReview } from '@/types/EtsyAPITypes';
import { getEtsyApiKey } from '@/utils/fetching/etsy.util';
import { NextResponse } from 'next/server';

export interface APIReviewsResponse {
    reviews?: ListingReview[];
    error?: string;
}

export async function GET(_: Request, { params }: { params: Promise<{ listing_id: string }> }) {
    const { listing_id } = await params;
    const product_id = Number(listing_id);

    const apiKey = getEtsyApiKey();
    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const listingReviewsResponse = await fetch(
            `https://api.etsy.com/v3/application/listings/${product_id}/reviews?limit=100`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
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
