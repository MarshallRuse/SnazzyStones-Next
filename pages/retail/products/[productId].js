import Image from "next/image";
import Link from "next/link";
import he from "he";
import dayjs from "dayjs";
import useCountry from "../../../utils/fetching/country";
import { Favorite, StarRateRounded } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import CTAButton from "../../../components/CTAButton";
import { fetchProducts } from "../../../utils/fetching/products";
import ImageGallery from "../../../components/ImageGallery";

export default function ProductPage({ product, category, reviews }) {
    const { countryData, isLoading, isError } = useCountry();
    return (
        <>
            <section className='grid md:grid-cols-2 gap-10 py-16 md:max-w-screen-lg justify-center mx-auto px-4'>
                <ImageGallery images={product.images} productTitle={product.title} />
                <div className='flex flex-col text-sm text-slate-500 max-w-xs md:max-w-lg pt-2'>
                    <nav>
                        <Link href='/'>
                            <a>Home</a>
                        </Link>{" "}
                        /{" "}
                        <Link href={`/retail/categories/${category?.replace(" ", "_")}`}>
                            <a>{category}</a>
                        </Link>
                    </nav>
                    <div className='flex gap-4 items-center text-blueyonder-500'>
                        <h1 className='text-2xl mt-4 font-semibold'>{product.title}</h1>
                        <div className='flex rounded-md shadow-light'>
                            <Image
                                src={`/svg/flags/${product.production_partners?.[0]?.location}.svg`}
                                width={150}
                                height={100}
                                objectFit='cover'
                                className='rounded-md'
                                alt={`A flag of ${product.production_partners?.[0]?.location}, location of our production partners`}
                            />
                        </div>
                    </div>
                    <p className='text-bluegreen-500 text-2xl font-semibold m-0'>
                        {isLoading ? (
                            <Skeleton width={85} height={30} sx={{ bgColor: "#14b6b8" }} />
                        ) : isError ? (
                            new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
                                product.price.amount / product.price.divisor
                            )
                        ) : (
                            new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
                                (countryData.countryCode === "CA"
                                    ? product.price.amount - 1400
                                    : product.price.amount) / product.price.divisor
                            )
                        )}
                    </p>
                    <div className='max-h-56 mt-4 overflow-y-auto subtleScrollbar'>
                        {product.description
                            .split("\n")
                            .filter((line) => line !== "")
                            .map((line) => he.decode(line))
                            .map((line, ind) => (
                                <p key={`description-${ind}`} className={`${ind === 0 ? "mt-0" : ""} mb-0 text-lg`}>
                                    {line
                                        .split(" ")
                                        .map((word, subInd) =>
                                            word.substring(0, 8) === "https://" ? (
                                                <a
                                                    key={`description-link-${subInd}`}
                                                    href={word}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-bluegreen-500 break-all navItem'
                                                >
                                                    {word}
                                                </a>
                                            ) : (
                                                word
                                            )
                                        )
                                        .reduce((accu, elem) => {
                                            return accu === null ? [elem] : [...accu, " ", elem];
                                        }, null)}
                                </p>
                            ))}
                    </div>
                    <p className='text-base'>
                        <span className='font-semibold'>Availability:</span>
                        <span className='text-bluegreen-500'> {product.quantity} in stock</span>
                    </p>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <CTAButton href={product.url} target='_blank' rel='noreferrer'>
                            Purchase on Etsy
                        </CTAButton>
                        {product.num_favorers > 0 && (
                            <div className='text-bluegreen-500 font-medium'>
                                <Favorite /> {product.num_favorers} {product.num_favorers > 1 ? "people" : "person"}{" "}
                                favorited this item!
                            </div>
                        )}
                    </div>
                    <div className='mt-6 pt-4 border-t border-slate-200 flex gap-4'>
                        <div className='font-semibold text-blueyonder-500'>Tags:</div>
                        <div className='text-bluegreen-500'>{product.tags.join(", ")}</div>
                    </div>
                </div>
            </section>
            <section className='px-4 py-16 md:max-w-screen-lg mx-auto  border-t border-slate-100'>
                <h2 className='text-blueyonder-500'>
                    Reviews{" "}
                    {reviews.length > 0 ? (
                        <span className='text-blueyonder-400 text-2xl inline-flex items-center'>
                            ({reviews.length}, Average{" "}
                            {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)}{" "}
                            <StarRateRounded />)
                        </span>
                    ) : (
                        <span className='text-blueyonder-400 text-2xl inline-flex items-center'>(0 reviews)</span>
                    )}
                </h2>
                {reviews
                    .sort((a, b) => b.created_timestamp - a.created_timestamp)
                    .map((review, ind) => (
                        <div key={`review-${ind}`} className='py-4'>
                            <div className='flex items-end gap-4'>
                                <div className='text-bluegreen-500'>
                                    {[...Array(review.rating)].map((e, i) => (
                                        <StarRateRounded key={`review-${review.created_timestamp}-star-${i}`} />
                                    ))}
                                </div>
                                <div className='text-blueyonder-400'>
                                    {dayjs.unix(review.created_timestamp).format("MMMM DD, YYYY")}
                                </div>
                            </div>
                            <div className='flex justify-between gap-4'>
                                <p className='text-blueyonder-500 mt-4'>{he.decode(review.review)}</p>
                                {review.image_url_fullxfull && (
                                    <div className='flex rounded-md shadow-light'>
                                        <Image
                                            src={review.image_url_fullxfull}
                                            width={100}
                                            height={100}
                                            objectFit='cover'
                                            alt={`A review photo for review number ${ind}`}
                                            className='rounded-md'
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </section>
        </>
    );
}

export async function getStaticPaths() {
    const activeShopListingsFormatted = await fetchProducts({ fetchImages: false });

    return {
        paths: activeShopListingsFormatted.map((listing) => ({
            params: { productId: listing.listing_id.toString() },
        })),
        fallback: false,
    };
}

export async function getStaticProps(context) {
    const { params } = context;

    const listingResponse = await fetch(
        `https://openapi.etsy.com/v3/application/listings/${params.productId}?includes=Images`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );
    const listing = await listingResponse.json();
    const formattedListing = { ...listing, title: he.decode(listing.title) };

    const sectionsResponse = await fetch(
        `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/sections`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );
    const { results: sections } = await sectionsResponse.json();
    const category = sections.find((section) => section.shop_section_id === listing.shop_section_id).title;

    const listingReviewsResponse = await fetch(
        `https://openapi.etsy.com/v3/application/listings/${params.productId}/reviews?limit=100`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );
    const listingReviews = await listingReviewsResponse.json();
    const reviews = listingReviews.results.filter((review) => review.listing_id === parseInt(params.productId));
    return {
        props: {
            product: formattedListing,
            category,
            reviews,
        },
        revalidate: 60,
    };
}
