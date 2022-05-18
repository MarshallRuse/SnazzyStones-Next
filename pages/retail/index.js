import { fetchAndCacheProducts } from "../../utils/fetching/products/cachedProducts";
import { fetchAndCacheCategories } from "../../utils/fetching/categories/cachedCategories";
import CollectionCard from "../../components/CollectionCard";
import styles from "../../styles/modules/Retail.module.scss";
import ProductList from "../../components/ProductList";

const collectionCardMap = {
    Bracelets: "collectionCard-ChainBracelets_2020-10-22.jpg",
    Necklaces: "collectionCard-ChainNecklaces_2020-10-23.jpg",
    Anklets: "collectionCard-Anklets_2020-10-23.jpg",
    Hoops: "collectionCard-Hoops_2020-10-22.jpg",
    Pendants: "collectionCard-Pendants_2020-10-26.jpg",
};

export default function RetailPage({ products, categories }) {
    return (
        <>
            <header className={`${styles.indexHeader} heroSection `}>
                <div>
                    <h1 className='heroTitle text-white overlayText'>SHOP</h1>
                </div>
            </header>
            <section className='bg-slate-100 grid sm:grid-cols-3 lg:grid-cols-4 gap-10 px-4 md:px-32 py-12 relative'>
                {categories?.map((cat) => (
                    <CollectionCard
                        key={`collection-card-${cat.title.replace(" ", "_")}`}
                        cardImageSrc={collectionCardMap[cat.title] && `/images/${collectionCardMap[cat.title]}`}
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
    const categories = await fetchAndCacheCategories();

    const activeShopListingsFormatted = await fetchAndCacheProducts();

    return {
        props: {
            categories,
            products: activeShopListingsFormatted,
        },
        revalidate: 60 * 60, //revalidate once an hour
    };
}
