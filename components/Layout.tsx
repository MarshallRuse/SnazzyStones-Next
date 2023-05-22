import Navbar from "./NavMenu/NavBar";
import Footer from "./Footer";
import {ReactNode} from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main className='main mt-20 md:mt-24'>{children}</main>
            <Footer />
        </>
    );
}
