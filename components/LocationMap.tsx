import { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

export default function LocationMap() {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    const render = (status: Status) => {
        return <h1>{status}</h1>;
    };

    useEffect(() => {
        if (ref.current && !map) {
            let newMap: google.maps.Map = new google.maps.Map(ref.current, {});
            setMap(newMap);
        }
    }, [map]);

    if (!process.env.GOOGLE_MAPS_KEY) {
        return null;
    }

    return (
        <Wrapper
            apiKey={process.env.GOOGLE_MAPS_KEY}
            render={render}
        >
            <div ref={ref} />
        </Wrapper>
    );
}
