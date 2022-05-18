import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/modules/Home.module.scss";
import { Instagram } from "@mui/icons-material";
import CTAButton from "../components/CTAButton";
import TextContainer from "../components/TextContainer";
import CollectionCard from "../components/CollectionCard";
import ProductListingCard from "../components/ProductListingCard";
import InstagramFeed from "../components/InstagramFeed";
import { fetchAndCacheCategories } from "../utils/fetching/categories/cachedCategories";
import { fetchAndCacheProducts } from "../utils/fetching/products/cachedProducts";

export default function Home({ feed, products, categories }) {
    return (
        <div>
            <Head>
                <title>Snazzy Stones - Specializing in Silver & Gemstone Jewellery</title>
                <meta name='description' content='Specializing in Gemstone Jewellery' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <>
                <header className={`heroSection ${styles.heroBackground}`}>
                    <div>
                        <h1 className='heroTitle overlayText'>
                            <span className='snazzy text-white'>Snazzy </span>
                            <span className='stones text-white'>Stones</span>
                        </h1>
                        <h2 className={`text-3xl pt-6 ${styles.headerSubtitle} text-white overlayText`}>
                            Specializing in Silver & Gemstone Jewellery
                        </h2>
                        <Link href='/retail' passHref>
                            <CTAButton className='mt-4'>SHOP NOW</CTAButton>
                        </Link>
                    </div>
                </header>
                <section className='px-10 py-20 text-blueyonder-500'>
                    <TextContainer>
                        <h2>Welcome to Snazzy Stones</h2>
                        <p>
                            Here you will find unique, high-quality sterling silver jewellery handmade from artisans
                            around the globe. We personally travel to the different countries and handpick each item
                            exclusively from small, family businesses and independent designers. So far, we have a
                            collection of pieces from Bali, Italy, Mexico, and Poland.
                        </p>
                        <p>
                            We hope you enjoy checking out our site. We are busy adding new pieces to our web-page in
                            order to bring Snazzy Stones to the online world, so please check in again to see what’s
                            new!
                        </p>
                    </TextContainer>
                </section>
                <section className='grid md:grid-cols-3 gap-10 px-4 md:px-32 py-12 relative'>
                    <CollectionCard cardImageSrc='/images/collectionCard-Hoops_2020-10-22.jpg' title='Hoops' />
                    <CollectionCard cardImageSrc='/images/collectionCard-Pendants_2020-10-26.jpg' title='Pendants' />
                    <CollectionCard
                        cardImageSrc='/images/collectionCard-ChainNecklaces_2020-10-23.jpg'
                        title='Necklaces'
                    />
                </section>
                <section className='bg-slate-100 grid md:grid-cols-3 gap-10 px-4 md:px-32 py-12 relative'>
                    <CollectionCard
                        cardImageSrc='/images/collectionCard-ChainBracelets_2020-10-22.jpg'
                        title='Bracelets'
                    />
                    <CollectionCard cardImageSrc='/images/collectionCard-Anklets_2020-10-23.jpg' title='Anklets' />
                </section>
                <section className={`px-10 py-20 text-blueyonder-500 ${styles.featuredProductSection}`}>
                    <TextContainer>
                        <h2>Recently Added Products</h2>
                        <p>Check out our most recent snazziness!</p>
                    </TextContainer>
                    <div className='grid sm:grid-cols-4 lg:grid-cols-4 gap-10 py-5 px-8'>
                        {products?.map((prod) => (
                            <ProductListingCard
                                key={`recent-product-${prod.listing_id}`}
                                imagePrimary={prod.images[0].url_fullxfull}
                                imagePlaceholder={prod.images[0].url_75x75}
                                productCategory={
                                    categories.find((cat) => cat.shop_section_id === prod.shop_section_id).title
                                }
                                productName={prod.title}
                                productPrice={prod.price.amount / prod.price.divisor}
                                productPageLink={`/retail/products/${prod.listing_id}`}
                            />
                        ))}
                    </div>
                </section>
                <section className={`px-10 py-20 text-white ${styles.findUsSection}`}>
                    <TextContainer>
                        <h2 className='overlayText'>Interested in Finding Us in Person?</h2>
                        <p className='overlayText'>
                            We can be found at multiple venues each week throughout the spring, summer, and autumn. Take
                            a look at our schedule to see if we’ll be at a show near you!
                        </p>
                        <Link href='/our-shows' passHref>
                            <CTAButton>FIND US!</CTAButton>
                        </Link>
                    </TextContainer>
                </section>
                <section className='px-10 py-20 text-blueyonder-500'>
                    <TextContainer className='flex flex-col items-center'>
                        <h2>Visit us on Instagram</h2>
                        <a
                            className='flex items-center gap-3 group text-bluegreen-500'
                            href='https://www.instagram.com/snazzystones/'
                            target='_blank'
                            rel='noreferrer'
                        >
                            <span className='w-16 relative'>
                                <Image
                                    src='/images/snazzystonesInstagramLogo.jpg'
                                    width={1080}
                                    height={1080}
                                    className='rounded-full'
                                    alt='Snazzy Stones Instagram logo'
                                />
                                <span className='absolute top-0 left-o w-16 h-16 flex items-center justify-center bg-black text-white rounded-full opacity-0 transition group-hover:opacity-50 '>
                                    <Instagram fontSize='large' />
                                </span>
                            </span>
                            snazzystones
                        </a>
                        <p className='mt-10'>
                            Follow us online for all our latest product updates, vendor shows, and more!
                        </p>
                    </TextContainer>
                    <InstagramFeed feed={feed} />
                </section>
            </>
        </div>
    );
}

export const getStaticProps = async () => {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,thumbnail_url,permalink&access_token=${process.env.INSTAGRAM_KEY}&limit=4`;
    const data = await fetch(url);
    const feed = await data.json();
    const categories = await fetchAndCacheCategories();
    const products = await fetchAndCacheProducts({ limit: 4 });

    return {
        props: {
            feed,
            products,
            categories,
        },
        revalidate: 60 * 60, //revalidate once an hour
    };
};
