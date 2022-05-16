import { useState } from "react";
import { MenuProvider } from "../components/NavMenu/MenuProvider";
import "../styles/globals.scss";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
    // Get menu data via GraphQL query in `pageProps`.
    const { menu } = pageProps;

    // Store menu as state for the MenuProvider.
    const [navMenu] = useState(menu);

    return (
        <MenuProvider value={navMenu}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </MenuProvider>
    );
}

export default MyApp;
