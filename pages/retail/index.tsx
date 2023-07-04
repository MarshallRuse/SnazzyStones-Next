import { NextSeo } from "next-seo";
import fetchProducts from "../../utils/fetching/products/etsyProducts";
import fetchCategories from "../../utils/fetching/categories/etsyCategories";
import CollectionCard from "../../components/CollectionCard";
import styles from "../../styles/modules/Retail.module.scss";
import ProductList from "../../components/ProductList";
import { collectionCardMap } from "../../utils/collectionCardMap";
import { avoidRateLimit } from "../../utils/avoidRateLimit";
import {ShopListingCondensed, ShopSectionResponse} from "../../types/EtsyAPITypes";

export interface RetailPageProps {
    products: ShopListingCondensed[];
    categories: ShopSectionResponse[];
}

export default function RetailPage({ products = [], categories = [] }: RetailPageProps) {
    return (
        <>
            <NextSeo
                title='Shop | Snazzy Stones'
                description='Shop the entire Snazzy Stones catalogue!'
                canonical='https://snazzystones.ca/shop'
                openGraph={{
                    url: "https://snazzystones.ca/shop",
                    title: "Shop | SnazzyStones",
                    description: "Shop the entire Snazzy Stones catalogue!",
                    images: [
                        {
                            url: "https://res.cloudinary.com/marsh/image/upload/f_auto,q_auto/v1651926154/snazzystones-website/tableDisplay.jpg",
                            width: 3920,
                            height: 1960,
                            alt: "A large assortment of earrings on backings in trays",
                            type: "image/jpeg",
                        },
                    ],
                    site_name: "SnazzyStones",
                }}
                twitter={{
                    cardType: "summary_large_image",
                }}
            />
            <header className={`${styles.indexHeader} heroSection `}>
                <div>
                    <h1 className='heroTitle text-white overlayText'>SHOP</h1>
                </div>
            </header>
            <section className='bg-slate-100 grid sm:grid-cols-3 lg:grid-cols-4 gap-10 px-4 md:px-32 py-12 relative'>
                {categories?.map((cat) => (
                    <CollectionCard
                        key={`collection-card-${cat.title.replace(" ", "_")}`}
                        cardImageSrc={collectionCardMap[cat.title] && collectionCardMap[cat.title].url}
                        alt={collectionCardMap[cat.title]?.alt}
                        title={cat.title}
                    />
                ))}
            </section>
            <ProductList products={products} categories={categories} />
        </>
    );
}

export async function getStaticProps() {
    console.log("fetching categories, products, product images...");
    // get a list of Etsy shop sections from which to draw category names
    await avoidRateLimit(500);
    const categories = await fetchCategories();

    await avoidRateLimit(500);
    const fetchedProducts = await fetchProducts();

    // optimize static page generation by only passing relevant properties to front end
    // properties are used in this page, ProductList, ProductListingCard
    const products: ShopListingCondensed[] = fetchedProducts.map((prod) => ({
        listing_id: prod.listing_id,
        title: prod.title,
        description: prod.description,
        images: prod.images,
        shop_section_id: prod.shop_section_id,
        original_creation_timestamp: prod.original_creation_timestamp,
        num_favorers: prod.num_favorers,
        price: prod.price,
    }));

    return {
        props: {
            categories,
            products,
        },
        revalidate: 12 * 60 * 60, //revalidate twice a day
    };
}
