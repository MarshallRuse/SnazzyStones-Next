import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import he from 'he';
import Favorite from '@mui/icons-material/Favorite';
import { fetchCategoriesFromCache } from '../../../../utils/fetching/categories/etsyCategories';
import { fetchProductsFromCache } from '../../../../utils/fetching/products/etsyProducts';
import formatProductTitleAsURL from '../../../../utils/formatProductTitleAsURL';
import ImageGallery from '../../../../components/ImageGallery';
import ProductPageFallbackSkeleton from '../../../../components/ProductPageFallbackSkeleton';
import CTALink from '../../../../components/CTAElements/CTALink';
import ShareButtons from './ShareButtons';
import ReviewsSection from './ReviewsSection';

interface ProductPageProps {
    params: Promise<{
        productName: string;
    }>;
}

// Generate metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const products = await fetchProductsFromCache();
    const { productName } = await params;
    const product = products.find((prod) =>
        prod.title.includes('|')
            ? formatProductTitleAsURL(prod.title) === productName
            : prod.listing_id.toString() === productName
    );

    if (!product) return {};

    const title = `${product.title.split('|')[0].trim()} | Snazzy Stones`;
    const description = he.decode(product.description.split('\n')[0].trim());
    const productURL = `https://snazzystones.ca/retail/products/${productName}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: productURL,
            images: product.images.map((img, ind) => ({
                url: img.url_fullxfull,
                width: 442,
                height: 442,
                alt: `Product listing image ${ind + 1} for ${product.title.split('|')[0].trim()}`,
                type: 'image/jpeg',
            })),
            siteName: 'SnazzyStones',
        },
        twitter: {
            card: 'summary',
        },
    };
}

// Generate static params
export async function generateStaticParams() {
    const products = await fetchProductsFromCache();

    return products.map((listing) => ({
        productName: listing.title.includes('|')
            ? formatProductTitleAsURL(listing.title)
            : listing.listing_id.toString(),
    }));
}

export default async function ProductPage({ params }: ProductPageProps) {
    const products = await fetchProductsFromCache();
    const categories = await fetchCategoriesFromCache();

    const { productName } = await params;

    const product = products.find((prod) =>
        prod.title.includes('|')
            ? formatProductTitleAsURL(prod.title) === productName
            : prod.listing_id.toString() === productName
    );

    if (!product) {
        notFound();
    }

    const category = categories.find((section) => section.shop_section_id === product.shop_section_id)?.title;

    const productURL = `https://snazzystones.ca/retail/products/${productName}`;

    return (
        <>
            <section className='grid md:grid-cols-2 md:grid-flow-row auto-rows-max gap-10 py-16 md:max-w-(--breakpoint-lg) justify-center mx-auto px-4'>
                <Suspense fallback={<ProductPageFallbackSkeleton />}>
                    <ImageGallery
                        images={product.images}
                        productTitle={product.title}
                    />
                </Suspense>

                <div className='flex flex-col row-span-2 text-sm text-slate-500 max-w-sm md:max-w-lg pt-2'>
                    <nav className='flex flex-nowrap'>
                        <Link
                            href='/'
                            className='text-bluegreen-500 navItem max-w-max inline-flex mx-1'
                        >
                            Home
                        </Link>
                        {category && (
                            <>
                                /
                                <Link
                                    href={`/retail/categories/${category.replace(' ', '_')}`}
                                    className='text-bluegreen-500 navItem max-w-max inline-flex mx-1'
                                >
                                    {category}
                                </Link>
                            </>
                        )}
                    </nav>
                    <div className='flex flex-col md:flex-row items-start md:items-center md:gap-4 mb-12 md:mb-0 text-blueyonder-500'>
                        <h1 className='text-2xl mt-4 font-semibold mb-4 md:mb-auto'>{product.title}</h1>
                        {(product.production_partners?.length ?? 0) > 0 &&
                            product.production_partners?.[0]?.location && (
                                <div className='flex rounded-md shadow-light w-14 md:w-auto'>
                                    <Image
                                        src={`/svg/flags/${product.production_partners?.[0]?.location}.svg`}
                                        width={105}
                                        height={70}
                                        style={{ objectFit: 'cover' }}
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
                                .split('\n')
                                .filter((line) => line !== '')
                                .map((line) => he.decode(line))
                                .map((line, ind) => (
                                    <p
                                        key={`description-${ind}`}
                                        className={`${ind === 0 ? 'mt-0' : ''} mb-0 text-lg`}
                                    >
                                        {line
                                            .split(' ')
                                            .map((word, subInd) =>
                                                word.substring(0, 8) === 'https://' ? (
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
                                                return accu === null ? [elem] : [...accu, ' ', elem];
                                            }, null)}
                                    </p>
                                ))}
                    </div>
                    <p className='text-base'>
                        <span className='font-semibold'>Availability:</span>
                        <span className='text-bluegreen-500'> {product.quantity} in stock</span>
                    </p>
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <CTALink
                            href={`https://snazzystonesjewelry.etsy.com/listing/${product.listing_id}`}
                            target='_blank'
                            rel='noreferrer'
                            type='external'
                        >
                            Purchase on Etsy
                        </CTALink>
                        {product.num_favorers > 0 && (
                            <div className='text-bluegreen-500 font-medium'>
                                <Favorite /> {product.num_favorers} {product.num_favorers > 1 ? 'people' : 'person'}{' '}
                                favorited this item!
                            </div>
                        )}
                    </div>
                </div>

                <ShareButtons
                    productURL={productURL}
                    facebookAppId={product.facebookAppId}
                />
            </section>

            <Suspense>
                <ReviewsSection listingId={product.listing_id.toString()} />
            </Suspense>
        </>
    );
}
