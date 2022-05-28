import fs from "fs";
import path from "path";
import process from "process";
import { fetchProducts } from "./etsyProducts";

const PRODUCTS_CACHE_FILE = "products-cache.json";

export async function fetchAndCacheProducts({ categoryId = "", fetchImages = true, limit = 100 } = {}) {
    const data = {};
    data.results = await fetchProducts({ categoryId, fetchImages, limit });
    data.cache_creation_timestamp = Date.now();

    try {
        fs.writeFileSync(
            path.join(process.cwd(), "utils", "fetching", "products", PRODUCTS_CACHE_FILE),
            JSON.stringify(data),
            "utf8"
        );
        //console.log("Wrote to products cache");
    } catch (error) {
        console.log("ERROR WRITING PRODUCTS CACHE TO FILE");
        console.log(error);
    }
    return data;
}

export async function getProducts() {
    let cachedData;

    try {
        cachedData = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), "utils", "fetching", "products", PRODUCTS_CACHE_FILE), "utf8")
        );
        if (cachedData.cache_creation_timestamp < Date.now() - 1000 * 60 * 60) {
            // more than an hour old
            cachedData = await fetchAndCacheProducts();
        }
        //console.log("Fetching products from cached file");
    } catch (error) {
        //console.log("Products cache not initialized");
    }

    if (!cachedData) {
        const data = await fetchAndCacheProducts();
        cachedData = data;
    }

    return cachedData;
}