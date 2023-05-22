import {forwardRef, ReactNode} from "react";
import CTAStyling from "./CTAStyling";

export interface CTALinkProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}

const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps & JSX.IntrinsicElements["a"]>(
    ({ children, className = "", disabled = false, ...rest }, ref) => {
        return (
            <a
                ref={ref}
                className={CTAStyling(disabled, className)}
                {...rest}
            >
                {children}
            </a>
        );
    }
);

CTALink.displayName = "CTALink";

export default CTALink;
