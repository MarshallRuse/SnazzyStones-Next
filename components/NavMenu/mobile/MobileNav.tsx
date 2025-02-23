'use client';

import { useState, useRef, useEffect, MutableRefObject } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDimensions } from './use-dimensions';
import { MenuToggle } from './MenuToggle';
import { MobileNavList } from './MobileNavList';

const sidebar = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at calc(100% - 3.5rem) 3rem)`,
        transition: {
            type: 'spring',
            stiffness: 20,
            restDelta: 2,
        },
    }),
    closed: {
        clipPath: 'circle(30px at calc(100% - 3.5rem) 3rem)',
        transition: {
            delay: 0.5,
            type: 'spring',
            stiffness: 400,
            damping: 40,
        },
    },
};

export default function MobileNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const { height } = useDimensions(containerRef as MutableRefObject<HTMLElement>);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <motion.nav
            className='absolute top-0 left-0 bottom-0 right-0 w-12 h-12'
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
            custom={height}
            ref={containerRef}
        >
            <motion.div
                className='fixed top-0 right-0 bottom-0 overflow-y-auto  w-80 bg-white shadow-light'
                variants={sidebar}
            >
                <MobileNavList />
            </motion.div>
            <MenuToggle toggle={() => setIsOpen(!isOpen)} />
        </motion.nav>
    );
}
