import { DefaultSeo } from "next-seo";
import "../styles/globals.scss";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <DefaultSeo
                title='Snazzy Stones - Specializing in Silver & Gemstone Jewellery'
                description='Unique, high-quality sterling silver jewellery handmade from artisans around the globe.'
                openGraph={{
                    type: "website",
                    locale: "en_us",
                    url: "https://snazzystones.ca/",
                    site_name: "SnazzyStones",
                    title: "Snazzy Stones - Specializing in Silver & Gemstone Jewellery",
                    description:
                        "Unique, high-quality sterling silver jewellery handmade from artisans around the globe.",
                    images: [
                        {
                            url: "https://res.cloudinary.com/marsh/image/upload/q_auto/v1651953973/snazzystones-website/chainBracelets_2020-10-12.jpg",
                            width: 3544,
                            height: 1772,
                            alt: "Snazzystones.ca silver chain bracelets",
                            type: "image/jpeg",
                        },
                        {
                            url: "https://res.cloudinary.com/marsh/image/upload/q_auto/v1653236137/snazzystones-website/stoneBracelets_2019-07-25.jpg",
                            width: 3455,
                            height: 1727,
                            alt: "Snazzystones.ca silver and precious stone bracelets",
                            type: "image/jpeg",
                        },
                    ],
                }}
                twitter={{
                    cardType: "summary_large_image",
                }}
            />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp;
