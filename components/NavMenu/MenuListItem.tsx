import type { ReactNode } from "react";
import { motion } from "framer-motion";

const widescreenComponent = "hidden md:flex md:flex-col items-start py-6";
const mobileComponent = "flex flex-col items-start py-6";

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    collapsed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

interface MenuListItemProps {
    children: ReactNode;
    className?: string;
    widescreen?: boolean;
}

export default function MenuListItem({ children, className, widescreen = false, ...rest }: MenuListItemProps) {
    return (
        <motion.li
            variants={variants}
            className={`${widescreen ? widescreenComponent : mobileComponent} ${className}`}
            {...rest}
        >
            {children}
        </motion.li>
    );
}
