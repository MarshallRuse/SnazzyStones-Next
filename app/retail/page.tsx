import { fetchProductsFromCache } from '@/utils/fetching/products/etsyProducts';
import { fetchCategoriesFromCache } from '@/utils/fetching/categories/etsyCategories';
import CollectionCard from '@/components/CollectionCard';
import styles from '@/styles/modules/Retail.module.css';
import ProductList from '@/components/ProductList';
import { collectionCardMap } from '@/utils/collectionCardMap';
import { avoidRateLimit } from '@/utils/avoidRateLimit';
import { ShopListingCondensed, ShopSectionResponse } from '@/types/EtsyAPITypes';
import FadingHeader from '@/components/FadingHeader';
import { Metadata } from 'next';

export const revalidate = 48 * 60 * 60; // revalidate every two days

export const metadata: Metadata = {
    title: 'Shop | Snazzy Stones',
    description: 'Shop the entire Snazzy Stones catalogue!',
    openGraph: {
        url: 'https://snazzystones.ca/shop',
        title: 'Shop | SnazzyStones',
        description: 'Shop the entire Snazzy Stones catalogue!',
        images: [
            {
                url: 'https://res.cloudinary.com/marsh/image/upload/f_auto,q_auto/v1651926154/snazzystones-website/tableDisplay.jpg',
                width: 3920,
                height: 1960,
                alt: 'A large assortment of earrings on backings in trays',
                type: 'image/jpeg',
            },
        ],
        siteName: 'SnazzyStones',
    },
    twitter: {
        card: 'summary_large_image',
    },
};

async function getPageData() {
    console.log('fetching categories, products, product images...');

    await avoidRateLimit(500);
    const categories = await fetchCategoriesFromCache();

    await avoidRateLimit(500);
    const fetchedProducts = await fetchProductsFromCache();

    // optimize static page generation by only passing relevant properties to front end
    const products: ShopListingCondensed[] = fetchedProducts.map((prod) => ({
        listing_id: prod.listing_id,
        title: prod.title,
        description: prod.description,
        images: prod.images,
        shop_section_id: prod.shop_section_id || 0, // Convert null to 0 to fix type error
        original_creation_timestamp: prod.original_creation_timestamp,
        num_favorers: prod.num_favorers,
    }));

    return { categories, products };
}

export default async function RetailPage() {
    const { products, categories } = await getPageData();

    return (
        <>
            <FadingHeader>
                <div className={`${styles.indexHeader} heroSection`}></div>
                <div>
                    <h1 className='heroTitle text-white overlayText'>SHOP</h1>
                </div>
            </FadingHeader>
            <section className='bg-slate-100 grid sm:grid-cols-3 lg:grid-cols-4 gap-10 px-4 md:px-32 py-12 relative'>
                {categories?.map((cat) => (
                    <CollectionCard
                        key={`collection-card-${cat.title.replace(' ', '_')}`}
                        cardImageSrc={collectionCardMap[cat.title] && collectionCardMap[cat.title].url}
                        alt={collectionCardMap[cat.title]?.alt}
                        title={cat.title}
                    />
                ))}
            </section>
            <ProductList
                products={products}
                categories={categories}
            />
        </>
    );
}
