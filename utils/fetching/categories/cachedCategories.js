import fs from "fs";
import path from "path";
import process from "process";
import fetchCategories from "./etsyCategories";

const CATEGORIES_CACHE_FILE = "categories-cache.json";

export async function fetchAndCacheCategories() {
    const data = await fetchCategories();

    try {
        fs.writeFileSync(
            path.join(process.cwd(), "utils", "fetching", "categories", CATEGORIES_CACHE_FILE),
            JSON.stringify(data),
            {
                encoding: "utf8",
                flag: "w",
            }
        );
        console.log("Wrote to categories cache");
    } catch (error) {
        console.error("ERROR WRITING CATEGORIES CACHE TO FILE");
        console.error(error);
    }
    return data;
}

export async function getCategories() {
    let cachedData;

    try {
        cachedData = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), "utils", "fetching", "categories", CATEGORIES_CACHE_FILE), "utf8")
        );
        console.log("Fetching categories from cached file");
    } catch (error) {
        console.log("Categories cache not initialized");
    }

    if (!cachedData) {
        const data = await fetchAndCacheCategories();
        cachedData = data;
    }

    return cachedData;
}
