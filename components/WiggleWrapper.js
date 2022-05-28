import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WiggleWrapper({ rotate = 15, timing = 150, children }) {
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
    }, [isBooped]);

    const initiateWiggle = useCallback(() => {
        setIsBooped(true);
    }, [isBooped]);

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
