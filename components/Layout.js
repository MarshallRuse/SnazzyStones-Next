import Navbar from "./NavMenu/NavBar";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main className='main mt-20 md:mt-24'>{children}</main>
            <Footer />
        </>
    );
}
