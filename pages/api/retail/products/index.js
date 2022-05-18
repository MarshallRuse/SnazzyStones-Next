import { getProducts } from "../../../../utils/fetching/products/cachedProducts";

export default async function handler(req, res) {
    const activeShopListingsFormatted = await getProducts();
    res.status(200).json({
        products: activeShopListingsFormatted,
    });
}
