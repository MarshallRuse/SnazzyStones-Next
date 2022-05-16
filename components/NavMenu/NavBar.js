import Link from "next/link";
import { KeyboardArrowDown } from "@mui/icons-material";
import SiteSearch from "../SiteSearch";
import menuContents from "./menuContents";
import MenuListItem from "./MenuListItem";
import HoverStyledAnchor from "./HoverStyledAnchor";
import MobileNav from "./mobile/MobileNav";

export default function NavBar() {
    return (
        <nav className='fixed top-0 left-0 w-full z-10 py-4 px-8 md:px-16 flex gap-6 items-center justify-center bg-white border-b border-b-bluegreen-500'>
            <Link href='/'>
                <a className='flex flex-grow justify-self-start'>
                    <h3 className='text-center text-3xl whitespace-nowrap'>
                        <span className='snazzy text-blueyonder-500'>Snazzy </span>
                        <span className='stones text-zinc-700'>Stones</span>
                    </h3>
                </a>
            </Link>
            <SiteSearch />
            <ul
                className={`flex flex-grow-0 z-10 bg-white items-center justify-end flex-auto gap-6 text-base text-blueyonder-500`}
            >
                {menuContents.map((menuItem) => (
                    <MenuListItem
                        className={`${menuItem.submenu ? "menuParent" : ""}`}
                        key={`nav-menu-${menuItem.displayText.replace(" ", "-")}`}
                        widescreen={true}
                    >
                        <>
                            {menuItem.isLink ? (
                                <Link href={menuItem.link} passHref>
                                    <HoverStyledAnchor className='navItem'>
                                        {menuItem.displayText}
                                        {menuItem.submenu && <KeyboardArrowDown className='expansionIcon' />}
                                    </HoverStyledAnchor>
                                </Link>
                            ) : (
                                <HoverStyledAnchor className='navLink cursor-default'>
                                    {menuItem.displayText}
                                    {menuItem.submenu && <KeyboardArrowDown className='expansionIcon' />}
                                </HoverStyledAnchor>
                            )}
                            {menuItem.submenu && (
                                <ul className='menuChildren'>
                                    {menuItem.submenu.map((sub) => (
                                        <MenuListItem
                                            key={`sub-menu-${sub.displayText.replace(" ", "-")}`}
                                            widescreen={true}
                                        >
                                            <Link href={sub.link} passHref>
                                                <HoverStyledAnchor>{sub.displayText}</HoverStyledAnchor>
                                            </Link>
                                        </MenuListItem>
                                    ))}
                                </ul>
                            )}
                        </>
                    </MenuListItem>
                ))}
            </ul>
            <div className='md:hidden cursor-pointer w-12 h-12 z-20 relative text-bluegreen-500'>
                <MobileNav />
            </div>
        </nav>
    );
}
