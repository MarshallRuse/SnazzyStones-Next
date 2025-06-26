import { Metadata } from 'next';
import { fetchCategoriesFromCache } from '@/utils/fetching/categories/etsyCategories';
import { fetchProductsFromCache } from '@/utils/fetching/products/etsyProducts';
import { avoidRateLimit } from '@/utils/avoidRateLimit';
import { CategoryContent } from './CategoryContent';
import { categoryPitches } from './categoryPitches';
import { collectionCardMap } from '@/utils/collectionCardMap';
import { ShopListingCondensed } from '@/types/EtsyAPITypes';

interface CategoryPageProps {
    params: Promise<{
        categoryName: string;
    }>;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { categoryName } = await params;
    const category = categoryName.replace('_', ' ');
    const pitch = categoryPitches[category]
        ? categoryPitches[category]?.split(/[?!.]/g)?.[0]
        : categoryPitches['Default'];

    return {
        title: `${category} | Snazzy Stones`,
        description: pitch,
        openGraph: {
            title: `${category} | Snazzy Stones`,
            description: pitch,
            url: `https://snazzystones.ca/retail/categories/${category.replace(' ', '_')}`,
            images: [
                {
                    url: collectionCardMap[category]?.url || '',
                    width: 1557,
                    height: 1557,
                    alt: collectionCardMap[category]?.alt || '',
                    type: 'image/jpeg',
                },
            ],
            siteName: 'SnazzyStones',
        },
        twitter: {
            card: 'summary',
        },
        alternates: {
            canonical: `https://snazzystones.ca/retail/categories/${category.replace(' ', '_')}`,
        },
    };
}

// Generate static paths
export async function generateStaticParams() {
    await avoidRateLimit(500);
    const categories = await fetchCategoriesFromCache();

    return categories.map((section) => ({
        categoryName: section.title.replace(' ', '_'),
    }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoryName } = await params;
    const category = categoryName.replace('_', ' ');

    await avoidRateLimit(500);
    const categories = await fetchCategoriesFromCache();

    const categoryId = categories.find((section) => section.title === category)?.shop_section_id;

    let products: ShopListingCondensed[] = [];
    if (categoryId) {
        await avoidRateLimit(500);
        const fetchedProducts = await fetchProductsFromCache({ categoryId });

        products = fetchedProducts.map((prod) => ({
            listing_id: prod.listing_id,
            title: prod.title,
            description: prod.description,
            images: prod.images,
            shop_section_id: prod.shop_section_id || 0, // Provide default value to fix type error
            original_creation_timestamp: prod.original_creation_timestamp,
            num_favorers: prod.num_favorers,
        }));
    }

    return (
        <CategoryContent
            products={products}
            category={category}
        />
    );
}
