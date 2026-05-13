//Name both cache SDK imports redis so they can be swapped out if one were to blow through the cache limit
//import { kv as redis } from "@vercel/kv";
import { Redis } from "@upstash/redis";
import type { ShopSectionResponse } from "@/types/EtsyAPITypes";
import type { CategoriesMinAPIData } from "@/types/Types";
import { getEtsyApiKey } from "../etsy.util";
import { isRedisSkippedDuringStaticRender } from "../redisStaticGuard";
import {
	parseCategoriesMinList,
	parseCategoriesRedisValue,
} from "../products/productMinGuard";

// Comment out if using kv
const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_TTL_MS = 1000 * 60 * 60 * 48;

/** Returns null when Etsy is unreachable or misconfigured; [] is a valid empty shop. */
export async function fetchCategoriesFromEtsy(): Promise<
	ShopSectionResponse[] | null
> {
	try {
		const apiKey = getEtsyApiKey();

		if (!apiKey) {
			throw new Error("ETSY_API_KEYSTRING is not set");
		}

		const sectionsResponse = await fetch(
			`https://api.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/sections`,
			{
				method: "GET",
				headers: {
					"x-api-key": apiKey,
				},
			},
		);

		if (!sectionsResponse.ok) {
			console.error("Etsy shop sections request failed:", {
				status: sectionsResponse.status,
				statusText: sectionsResponse.statusText,
			});
			return null;
		}

		let body: { results?: ShopSectionResponse[] };
		try {
			body = await sectionsResponse.json();
		} catch {
			console.error("Etsy sections response: invalid JSON");
			return null;
		}

		const categories = body?.results;
		if (!Array.isArray(categories)) {
			return [];
		}
		return categories.filter((cat) => cat?.active_listing_count > 0);
	} catch (error) {
		console.error("Error fetching categories from Etsy:", error);
		return null;
	}
}

async function redisGet(key: string): Promise<unknown> {
	try {
		return await redis.get(key);
	} catch (e) {
		if (!isRedisSkippedDuringStaticRender(e)) {
			console.error(`Redis get failed for key "${key}":`, e);
		}
		return undefined;
	}
}

async function redisSet(key: string, value: string | number): Promise<boolean> {
	try {
		await redis.set(key, value);
		return true;
	} catch (e) {
		if (!isRedisSkippedDuringStaticRender(e)) {
			console.error(`Redis set failed for key "${key}":`, e);
		}
		return false;
	}
}

async function readCategoriesFromRedis(): Promise<CategoriesMinAPIData[]> {
	const raw = await redisGet("categories");
	return parseCategoriesRedisValue(raw);
}

async function readCategoriesCacheTimestamp(): Promise<number | undefined> {
	const raw = await redisGet("timeSinceLastEtsyCategoriesFetch");
	if (raw === undefined || raw === null) return undefined;
	const n = Number(raw);
	return Number.isFinite(n) ? n : undefined;
}

function isCacheStale(ts: number | undefined): boolean {
	if (ts === undefined) return true;
	return Date.now() - ts > CACHE_TTL_MS;
}

async function rebuildCategoriesCacheFromEtsy(): Promise<
	CategoriesMinAPIData[]
> {
	const categories = await fetchCategoriesFromEtsy();
	if (categories === null) {
		return [];
	}

	const minimalCategoriesData: CategoriesMinAPIData[] = categories.map(
		(cat) => ({
			shop_section_id: cat.shop_section_id,
			title: cat.title,
		}),
	);

	const validated = parseCategoriesMinList(minimalCategoriesData);

	await redisSet("categories", JSON.stringify(validated));
	await redisSet("timeSinceLastEtsyCategoriesFetch", Date.now());

	return validated;
}

export async function fetchCategoriesFromCache(): Promise<
	CategoriesMinAPIData[]
> {
	const cacheTs = await readCategoriesCacheTimestamp();
	const stale = isCacheStale(cacheTs);

	if (stale) {
		console.log("fetching categories from etsy");
		const fresh = await rebuildCategoriesCacheFromEtsy();
		if (fresh.length > 0) {
			return fresh;
		}
		return readCategoriesFromRedis();
	}

	const cached = await readCategoriesFromRedis();
	if (cached.length > 0) {
		return cached;
	}

	const rebuilt = await rebuildCategoriesCacheFromEtsy();
	if (rebuilt.length > 0) {
		return rebuilt;
	}
	return readCategoriesFromRedis();
}
