import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useCountry(id) {
    const { data, error } = useSWR(`/api/ip`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        countryData: data,
        isLoading: !error && !data,
        isError: error,
    };
}
