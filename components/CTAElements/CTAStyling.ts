export default function CTAStyling (disabled: boolean, className: string) {
    return `inline-block rounded-3xl py-4 px-10 text-white text-sm font-normal tracking-wider no-underline uppercase whitespace-nowrap cursor-pointer min-w-[12rem] focus:outline-none focus:ring focus:ring-cerise-600 focus:ring-offset-2 ${
        disabled
            ? "bg-cerise-200 pointer-events-none"
            : "bg-cerise-500 transition-all duration-300  hover:bg-cerise-400 hover:scale-110 focus:bg-cerise-400 focus:scale-110 active:bg-cerise-600"
    } ${className}`
}