import useSWR, { Fetcher } from 'swr';
import { APIIPResponse } from '@/app/api/ip/route';

const fetcher: Fetcher<APIIPResponse, string> = (...args) => fetch(...args).then((res) => res.json());

interface UseCountryReturn {
    countryData: APIIPResponse | undefined;
    isLoading: boolean;
    isError: boolean;
}

export default function useCountry(): UseCountryReturn {
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
