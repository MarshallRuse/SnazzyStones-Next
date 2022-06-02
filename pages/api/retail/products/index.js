import cacheData from "memory-cache";
import fetchProducts from "../../../../utils/fetching/products/etsyProducts";

export default async function handler(req, res) {
    const urlKey = "/api/retail/products";
    const productsData = cacheData.get(urlKey); // this API url is the cache key
    if (productsData) {
        res.status(200).json({
            products: productsData,
        });
    } else {
        const activeShopListingsFormatted = await fetchProducts();
        //const data = await res.json();
        cacheData.put(urlKey, activeShopListingsFormatted, 24 * 1000 * 60 * 60);
        res.status(200).json({
            products: activeShopListingsFormatted,
        });
    }
}
