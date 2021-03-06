export default async function fetchCategories() {
    // get a list of Etsy shop sections from which to draw category names
    const sectionsResponse = await fetch(
        `https://openapi.etsy.com/v3/application/shops/${process.env.ETSY_SHOP_ID}/sections`,
        {
            method: "GET",
            headers: {
                "x-api-key": process.env.ETSY_API_KEYSTRING,
            },
        }
    );
    const { results: categories } = await sectionsResponse.json();
    return categories.filter((cat) => cat.active_listing_count > 0);
}
