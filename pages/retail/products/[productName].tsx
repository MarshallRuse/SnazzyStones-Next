import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";
import he from "he";
import dayjs from "dayjs";
import useCountry from "../../../utils/fetching/country";
import Favorite from "@mui/icons-material/Favorite";
import StarRateRounded from "@mui/icons-material/StarRateRounded";
import { Skeleton } from "@mui/material";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";
import WiggleWrapper from "../../../components/WiggleWrapper";
import formatProductTitleAsURL from "../../../utils/formatProductTitleAsURL";
import { fetchCategoriesFromCache } from "../../../utils/fetching/categories/etsyCategories";
import { fetchProductsFromCache } from "../../../utils/fetching/products/etsyProducts";
import ImageGallery from "../../../components/ImageGallery";
import ProductPageFallbackSkeleton from "../../../components/ProductPageFallbackSkeleton";
import { ListingReview } from "../../../types/EtsyAPITypes";
import { Product } from "../../../types/Types";
import CTALink from "../../../components/CTAElements/CTALink";
import { APIReviewsResponse } from "../../api/retail/products/reviews/[listing_id]";

const shareButtonStyle = "rounded-full focus:outline-none focus:ring focus:ring-bluegreen-500 focus:ring-offset-2";
const shareButtonIconSize = 40;

export interface ProductPageProps {
    product?: Product;
    category: string;
}

export default function ProductPage({ product = null, category = "" }: ProductPageProps) {
    const { countryData, isLoading, isError } = useCountry();
    const router = useRouter();
    const productURL = `https://snazzystones.ca${router.asPath}`;

    const [reviews, setReviews] = useState<ListingReview[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsResponse = await fetch(`/api/retail/products/reviews/${product.listing_id}`);
            const reviewsData: APIReviewsResponse = await reviewsResponse.json();
            setReviews(reviewsData.reviews);
        };

        if (product) {
            fetchReviews();
        }
    }, [product]);

    if (router.isFallback) {
        return <ProductPageFallbackSkeleton />;
    }

    return (
        <>
            <NextSeo
                title={`${product.title.split("|")[0].trim()} | Snazzy Stones`}
                description={he.decode(product.description.split("\n")[0].trim())}
                canonical={product.url}
                openGraph={{
                    url: productURL,
                    title: `${product.title.split("|")[0].trim()} | Snazzy Stones`,
                    description: he.decode(product.description.split("\n")[0].trim()),
                    images: product.images.map((img, ind) => ({
                        url: img.url_fullxfull,
                        width: 442,
                        height: 442,
                        alt: `Product listing image ${ind + 1} for ${product.title.split("|")[0].trim()}`,
                        type: "image/jpeg",
                    })),
                    site_name: "SnazzyStones",
                }}
                twitter={{
                    cardType: "summary",
                }}
            />
            <section className='grid md:grid-cols-2 md:grid-flow-row auto-rows-max gap-10 py-16 md:max-w-screen-lg justify-center mx-auto px-4'>
                <ImageGallery images={product.images} productTitle={product.title} />
                <div className='flex flex-col row-span-2 text-sm text-slate-500 max-w-sm md:max-w-lg pt-2'>
                    <nav className='flex flex-nowrap'>
                        <Link href='/'>
                            <a className='text-bluegreen-500 navItem max-w-max inline-flex mx-1'>Home</a>
                        </Link>{" "}
                        {category && (
                            <>
                                /
                                <Link href={`/retail/categories/${category?.replace(" ", "_")}`}>
                                    <a className='text-bluegreen-500 navItem max-w-max inline-flex mx-1'>{category}</a>
                                </Link>
                            </>
                        )}
                        {product && <>/ {product.title.split("|")[0].trim()}</>}
                    </nav>
                    <div className='flex flex-col md:flex-row items-start md:items-center md:gap-4 mb-12 md:mb-0 text-blueyonder-500'>
                        <h1 className='text-2xl mt-4 font-semibold mb-4 md:mb-auto'>{product.title}</h1>
                        {product.production_partners.length > 0 && product.production_partners[0].location && (
                            <div className='flex rounded-md shadow-light w-14 md:w-auto'>
                                <Image
                                    src={`/svg/flags/${product.production_partners?.[0]?.location}.svg`}
                                    width={105}
                                    height={70}
                                    objectFit='cover'
                                    className='rounded-md'
                                    alt={`A flag of ${product.production_partners?.[0]?.location}, location of our production partners`}
                                    priority
                                />
                            </div>
                        )}
                    </div>
                    {/* <p className='text-bluegreen-500 text-2xl font-semibold m-0'>
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
                    </p> */}
                    <div className='max-h-56 mt-4 overflow-y-auto subtleScrollbar'>
                        {product &&
                            product.description
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
                        <CTALink href={product.url} target='_blank' rel='noreferrer'>
                            Purchase on Etsy
                        </CTALink>
                        {product.num_favorers > 0 && (
                            <div className='text-bluegreen-500 font-medium'>
                                <Favorite /> {product.num_favorers} {product.num_favorers > 1 ? "people" : "person"}{" "}
                                favorited this item!
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col'>
                    <h3 className='text-bluegreen-500 mb-4'>Share the Snazziness!</h3>
                    <div className='flex items-start gap-4'>
                        <WiggleWrapper>
                            <FacebookShareButton url={productURL} className={shareButtonStyle}>
                                <FacebookIcon size={shareButtonIconSize} round />
                            </FacebookShareButton>
                        </WiggleWrapper>
                        <WiggleWrapper>
                            <FacebookMessengerShareButton
                                url={productURL}
                                className={shareButtonStyle}
                                appId={product.facebookAppId}
                            >
                                <FacebookMessengerIcon size={shareButtonIconSize} round />
                            </FacebookMessengerShareButton>
                        </WiggleWrapper>
                        <WiggleWrapper>
                            <TwitterShareButton url={productURL} className={shareButtonStyle}>
                                <TwitterIcon size={shareButtonIconSize} round />
                            </TwitterShareButton>
                        </WiggleWrapper>
                        <WiggleWrapper>
                            <WhatsappShareButton url={productURL} className={shareButtonStyle}>
                                <WhatsappIcon size={shareButtonIconSize} round />
                            </WhatsappShareButton>
                        </WiggleWrapper>
                        <WiggleWrapper>
                            <EmailShareButton url={productURL} className={shareButtonStyle}>
                                <EmailIcon size={shareButtonIconSize} round />
                            </EmailShareButton>
                        </WiggleWrapper>
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
                    ?.sort((a, b) => b.created_timestamp - a.created_timestamp)
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
                            <div className='flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4'>
                                <p className='text-blueyonder-500 mt-4'>{he.decode(review.review)}</p>
                                {review.image_url_fullxfull && (
                                    <div className='flex rounded-md shadow-light'>
                                        <Image
                                            src={review.image_url_fullxfull}
                                            width={200}
                                            height={200}
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
    const activeShopListingsFormatted = await fetchProductsFromCache();

    return {
        paths: activeShopListingsFormatted.map((listing) => ({
            params: {
                productName: listing.title.includes("|")
                    ? formatProductTitleAsURL(listing.title)
                    : listing.listing_id.toString(),
            },
        })),
        fallback: "blocking",
    };
}

export async function getStaticProps(context) {
    const { params } = context;

    const products = await fetchProductsFromCache();

    const productToGet = products.find((prod) => {
        if (prod.title.includes("|")) {
            return formatProductTitleAsURL(prod.title) === params.productName;
        } else {
            return prod.listing_id === params.productName;
        }
    });

    if (!productToGet) {
        return {
            notFound: true,
        };
    }

    const formattedListing = {
        listing_id: productToGet.listing_id,
        title: he.decode(productToGet.title),
        description: productToGet.description,
        url: productToGet.url,
        images: productToGet.images,
        production_partners: productToGet.production_partners,
        price: productToGet.price,
        quantity: productToGet.quantity,
        num_favorers: productToGet.num_favorers,
        tags: productToGet.tags,
    };

    const categories = await fetchCategoriesFromCache();
    const category = categories.find((section) => section.shop_section_id === productToGet.shop_section_id).title;

    return {
        props: {
            product: formattedListing,
            category,
        },
        revalidate: 60 * 60 * 24, //revalidate after a day
    };
}
