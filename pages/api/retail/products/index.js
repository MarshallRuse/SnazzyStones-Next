import { fetchProducts } from "../../../../utils/fetching/products";

export default async function handler(req, res) {
    const activeShopListingsFormatted = await fetchProducts();
    res.status(200).json({
        products: activeShopListingsFormatted,
    });
}
