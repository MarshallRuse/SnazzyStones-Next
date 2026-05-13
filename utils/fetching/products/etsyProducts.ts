import he from "he";
import Bottleneck from "bottleneck";
//Name both cache SDK imports redis so they can be swapped out if one were to blow through the cache limit
//import { kv as redis } from "@vercel/kv";
import { Redis } from "@upstash/redis";
import type { ShopListingResponse, ShopListingsResponse } from "@/types/EtsyAPITypes";
import type { ProductMinAPIData } from "@/types/Types";
import { fetchImageAsDataURL } from "@/utils/images/blurDataURL";
import { getEtsyApiKey } from "../etsy.util";
import { isRedisSkippedDuringStaticRender } from "../redisStaticGuard";
import {
	parseProductMinList,
	parseProductsRedisValue,
} from "./productMinGuard";

// Comment out if using kv
const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CACHE_TTL_MS = 1000 * 60 * 60 * 48;

export interface FetchProductsParams {
	categoryId?: number | null;
	fetchImages?: boolean;
	limit?: number;
}

// fetchProducts shared by categories index page getStaticProps and will be
// be shared by an api called by the client for infinite loading
export async function fetchProductsFromEtsy({
	categoryId = null,
	fetchImages = true,
	limit = 100,
}: FetchProductsParams = {}): Promise<ShopListingResponse[] | null> {
	try {
		const apiKey = getEtsyApiKey();

		if (!apiKey) {
			throw new Error("ETSY_API_KEYSTRING is not set");
		}

		// using bottleneck for rate limiting
		const limiter = new Bottleneck({
			minTime: 1000,
			maxConcurrent: 1,
		});

		const url = categoryId
			? `https://api.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/shop-sections/listings?shop_section_ids=${categoryId}&limit=${limit}`
			: `https://api.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/listings/active?limit=${limit}`;

		const activeShopListingsResponse = await limiter.schedule(() =>
			fetch(url, {
				method: "GET",
				headers: {
					"x-api-key": apiKey,
				},
			}),
		);

		if (!activeShopListingsResponse.ok) {
			console.error("Etsy listings request failed:", {
				status: activeShopListingsResponse.status,
				statusText: activeShopListingsResponse.statusText,
			});
			return null;
		}

		let body: { results?: ShopListingResponse[] };
		try {
			body = await activeShopListingsResponse.json();
		} catch {
			console.error("Etsy listings response: invalid JSON");
			return null;
		}

		let activeShopListings = Array.isArray(body?.results) ? body.results : [];

		if (activeShopListings.length > 0 && fetchImages) {
			const listingIds = activeShopListings
				.map((listing) => listing.listing_id)
				.join(",");
			const listingImagesResponse = await limiter.schedule(() =>
				fetch(
					`https://api.etsy.com/v3/application/listings/batch?listing_ids=${listingIds}&includes=Images`,
					{
						method: "GET",
						headers: {
							"x-api-key": apiKey,
						},
					},
				),
			);

			if (!listingImagesResponse.ok) {
				console.error("Etsy listings batch (images) request failed:", {
					status: listingImagesResponse.status,
					statusText: listingImagesResponse.statusText,
				});
				return null;
			}

			let batchBody: ShopListingsResponse;
			try {
				batchBody = await listingImagesResponse.json();
			} catch {
				console.error("Etsy batch listings response: invalid JSON");
				return null;
			}

			if (!Array.isArray(batchBody?.results)) {
				console.error("Etsy batch listings: missing results array");
				return null;
			}
			activeShopListings = batchBody.results;
		}

		return activeShopListings.map((l) => ({ ...l, title: he.decode(l.title) }));
	} catch (err) {
		console.log(err);
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

async function readProductsFromRedis(): Promise<ProductMinAPIData[]> {
	const raw = await redisGet("products");
	return parseProductsRedisValue(raw);
}

async function readProductsCacheTimestamp(): Promise<number | undefined> {
	const raw = await redisGet("timeSinceLastEtsyFetch");
	if (raw === undefined || raw === null) return undefined;
	const n = Number(raw);
	return Number.isFinite(n) ? n : undefined;
}

function isCacheStale(ts: number | undefined): boolean {
	if (ts === undefined) return true;
	return Date.now() - ts > CACHE_TTL_MS;
}

function applyCategoryAndLimit(
	products: ProductMinAPIData[],
	categoryId: number | null,
	limit: number,
): ProductMinAPIData[] {
	let selected = products;
	if (categoryId) {
		selected = selected.filter(
			(product) => product.shop_section_id === categoryId,
		);
	}
	if (limit && limit < selected.length) {
		selected = selected.slice(0, limit);
	}
	return selected.slice(0, limit);
}

/** Fetch from Etsy, build minimal payload, validate, and persist. Returns [] if Etsy fails. */
async function rebuildProductsCacheFromEtsy(): Promise<ProductMinAPIData[]> {
	const products = await fetchProductsFromEtsy({
		categoryId: null,
		fetchImages: true,
		limit: 100,
	});
	if (!products) {
		return [];
	}

	const minimalProductsData: ProductMinAPIData[] = await Promise.all(
		products.map(async (product) => ({
			listing_id: product.listing_id,
			title: product.title,
			description: product.description,
			images: await Promise.all(
				product.images?.map(async (image) => ({
					url_75x75: image.url_75x75,
					url_170x135: image.url_170x135,
					url_fullxfull: image.url_fullxfull,
					blurDataURL: await fetchImageAsDataURL(image.url_75x75),
				})) ?? [],
			),
			shop_section_id: product.shop_section_id,
			original_creation_timestamp: product.original_creation_timestamp,
			num_favorers: product.num_favorers,
			url: product.url,
			production_partners: product.production_partners,
			quantity: product.quantity,
			tags: product.tags,
		})),
	);

	const validated = parseProductMinList(minimalProductsData);

	const payload = JSON.stringify(validated);
	await redisSet("products", payload);
	await redisSet("timeSinceLastEtsyFetch", Date.now());

	return validated;
}

export async function fetchProductsFromCache({
	categoryId = null,
	limit = 100,
}: FetchProductsParams = {}): Promise<ProductMinAPIData[]> {
	const cacheTs = await readProductsCacheTimestamp();
	const stale = isCacheStale(cacheTs);

	let selectedProducts: ProductMinAPIData[] = [];

	if (stale) {
		const fresh = await rebuildProductsCacheFromEtsy();
		if (fresh.length > 0) {
			selectedProducts = fresh;
		} else {
			selectedProducts = await readProductsFromRedis();
		}
	} else {
		selectedProducts = await readProductsFromRedis();
		if (selectedProducts.length === 0) {
			selectedProducts = await rebuildProductsCacheFromEtsy();
		}
	}

	if (
		selectedProducts.some((product) =>
			(product.images ?? []).some(
				(image) => image.url_75x75 && !image.blurDataURL,
			),
		)
	) {
		const rebuilt = await rebuildProductsCacheFromEtsy();
		if (rebuilt.length > 0) {
			selectedProducts = rebuilt;
		}
	}

	return applyCategoryAndLimit(selectedProducts, categoryId, limit);
}
