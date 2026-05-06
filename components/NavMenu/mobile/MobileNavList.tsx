import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MenuItem } from './MenuItem';
import { menuContents, fetchCategoryMenuItems } from '../menuContents';

const variants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

export const MobileNavList = () => {
    const [menu, setMenu] = useState(() =>
        menuContents.map((item) => ({
            ...item,
            submenu: item.submenu ? [...item.submenu] : item.submenu,
        })),
    );

    useEffect(() => {
        async function getCategories() {
            const shopCategories = await fetchCategoryMenuItems();
            setMenu((prev) => {
                const next = prev.map((item) => ({ ...item }));
                const shopIndex = next.findIndex((menuItem) => menuItem.link === '/retail');
                if (shopIndex !== -1) {
                    next[shopIndex] = { ...next[shopIndex], submenu: shopCategories };
                }
                return next;
            });
        }

        getCategories();
    }, []);

    return (
        <motion.ul
            variants={variants}
            className='m-0 px-16 py-6 absolute top-24 w-full'
        >
            {menu.map((menuItem, index) => (
                <MenuItem
                    menuItem={menuItem}
                    key={`mobile-menu-item-${index}`}
                />
            ))}
        </motion.ul>
    );
};
