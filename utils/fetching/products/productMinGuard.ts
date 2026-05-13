import type { Money, ShopProductionPartner } from "@/types/EtsyAPITypes";
import type { CategoriesMinAPIData, ListingImageMin, ProductMinAPIData } from "@/types/Types";

function isMoneyLike(v: unknown): v is Money {
	if (!v || typeof v !== "object") return false;
	const m = v as Record<string, unknown>;
	return (
		typeof m.currency_code === "string" &&
		typeof m.amount === "number" &&
		Number.isFinite(m.amount) &&
		typeof m.divisor === "number" &&
		Number.isFinite(m.divisor) &&
		m.divisor !== 0
	);
}

function parseProductionPartners(v: unknown): ShopProductionPartner[] | undefined {
	if (!Array.isArray(v)) return undefined;
	const out: ShopProductionPartner[] = [];
	for (const p of v) {
		if (!p || typeof p !== "object") continue;
		const o = p as Record<string, unknown>;
		const id = Number(o.production_partner_id);
		if (!Number.isFinite(id)) continue;
		const partner_name =
			typeof o.partner_name === "string" ? o.partner_name : "";
		const location = typeof o.location === "string" ? o.location : "";
		out.push({ production_partner_id: id, partner_name, location });
	}
	return out.length > 0 ? out : undefined;
}

/**
 * Validates and normalizes product rows from Etsy or Redis so downstream UI never sees
 * malformed rows (missing images, wrong types, etc.).
 */
export function parseProductMinList(raw: unknown): ProductMinAPIData[] {
	if (!Array.isArray(raw)) return [];

	const out: ProductMinAPIData[] = [];
	let dropped = 0;

	for (const row of raw) {
		if (!row || typeof row !== "object") {
			dropped++;
			continue;
		}
		const r = row as Record<string, unknown>;

		const listing_id = Number(r.listing_id);
		if (!Number.isFinite(listing_id) || listing_id <= 0) {
			dropped++;
			continue;
		}

		const title =
			typeof r.title === "string" ? r.title.trim() : String(r.title ?? "").trim();
		if (!title) {
			dropped++;
			continue;
		}

		const description =
			typeof r.description === "string"
				? r.description
				: r.description == null
					? ""
					: String(r.description);

		const rawImages = r.images;
		if (!Array.isArray(rawImages)) {
			dropped++;
			continue;
		}

		const images: ListingImageMin[] = [];
		for (const im of rawImages) {
			if (!im || typeof im !== "object") continue;
			const img = im as Record<string, unknown>;
			const url_fullxfull =
				typeof img.url_fullxfull === "string" ? img.url_fullxfull.trim() : "";
			if (!url_fullxfull) continue;
			images.push({
				url_75x75:
					typeof img.url_75x75 === "string" && img.url_75x75.trim()
						? img.url_75x75
						: url_fullxfull,
				url_170x135:
					typeof img.url_170x135 === "string" && img.url_170x135.trim()
						? img.url_170x135
						: url_fullxfull,
				url_fullxfull,
				blurDataURL:
					typeof img.blurDataURL === "string" ? img.blurDataURL : undefined,
			});
		}

		if (images.length === 0) {
			dropped++;
			continue;
		}

		const shop_section_id =
			r.shop_section_id === null
				? null
				: typeof r.shop_section_id === "number" && Number.isFinite(r.shop_section_id)
					? r.shop_section_id
					: null;

		const original_creation_timestamp = Number(r.original_creation_timestamp);
		const num_favorers = Number(r.num_favorers);
		const quantity = Number(r.quantity);

		const url = typeof r.url === "string" ? r.url : "";

		let tags: string[] | null = null;
		if (Array.isArray(r.tags)) {
			const t = r.tags.filter((x): x is string => typeof x === "string");
			tags = t.length > 0 ? t : null;
		}

		out.push({
			listing_id,
			title,
			description,
			images,
			shop_section_id,
			original_creation_timestamp: Number.isFinite(original_creation_timestamp)
				? original_creation_timestamp
				: 0,
			num_favorers: Number.isFinite(num_favorers) ? num_favorers : 0,
			url,
			production_partners: parseProductionPartners(r.production_partners),
			quantity: Number.isFinite(quantity) ? quantity : 0,
			tags,
			...(isMoneyLike(r.price) ? { price: r.price } : {}),
			...(typeof r.facebookAppId === "string"
				? { facebookAppId: r.facebookAppId }
				: {}),
		});
	}

	if (dropped > 0) {
		console.warn(`parseProductMinList: dropped ${dropped} invalid product row(s)`);
	}

	return out;
}

/** Normalize category rows from Redis or Etsy-derived minimal data. */
export function parseCategoriesMinList(raw: unknown): CategoriesMinAPIData[] {
	if (!Array.isArray(raw)) return [];

	const out: CategoriesMinAPIData[] = [];
	let dropped = 0;

	for (const row of raw) {
		if (!row || typeof row !== "object") {
			dropped++;
			continue;
		}
		const r = row as Record<string, unknown>;
		const shop_section_id = Number(r.shop_section_id);
		if (!Number.isFinite(shop_section_id) || shop_section_id <= 0) {
			dropped++;
			continue;
		}
		const title =
			typeof r.title === "string" ? r.title.trim() : String(r.title ?? "").trim();
		if (!title) {
			dropped++;
			continue;
		}
		out.push({ shop_section_id, title });
	}

	if (dropped > 0) {
		console.warn(`parseCategoriesMinList: dropped ${dropped} invalid category row(s)`);
	}

	return out;
}

/** Parse Redis value that may be a JSON string (legacy) or already-parsed array. */
export function parseProductsRedisValue(raw: unknown): ProductMinAPIData[] {
	if (raw == null) return [];
	if (typeof raw === "string") {
		try {
			return parseProductMinList(JSON.parse(raw) as unknown);
		} catch {
			console.error("parseProductsRedisValue: invalid JSON string in products key");
			return [];
		}
	}
	return parseProductMinList(raw);
}

export function parseCategoriesRedisValue(raw: unknown): CategoriesMinAPIData[] {
	if (raw == null) return [];
	if (typeof raw === "string") {
		try {
			return parseCategoriesMinList(JSON.parse(raw) as unknown);
		} catch {
			console.error("parseCategoriesRedisValue: invalid JSON string in categories key");
			return [];
		}
	}
	return parseCategoriesMinList(raw);
}
