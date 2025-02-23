'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { ReactNode } from 'react';

const variants = {
    in: {
        x: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    right: {
        x: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
    left: {
        x: -50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

export interface FadeInDivProps {
    children: ReactNode;
    from?: 'left' | 'right';
    threshold?: number;
    className?: string;
}

export default function FadeInDiv({ children, from = 'left', threshold = 0.5, className = '' }: FadeInDivProps) {
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold,
        triggerOnce: true,
    });

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial={from}
            animate={inView ? 'in' : from}
            transition={{ duration: 300 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
