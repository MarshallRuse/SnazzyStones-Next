import { forwardRef, ReactNode, JSX } from 'react';
import CTAStyling from './CTAStyling';

interface BaseCTALinkProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    type?: 'external' | 'internal';
}

interface ExternalCTALinkProps extends BaseCTALinkProps {
    type: 'external';
}

interface InternalCTALinkProps extends BaseCTALinkProps {
    type?: 'internal';
}

type CTALinkProps =
    | (ExternalCTALinkProps & JSX.IntrinsicElements['a'])
    | (InternalCTALinkProps & JSX.IntrinsicElements['span']);

const CTALink = forwardRef<HTMLAnchorElement | HTMLSpanElement, CTALinkProps>(
    ({ children, className = '', disabled = false, type = 'internal', ...rest }, ref) => {
        if (type === 'external') {
            return (
                <a
                    ref={ref as React.RefObject<HTMLAnchorElement>}
                    className={CTAStyling(disabled, className)}
                    {...rest}
                >
                    {children}
                </a>
            );
        }

        return (
            <span
                ref={ref as React.RefObject<HTMLSpanElement>}
                className={CTAStyling(disabled, className)}
                {...rest}
            >
                {children}
            </span>
        );
    }
);

CTALink.displayName = 'CTALink';

export default CTALink;
