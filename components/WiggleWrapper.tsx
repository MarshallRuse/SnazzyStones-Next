import {ReactNode, useCallback, useEffect, useState} from "react";
import { motion } from "framer-motion";

export interface WiggleWrapperProps {
    rotate?: number;
    timing?: number;
    children: ReactNode;
}

export default function WiggleWrapper({ rotate = 15, timing = 150, children }: WiggleWrapperProps) {
    const [isBooped, setIsBooped] = useState(false);

    useEffect(() => {
        if (!isBooped) {
            return;
        }
        const timeoutId = window.setTimeout(() => {
            setIsBooped(false);
        }, timing);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isBooped, timing]);

    const initiateWiggle = useCallback(() => {
        setIsBooped(true);
    }, []);

    return (
        <motion.span
            className='inline-block'
            variants={{
                booped: {
                    rotate,
                },
                unBooped: {
                    rotate: 0,
                },
            }}
            animate={isBooped ? "booped" : "unBooped"}
            onHoverStart={initiateWiggle}
            whileHover={{ scale: 1.1 }}
            whileFocus={{ scale: 1.1 }}
            transition={{
                type: "spring",
                stiffness: 300,
                mass: 1,
                damping: 4,
            }}
        >
            {children}
        </motion.span>
    );
}
