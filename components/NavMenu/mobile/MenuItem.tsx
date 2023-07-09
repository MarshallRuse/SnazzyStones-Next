import { useState } from "react";
import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import MenuListItem from "../MenuListItem";
import HoverStyledAnchor from "../HoverStyledAnchor";
import { MenuItemType } from "../../../types/Types";

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

interface MenuItemProps {
    menuItem: MenuItemType;
}

export const MenuItem = ({ menuItem, ...rest }: MenuItemProps) => {
    const [submenuOpen, setsubmenuOpen] = useState(false);

    return (
        <motion.li
            className={`m-0 p-0 mb-10 text-lg flex items-center cursor-pointer ${menuItem.submenu ? "menuParent" : ""}`}
            variants={variants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => menuItem.submenu && setsubmenuOpen(!submenuOpen)}
            {...rest}
        >
            <>
                <div className='flex items-center justify-between w-full'>
                    {menuItem.isLink ? (
                        <Link href={menuItem.link} passHref>
                            <HoverStyledAnchor className='navItem' onClick={() => setsubmenuOpen(!submenuOpen)}>
                                {menuItem.displayText}
                            </HoverStyledAnchor>
                        </Link>
                    ) : (
                        <HoverStyledAnchor
                            className='navLink cursor-default'
                            onClick={() => setsubmenuOpen(!submenuOpen)}
                        >
                            {menuItem.displayText}
                        </HoverStyledAnchor>
                    )}
                    {menuItem.submenu && <KeyboardArrowDown className='expansionIcon' />}
                </div>
                {menuItem.submenu && (
                    <motion.ul
                        className='menuChildren'
                        key={`sub-menu-list-${menuItem.displayText.replace(" ", "-")}`}
                        animate={submenuOpen ? "open" : "collapsed"}
                        variants={{
                            open: {
                                opacity: 1,
                                height: menuItem.submenu.length * 60, // 60px is the height of each menu item
                                transition: { staggerChildren: 0.07, delayChildren: 0.2 },
                            },
                            collapsed: {
                                opacity: 0,
                                height: 0,
                                overflow: "hidden",
                                transition: { staggerChildren: 0.05, staggerDirection: -1 },
                            },
                        }}
                        initial='collapsed'
                        transition={{ type: "tween", duration: 0.2, ease: [0.27, 0.03, 0.58, 1] }} // https://cubic-bezier.com/#.27,.03,.58,1
                    >
                        {menuItem.submenu.map((sub) => (
                            <MenuListItem key={`sub-menu-${sub.displayText.replace(" ", "-")}`}>
                                <Link href={sub.link} passHref>
                                    <HoverStyledAnchor>{sub.displayText}</HoverStyledAnchor>
                                </Link>
                            </MenuListItem>
                        ))}
                    </motion.ul>
                )}
            </>
        </motion.li>
    );
};
