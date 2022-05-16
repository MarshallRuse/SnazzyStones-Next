export default function TextContainer({ children, centered = true, className, ...rest }) {
    return (
        <div className={`text-xl ${centered ? "text-center" : ""} mx-auto max-w-prose ${className}`} {...rest}>
            {children}
        </div>
    );
}
