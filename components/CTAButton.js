import { forwardRef } from "react";

const disabledStyling = "bg-cerise-200 pointer-events-none";

const CTAButton = forwardRef(({ children, className, element: Component = "a", disabled = false, ...rest }, ref) => {
    return (
        <Component
            ref={ref}
            className={`inline-block rounded-3xl py-4 px-10 bg-cerise-500 text-white text-sm font-normal tracking-wider no-underline uppercase whitespace-nowrap cursor-pointer transition-all duration-300  hover:bg-cerise-400 hover:scale-110 focus:bg-cerise-700 focus:opacity-80 ${
                disabled ? disabledStyling : ""
            } ${className}`}
            {...rest}
        >
            {children}
        </Component>
    );
});

CTAButton.displayName = "CTAButton";

export default CTAButton;
