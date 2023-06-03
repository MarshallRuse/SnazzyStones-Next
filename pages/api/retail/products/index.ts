import { ShopListingResponse } from "../../../../types/EtsyAPITypes";
import fetchProducts from "../../../../utils/fetching/products/etsyProducts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const shopListings = await fetchProducts();
    const query = req.query;
    const { fields } = query;
    let activeShopListingsFormatted;

    if (fields) {
        const fieldList = typeof fields === "string" ? fields.split(",") : fields; // string list of fields should be comma delimited
        activeShopListingsFormatted = shopListings?.map((prod) => {
            const obj: Partial<ShopListingResponse> = {};
            for (const field of fieldList) {
                obj[field] = prod[field];
            }
            return obj;
        });
    }
    console.log("activeShopListingsFormatted", activeShopListingsFormatted);
    res.status(200).json({
        products: activeShopListingsFormatted !== undefined ? activeShopListingsFormatted : shopListings,
    });
}
