import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import menuContents from "../menuContents";

const variants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
};

export const MobileNavList = () => (
    <motion.ul variants={variants} className='m-0 px-16 py-6 absolute top-24 w-full'>
        {menuContents.map((menuItem, index) => (
            <MenuItem menuItem={menuItem} key={`mobile-menu-item-${index}`} />
        ))}
    </motion.ul>
);
