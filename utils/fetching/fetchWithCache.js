import cacheData from "memory-cache";

export default async function fetchWithCache(url, options, cacheDuration = 24) {
    const value = cacheData.get(url);
    if (value) {
        return value;
    } else {
        const hours = cacheDuration;
        const res = await fetch(url, options);
        const data = await res.json();
        cacheData.put(url, data, hours * 1000 * 60 * 60);
        return data;
    }
}
