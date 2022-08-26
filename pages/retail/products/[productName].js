import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { avoidRateLimit } from "../../../utils/avoidRateLimit";
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
import CTAButton from "../../../components/CTAButton";
import formatProductTitleAsURL from "../../../utils/formatProductTitleAsURL";
import fetchCategories from "../../../utils/fetching/categories/etsyCategories";
import fetchProducts from "../../../utils/fetching/products/etsyProducts";
import ImageGallery from "../../../components/ImageGallery";
import ProductPageFallbackSkeleton from "../../../components/ProductPageFallbackSkeleton";

const shareButtonStyle = "rounded-full focus:outline-none focus:ring focus:ring-bluegreen-500 focus:ring-offset-2";
const shareButtonIconSize = 40;

export default function ProductPage({ product = null, category = "", reviews = [] }) {
    const { countryData, isLoading, isError } = useCountry();
    const router = useRouter();
    const productURL = `https://snazzystones.ca${router.asPath}`;

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
                <div className='flex flex-col row-span-2 text-sm text-slate-500 max-w-xs md:max-w-lg pt-2'>
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
                    <div className='flex gap-4 items-center text-blueyonder-500'>
                        <h1 className='text-2xl mt-4 font-semibold'>{product.title}</h1>
                        {product.production_partners.length > 0 && product.production_partners[0].location && (
                            <div className='flex rounded-md shadow-light'>
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
                            <FacebookMessengerShareButton url={productURL} className={shareButtonStyle}>
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

export async function getServerSideProps(context) {
    const { productName } = context.params;

    const products = await fetchProducts();

    const productToGet = products.find((prod) => {
        if (prod.title.includes("|")) {
            return formatProductTitleAsURL(prod.title) === productName;
        } else {
            return prod.listing_id === productName;
        }
    });

    if (!productToGet) {
        return {
            notFound: true,
        };
    }
    const listingResponse = await fetch(
        `https://openapi.etsy.com/v3/application/listings/${productToGet.listing_id}?includes=Images`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );
    const listing = await listingResponse.json();

    const formattedListing = {
        title: he.decode(listing.title),
        description: listing.description,
        url: listing.url,
        images: listing.images,
        production_partners: listing.production_partners,
        price: listing.price,
        quantity: listing.quantity,
        num_favorers: listing.num_favorers,
        tags: listing.tags,
    };

    await avoidRateLimit(500); // Bottleneck wasn't working for some reason
    const categories = await fetchCategories();
    const category = categories.find((section) => section.shop_section_id === listing.shop_section_id).title;

    await avoidRateLimit(500);
    const listingReviewsResponse = await fetch(
        `https://openapi.etsy.com/v3/application/listings/${productToGet.listing_id}/reviews?limit=100`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );

    const listingReviews = await listingReviewsResponse.json();
    let reviews = [];
    if (listingReviews.results && Array.isArray(listingReviews.results)) {
        reviews = listingReviews.results.filter((review) => review.listing_id === parseInt(productToGet.listing_id));
    }

    return {
        props: {
            product: formattedListing,
            category,
            reviews,
        },
    };
}
