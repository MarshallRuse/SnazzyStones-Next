import { useState } from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import ProductListingCard from "./ProductListingCard";

export default function ProductList({ products, categories }) {
    const [sortOption, setSortOption] = useState("date-added-newest");

    const sortedProducts = () => {
        switch (sortOption) {
            case "date-added-newest":
                return products.sort(
                    (prodA, prodB) =>
                        parseInt(prodB.original_creation_timestamp) - parseInt(prodA.original_creation_timestamp)
                );
            case "date-added-oldest":
                return products.sort(
                    (prodA, prodB) =>
                        parseInt(prodA.original_creation_timestamp) - parseInt(prodB.original_creation_timestamp)
                );
            case "most-popular":
                return products.sort((prodA, prodB) => parseInt(prodB.num_favorers) - parseInt(prodA.num_favorers));
            case "price-lowest":
                return products.sort(
                    (prodA, prodB) =>
                        parseFloat(prodA.price.amount / prodA.price.divisor) -
                        parseFloat(prodB.price.amount / prodB.price.divisor)
                );
            case "price-highest":
                return products.sort(
                    (prodA, prodB) =>
                        parseFloat(prodB.price.amount / prodB.price.divisor) -
                        parseFloat(prodA.price.amount / prodA.price.divisor)
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
                {sortedProducts()?.map((prod) => (
                    <ProductListingCard
                        key={prod.listing_id}
                        imagePrimary={prod.images[0].url_fullxfull}
                        imagePlaceholder={prod.images[0].url_75x75}
                        productCategory={
                            typeof categories === "string"
                                ? categories
                                : categories.find((cat) => cat.shop_section_id === prod.shop_section_id).title
                        }
                        productName={prod.title}
                        productPrice={prod.price.amount / prod.price.divisor}
                        productPageLink={`/retail/products/${prod.listing_id}`}
                        productFavourites={prod.num_favorers}
                    />
                ))}
            </section>
        </>
    );
}
