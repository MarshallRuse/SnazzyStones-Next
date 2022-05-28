import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import styles from "../../../styles/modules/Retail.module.scss";
import { avoidRateLimit } from "../../../utils/avoidRateLimit";
import { fetchAndCacheCategories } from "../../../utils/fetching/categories/cachedCategories";
import { fetchAndCacheProducts } from "../../../utils/fetching/products/cachedProducts";
import ProductList from "../../../components/ProductList";
import { collectionCardMap } from "../../../utils/collectionCardMap";

const categoryPitches = {
    Anklets:
        "Fancy up your feet with a Sterling Silver Anklet! Whether you’re at the beach, setting out on a cruise, or hitting the town, these anklets make the perfect accessory for whatever your day may bring.",
    Bracelets:
        "Check out our Bracelets as a thoughtful gift or treat to yourself. Wear them on their own, or pair a couple together for a simple, beautiful look you’ll never want to take off. (We never do!)",
    Hoops: "Every woman should own a pair of hoops; not only for their classic, timeless vibe, but for the ease of knowing that they will always compliment any outfit you may choose.",
    Necklaces:
        "Find a chain you love with our delightful range of chain necklaces. All are high quality and Italian made. Beautiful to wear on their own, to double with another chain, or to compliment your favourite pendant.",
    Pendants:
        "Check out our collection of beautiful, handmade pendants to find the perfect match for that special someone or must-have treat to yourself.",
    Default: "Check out our collection of beautiful, handmade pieces!",
};
export default function CategoryPage({ products = [], category = null }) {
    return (
        <>
            <NextSeo
                title={`${category} | Snazzy Stones`}
                description={
                    categoryPitches[category]
                        ? categoryPitches[category]?.split(/[?!.]/g)?.[0]
                        : categoryPitches["Default"]
                }
                canonical={`https://snazzystones.ca/retail/categories/${category.replace(" ", "_")}`}
                openGraph={{
                    url: `https://snazzystones.ca/retail/categories/${category.replace(" ", "_")}`,
                    title: `${category} | Snazzy Stones`,
                    description: categoryPitches[category]
                        ? categoryPitches[category]?.split(/[?!.]/g)?.[0]
                        : categoryPitches["Default"],
                    images: [
                        {
                            url: collectionCardMap[category]?.url,
                            width: 1557,
                            height: 1557,
                            alt: collectionCardMap[category]?.alt,
                            type: "image/jpeg",
                        },
                    ],
                    site_name: "SnazzyStones",
                }}
                twitter={{
                    cardType: "summary",
                }}
            />
            <header
                className={`${styles.fallbackHeader} ${
                    styles[`${category.toLowerCase().replace(" ", "_")}Header`]
                } heroSection `}
            >
                <div className='flex flex-col'>
                    <h1 className='heroTitle text-white overlayText'>{category}</h1>
                    {categoryPitches[category] && (
                        <motion.div
                            initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 1 }}
                            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", opacity: 0.8 }}
                            transition={{ duration: 0.4 }}
                            className='bg-blueyonder-500 px-4 md:px-32 text-left md:text-center py-4 opacity-80 shadow-light'
                        >
                            {categoryPitches[category]}
                        </motion.div>
                    )}
                </div>
            </header>
            <ProductList products={products} categories={category} />
        </>
    );
}

export async function getStaticPaths() {
    // get a list of Etsy shop sections from which to draw category names
    await avoidRateLimit(1000);
    const fetchedCategories = await fetchAndCacheCategories();
    const categories = fetchedCategories.results;

    return {
        paths: categories.map((section) => ({
            params: { categoryName: section.title.replace(" ", "_") },
        })),
        fallback: false,
    };
}

export async function getStaticProps(context) {
    const { params } = context;
    await avoidRateLimit(1000);
    const fetchedCategories = await fetchAndCacheCategories();
    const categories = fetchedCategories.results;

    const categoryId = categories.find(
        (section) => section.title === params.categoryName.replace("_", " ")
    )?.shop_section_id;

    let products = [];

    if (categoryId) {
        await avoidRateLimit(1000);
        const fetchedProducts = await fetchAndCacheProducts({ categoryId });
        products = fetchedProducts.results;
    }

    return {
        props: {
            products,
            category: params.categoryName.replace("_", " "),
        },
        revalidate: 60 * 60, //revalidate once an hour
    };
}
