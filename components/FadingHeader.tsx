'use client';

import { motion, useScroll, useTransform, useSpring, HTMLMotionProps } from 'motion/react';
import { useRef } from 'react';

interface FadingHeaderProps extends HTMLMotionProps<'header'> {
    children: React.ReactNode;
    className?: string;
}

// FadingHeader is a component that fades to white when scrolling down.
// This was implemented on the product listing pages to counteract the bug where the Sort input
// div would fade up as the header image faded out.
const FadingHeader = ({ children, className, ...rest }: FadingHeaderProps) => {
    const headerRef = useRef<HTMLElement>(null);
    // Choose at what point the image opacity becomes 0
    // E.G: 50px from the top
    const offsetHeight = headerRef.current?.getBoundingClientRect()?.height || 400;
    // Vertical scroll distance in pixels.
    const { scrollY } = useScroll();
    // Transforms scroll and image height values to opacity values
    const yRange = useTransform(scrollY, [0, offsetHeight], [1, 0]);
    const opacity = useSpring(yRange, { stiffness: 400, damping: 40 });

    return (
        <motion.header
            ref={headerRef}
            style={{ opacity }}
            className={`heroSectionHeader ${className || ''}`}
            {...rest}
        >
            {children}
        </motion.header>
    );
};

export default FadingHeader;
