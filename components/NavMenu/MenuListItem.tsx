import type { ReactNode } from "react";

const widescreenComponent = "hidden md:flex md:flex-col items-start py-6";
const mobileComponent = "flex flex-col items-start py-6";

interface MenuListItemProps {
    children: ReactNode;
    className?: string;
    widescreen?: boolean;
}

export default function MenuListItem({ children, className, widescreen = false, ...rest }: MenuListItemProps) {
    return (
        <li className={`${widescreen ? widescreenComponent : mobileComponent} ${className}`} {...rest}>
            {children}
        </li>
    );
}
