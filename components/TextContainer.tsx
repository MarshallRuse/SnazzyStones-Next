import {ReactNode} from "react";

export interface TextContainerProps {
    children: ReactNode;
    centered?: boolean;
    className?: string;
}

export default function TextContainer({ children, centered = true, className = "", ...rest }: TextContainerProps) {
    return (
        <div className={`text-xl ${centered ? "text-center" : ""} mx-auto max-w-prose ${className}`} {...rest}>
            {children}
        </div>
    );
}
