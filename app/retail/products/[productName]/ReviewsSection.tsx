'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import he from 'he';
import dayjs from 'dayjs';
import StarRateRounded from '@mui/icons-material/StarRateRounded';
import { ListingReview } from '@/types/EtsyAPITypes';
import { APIReviewsResponse } from '@/app/api/retail/products/reviews/[listing_id]/route';

export default function ReviewsSection({ listingId }: { listingId: string }) {
    const [reviews, setReviews] = useState<ListingReview[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsResponse = await fetch(`/api/retail/products/reviews/${listingId}`);
            const reviewsData: APIReviewsResponse = await reviewsResponse.json();
            setReviews(reviewsData.reviews || []);
        };

        fetchReviews();
    }, [listingId]);

    return (
        <section className='px-4 py-16 md:max-w-(--breakpoint-lg) mx-auto border-t border-slate-100'>
            <h2 className='text-blueyonder-500'>
                Reviews{' '}
                {reviews.length > 0 ? (
                    <span className='text-blueyonder-400 text-2xl inline-flex items-center'>
                        ({reviews.length}, Average{' '}
                        {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)}{' '}
                        <StarRateRounded />)
                    </span>
                ) : (
                    <span className='text-blueyonder-400 text-2xl inline-flex items-center'>(0 reviews)</span>
                )}
            </h2>
            {reviews
                ?.sort((a, b) => b.created_timestamp - a.created_timestamp)
                .map((review, ind) => (
                    <div
                        key={`review-${ind}`}
                        className='py-4 border-b border-slate-100'
                    >
                        <div className='flex items-end gap-4'>
                            <div className='text-bluegreen-500'>
                                {[...Array(review.rating)].map((e, i) => (
                                    <StarRateRounded key={`review-${review.created_timestamp}-star-${i}`} />
                                ))}
                            </div>
                            <div className='text-blueyonder-400'>
                                {dayjs.unix(review.created_timestamp).format('MMMM DD, YYYY')}
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-4'>
                            <p className='text-blueyonder-500 mt-4'>{he.decode(review.review)}</p>
                            {review.image_url_fullxfull && (
                                <div className='rounded-md shadow-light w-fit'>
                                    <Image
                                        src={review.image_url_fullxfull}
                                        width={200}
                                        height={200}
                                        style={{ objectFit: 'cover' }}
                                        alt={`A review photo for review number ${ind}`}
                                        className='rounded-md'
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </section>
    );
}
