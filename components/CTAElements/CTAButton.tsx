import {forwardRef, ReactNode} from "react";
import CTAStyling from "./CTAStyling";

export interface CTAButtonProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}

const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps & JSX.IntrinsicElements["button"]>(
    ({ children, className = "", disabled = false, ...rest }, ref) => {
        return (
            <button
                ref={ref}
                className={CTAStyling(disabled, className)}
                {...rest}
            >
                {children}
            </button>
        );
    }
);

CTAButton.displayName = "CTAButton";

export default CTAButton;
