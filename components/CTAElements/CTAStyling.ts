export default function CTAStyling(disabled: boolean, className: string) {
    return ` py-4 px-10 text-sm min-w-[12rem] inline-block rounded-3xl text-white text-center font-normal tracking-wider no-underline uppercase whitespace-nowrap cursor-pointer focus:outline-hidden focus:ring-3 focus:ring-cerise-600 focus:ring-offset-2 ${
        disabled
            ? 'bg-cerise-200 pointer-events-none'
            : 'bg-cerise-500 transition-all duration-300 hover:bg-cerise-400 hover:[transform:scale(1.1)] hover:animate-scale-spring will-change-transform focus:bg-cerise-400 focus:scale-110 active:bg-cerise-600'
    } ${className}`;
}
