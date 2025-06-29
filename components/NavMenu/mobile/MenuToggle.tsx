import { motion, SVGMotionProps } from 'motion/react';

const Path = (props: SVGMotionProps<SVGPathElement>) => (
    <motion.path
        fill='transparent'
        strokeWidth='3'
        stroke='hsl(0, 0%, 18%)'
        strokeLinecap='round'
        {...props}
    />
);

interface MenuToggleProps {
    toggle: () => void;
}

export const MenuToggle = ({ toggle }: MenuToggleProps) => (
    <button
        onClick={toggle}
        className='outline-hidden border-none cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-transparent'
    >
        <svg
            width='23'
            height='23'
            viewBox='0 0 23 23'
        >
            <Path
                variants={{
                    closed: { d: 'M 2 2.5 L 20 2.5' },
                    open: { d: 'M 3 16.5 L 17 2.5' },
                }}
            />
            <Path
                d='M 2 9.423 L 20 9.423'
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                    closed: { d: 'M 2 16.346 L 20 16.346' },
                    open: { d: 'M 3 2.5 L 17 16.346' },
                }}
            />
        </svg>
    </button>
);
