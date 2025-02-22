import { forwardRef, ReactNode } from 'react';

interface HoverStyledAnchorProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

const HoverStyledAnchor = forwardRef<HTMLAnchorElement, HoverStyledAnchorProps>(
    ({ children, className, ...rest }, ref) => {
        return (
            <span
                ref={ref}
                className={`py-6 md:py-0 transition-all duration-300 hover:text-bluegreen-500 cursor-pointer ${className}`}
                {...rest}
            >
                {children}
            </span>
        );
    }
);

HoverStyledAnchor.displayName = 'HoverStyledAnchor';

export default HoverStyledAnchor;
