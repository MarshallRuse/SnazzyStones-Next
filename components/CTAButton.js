import { forwardRef } from "react";

const CTAButton = forwardRef(({ children, className, element: Component = "a", disabled = false, ...rest }, ref) => {
    return (
        <Component
            ref={ref}
            className={`inline-block rounded-3xl py-4 px-10 text-white text-sm font-normal tracking-wider no-underline uppercase whitespace-nowrap cursor-pointer min-w-[12rem] ${
                disabled
                    ? "bg-cerise-200 pointer-events-none"
                    : "bg-cerise-500 transition-all duration-300  hover:bg-cerise-400 hover:scale-110 focus:bg-cerise-400 focus:scale-110 active:bg-cerise-600"
            } ${className}`}
            {...rest}
        >
            {children}
        </Component>
    );
});

CTAButton.displayName = "CTAButton";

export default CTAButton;
