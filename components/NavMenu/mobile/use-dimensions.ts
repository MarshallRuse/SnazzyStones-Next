import { MutableRefObject, useEffect, useRef } from 'react';
import { Dimensions } from '@/types/Types';

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
export const useDimensions = (ref: MutableRefObject<HTMLElement>) => {
    const dimensions = useRef<Dimensions>({ width: 0, height: 0 });

    useEffect(() => {
        dimensions.current.width = ref.current.offsetWidth;
        dimensions.current.height = ref.current.offsetHeight;
    }, [ref]);

    return dimensions.current;
};
