import { useState } from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import ProductListingCard from "./ProductListingCard";
import formatProductTitleAsURL from "../utils/formatProductTitleAsURL";
import {ShopListingCondensed, ShopSectionResponse} from "../types/EtsyAPITypes";

export interface ProductListProps {
    products: ShopListingCondensed[];
    categories: string | ShopSectionResponse[] | null;
}

export default function ProductList({ products = [], categories = [] }: ProductListProps) {
    const [sortOption, setSortOption] = useState("date-added-newest");

    const sortedProducts = () => {
        switch (sortOption) {
            case "date-added-newest":
                return products?.sort(
                    (prodA, prodB) =>
                        prodB.original_creation_timestamp - prodA.original_creation_timestamp
                );
            case "date-added-oldest":
                return products?.sort(
                    (prodA, prodB) =>
                        prodA.original_creation_timestamp - prodB.original_creation_timestamp
                );
            case "most-popular":
                return products?.sort((prodA, prodB) =>
                    prodB.num_favorers - prodA.num_favorers
                );
            case "price-lowest":
                return products?.sort(
                    (prodA, prodB) =>
                        prodA.price.amount / prodA.price.divisor -
                        prodB.price.amount / prodB.price.divisor
                );
            case "price-highest":
                return products?.sort(
                    (prodA, prodB) =>
                        prodB.price.amount / prodB.price.divisor - prodA.price.amount / prodA.price.divisor
                );
            default:
                return products;
        }
    };

    return (
        <>
            <div className='px-4 md:px-32 py-12'>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl>
                        <InputLabel id='sort-products-select'>Sort by...</InputLabel>
                        <Select
                            labelId='sort-products-select-label'
                            id='sort-products-select'
                            value={sortOption}
                            label='Sort by...'
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <MenuItem value={"date-added-newest"}>Date Added (Newest)</MenuItem>
                            <MenuItem value={"date-added-oldest"}>Date Added (Oldest)</MenuItem>
                            <MenuItem value={"most-popular"}>Most Popular</MenuItem>
                            <MenuItem value={"price-lowest"}>Price (Lowest)</MenuItem>
                            <MenuItem value={"price-highest"}>Price (Highest)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <section className='grid sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14 px-4 md:px-32 py-6 relative'>
                {sortedProducts()?.map((prod) => {
                    const tag = "[mod:";
                    let secondaryImageUrl = "";
                    let secondaryImagePlaceholderUrl = "";
                    let stringModIndex = prod.description.indexOf(tag);

                    if (stringModIndex !== -1) {
                        const closingBracketIndex = prod.description.slice(stringModIndex).indexOf("]");
                        let secImageInd = parseInt(
                            prod.description
                                .slice(stringModIndex + tag.length, stringModIndex + closingBracketIndex)
                                .trim()
                        );
                        if (!isNaN(secImageInd)) {
                            // Note secondary images are 1-indexed for simplicity of user's counting
                            secondaryImageUrl = prod.images[secImageInd - 1]?.url_fullxfull;
                            secondaryImagePlaceholderUrl = prod.images[secImageInd - 1]?.url_75x75;
                        }
                    }
                    return (
                        <ProductListingCard
                            key={prod.listing_id}
                            imagePrimary={prod.images[0].url_fullxfull}
                            imagePlaceholder={prod.images[0].url_75x75}
                            imageSecondary={secondaryImageUrl}
                            imageSecondaryPlaceholder={secondaryImagePlaceholderUrl}
                            productCategory={
                                typeof categories === "string"
                                    ? categories
                                    : categories.find((cat) => cat.shop_section_id === prod.shop_section_id).title
                            }
                            productName={prod.title}
                            productPrice={prod.price.amount / prod.price.divisor}
                            productPageLink={`/retail/products/${
                                prod.title.includes("|") ? formatProductTitleAsURL(prod.title) : prod.listing_id
                            }`}
                            productFavourites={prod.num_favorers}
                        />
                    );
                })}
            </section>
        </>
    );
}
