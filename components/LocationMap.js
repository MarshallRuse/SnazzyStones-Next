import { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

export default function LocationMap() {
    const ref = useRef(null);
    const [map, setMap] = useState();

    const render = (status) => {
        return <h1>{status}</h1>;
    };

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    return (
        <Wrapper apiKey={process.env.GOOGLE_MAPS_KEY} render={render}>
            <div ref={ref} />
        </Wrapper>
    );
}
