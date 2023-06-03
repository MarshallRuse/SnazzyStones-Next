import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Search from "@mui/icons-material/Search";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import MenuListItem from "../MenuListItem";
import HoverStyledAnchor from "../HoverStyledAnchor";

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

export const MenuItem = ({ menuItem, ...rest }) => {
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
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0, overflow: "hidden" },
                        }}
                        initial='collapsed'
                        transition={{ type: "tween", duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
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
