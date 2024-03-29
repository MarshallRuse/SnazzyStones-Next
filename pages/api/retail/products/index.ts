import { ProductMinAPIData } from "../../../../types/Types";
import { fetchProductsFromCache } from "../../../../utils/fetching/products/etsyProducts";
import { NextApiRequest, NextApiResponse } from "next";

export interface APIProductsResponse {
    products: Partial<ProductMinAPIData>[] | ProductMinAPIData[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIProductsResponse>) {
    const shopListings = await fetchProductsFromCache();
    const query = req.query;
    const { fields } = query;
    let activeShopListingsFormatted: Partial<ProductMinAPIData>[] | undefined = undefined;

    if (fields) {
        const fieldList = typeof fields === "string" ? fields.split(",") : fields; // string list of fields should be comma delimited
        activeShopListingsFormatted = shopListings?.map((prod) => {
            const obj: Partial<ProductMinAPIData> = {};
            for (const field of fieldList) {
                obj[field] = prod[field];
            }
            return obj;
        });
    }

    res.status(200).json({
        products: activeShopListingsFormatted !== undefined ? activeShopListingsFormatted : shopListings,
    });
}
