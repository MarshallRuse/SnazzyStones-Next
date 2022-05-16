export const FlexContainer = ({
    element: Component = "div",
    children,
    numPerRowSm = 3,
    numPerRowMd = 3,
    numPerRowLg = 4,
    numPerRowXl = 6,
    gap = 20,
    className,
    style = {},
    ...rest
}) => (
    <Component
        className={`flexContainer ${className ? className : ""}`}
        style={{
            "--num-per-row-sm": numPerRowSm,
            "--num-per-row-md": numPerRowMd,
            "--num-per-row-lg": numPerRowLg,
            "--num-per-row-xl": numPerRowXl,
            "--flex-item-gap": `${gap}px`,
            ...style,
        }}
        {...rest}
    >
        {children}
    </Component>
);

export const FlexItem = ({ element: Component = "div", children, className, style = {}, ...rest }) => (
    <Component className={`flexItem ${className ? className : ""}`} style={{ ...style }} {...rest}>
        {children}
    </Component>
);
