import fetchProducts from "../../../../utils/fetching/products/etsyProducts";

export default async function handler(req, res) {
    let activeShopListingsFormatted = await fetchProducts();
    const query = req.query;
    const { fields } = query;
    if (fields) {
        const fieldList = fields.split(","); // string list of fields should be comma delimited
        activeShopListingsFormatted = activeShopListingsFormatted.map((prod) => {
            const obj = {};
            for (const field of fieldList) {
                obj[field] = prod[field];
            }
            return obj;
        });
    }
    res.status(200).json({
        products: activeShopListingsFormatted,
    });
}
