import fetchProducts from "../../../../utils/fetching/products/etsyProducts";

export default async function handler(req, res) {
    console.log("api/retail/products hit!");
    const activeShopListingsFormatted = await fetchProducts({ fetchImages: false });
    res.status(200).json({
        products: activeShopListingsFormatted,
    });
}
