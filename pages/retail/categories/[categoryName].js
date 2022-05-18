import { motion } from "framer-motion";
import styles from "../../../styles/modules/Retail.module.scss";
import { fetchAndCacheProducts } from "../../../utils/fetching/products/cachedProducts";
import ProductList from "../../../components/ProductList";

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
};
export default function CategoryPage({ products, category }) {
    return (
        <>
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

    return {
        paths: sections.map((section) => ({
            params: { categoryName: section.title.replace(" ", "_") },
        })),
        fallback: false,
    };
}

export async function getStaticProps(context) {
    const { params } = context;

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

    const categoryId = sections.find(
        (section) => section.title === params.categoryName.replace("_", " ")
    ).shop_section_id;

    const activeShopListingsFormatted = await fetchAndCacheProducts({ categoryId });

    return {
        props: {
            products: activeShopListingsFormatted,
            category: params.categoryName.replace("_", " "),
        },
        revalidate: 60,
    };
}
