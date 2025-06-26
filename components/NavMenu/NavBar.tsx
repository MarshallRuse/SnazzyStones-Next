'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import SiteSearch from '../SiteSearch';
import { menuContents, fetchCategoryMenuItems } from './menuContents';
import MenuListItem from './MenuListItem';
import HoverStyledAnchor from './HoverStyledAnchor';
import MobileNav from './mobile/MobileNav';
import { LinearProgress } from '@mui/material';
import { MenuItemType } from '@/types/Types';

export default function NavBar() {
    const [shopMenuItems, setShopMenuItems] = useState<MenuItemType[]>([]);

    useEffect(() => {
        async function getCategories() {
            const shopCategories = await fetchCategoryMenuItems();
            setShopMenuItems(shopCategories);
        }

        getCategories();
    }, []);

    return (
        <nav className='fixed top-0 left-0 w-full z-10 py-4 px-8 md:px-16 flex gap-6 items-center justify-center bg-white border-b border-b-bluegreen-500'>
            <Link
                href='/'
                className='flex grow justify-self-start'
            >
                <h3 className='text-center text-3xl whitespace-nowrap'>
                    <span className='snazzy text-blueyonder-500'>Snazzy </span>
                    <span className='stones text-zinc-700'>Stones</span>
                </h3>
            </Link>
            <SiteSearch />
            <ul
                className={`flex grow-0 z-10 bg-white items-center justify-end flex-auto gap-6 text-base text-blueyonder-500`}
            >
                {menuContents.map((menuItem) => (
                    <MenuListItem
                        className={`${menuItem.submenu ? 'menuParent' : ''}`}
                        key={`nav-menu-${menuItem.displayText.replace(' ', '-')}`}
                        widescreen={true}
                    >
                        <>
                            {menuItem.isLink ? (
                                <Link
                                    href={menuItem.link ?? ''}
                                    passHref
                                >
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
                                    {menuItem.link === '/retail' ? (
                                        shopMenuItems.length > 0 ? (
                                            shopMenuItems.map((cat) => (
                                                <MenuListItem
                                                    key={`sub-menu-${cat.displayText.replace(' ', '-')}`}
                                                    widescreen={true}
                                                >
                                                    <Link href={cat.link ?? ''}>
                                                        <HoverStyledAnchor>{cat.displayText}</HoverStyledAnchor>
                                                    </Link>
                                                </MenuListItem>
                                            ))
                                        ) : (
                                            <MenuListItem widescreen={true}>
                                                <LinearProgress sx={{ bgcolor: '#14b6b8', color: '#526996' }} />
                                            </MenuListItem>
                                        )
                                    ) : (
                                        menuItem.submenu.map((sub) => (
                                            <MenuListItem
                                                key={`sub-menu-${sub.displayText.replace(' ', '-')}`}
                                                widescreen={true}
                                            >
                                                <Link href={sub.link ?? ''}>
                                                    <HoverStyledAnchor>{sub.displayText}</HoverStyledAnchor>
                                                </Link>
                                            </MenuListItem>
                                        ))
                                    )}
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
