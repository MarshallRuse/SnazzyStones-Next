'use client';

import { useState, useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import ProductListingCard from './ProductListingCard';
import formatProductTitleAsURL from '@/utils/formatProductTitleAsURL';
import { ShopListingCondensed } from '@/types/EtsyAPITypes';
import { CategoriesMinAPIData } from '@/types/Types';
import { motion } from 'motion/react';

export interface ProductListProps {
    products: ShopListingCondensed[];
    categories: string | CategoriesMinAPIData[] | null;
}

export default function ProductList({ products = [], categories = [] }: ProductListProps) {
    const [sortOption, setSortOption] = useState('date-added-newest');
    // Default to mobile column count for server-side rendering to avoid hydration mismatch
    const [columnCount, setColumnCount] = useState(1);
    const [isMounted, setIsMounted] = useState(false);

    // Update column count on client-side only after component mounts
    useEffect(() => {
        setIsMounted(true);

        const getColumnCount = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                // lg breakpoint
                return 4; // lg:grid-cols-4
            } else if (width >= 640) {
                // sm breakpoint
                return 3; // sm:grid-cols-3
            }
            return 1; // Default for mobile
        };

        const handleResize = () => {
            setColumnCount(getColumnCount());
        };

        // Set initial column count
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sortedProducts = () => {
        switch (sortOption) {
            case 'date-added-newest':
                return products?.sort(
                    (prodA, prodB) => prodB.original_creation_timestamp - prodA.original_creation_timestamp
                );
            case 'date-added-oldest':
                return products?.sort(
                    (prodA, prodB) => prodA.original_creation_timestamp - prodB.original_creation_timestamp
                );
            case 'most-popular':
                return products?.sort((prodA, prodB) => prodB.num_favorers - prodA.num_favorers);
            case 'price-lowest':
                return products?.sort((prodA, prodB) =>
                    prodA.price && prodB.price
                        ? prodA.price.amount / prodA.price.divisor - prodB.price.amount / prodB.price.divisor
                        : 0
                );
            case 'price-highest':
                return products?.sort((prodA, prodB) =>
                    prodB.price && prodA.price
                        ? prodB.price.amount / prodB.price.divisor - prodA.price.amount / prodA.price.divisor
                        : 0
                );
            default:
                return products;
        }
    };

    // Container variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    // NOTE: Nested grid cols is weird and redundant, but stops the framer-motion related bug of the Sort input
    // going transparent and fading up as the header image fades out.  NO idea why this works, was trial and error
    return (
        <section className='bg-white grid sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14 px-4 md:px-32 py-6 relative'>
            <div className='opacity-100 pt-4 col-span-3'>
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
                            <MenuItem value={'date-added-newest'}>Date Added (Newest)</MenuItem>
                            <MenuItem value={'date-added-oldest'}>Date Added (Oldest)</MenuItem>
                            <MenuItem value={'most-popular'}>Most Popular</MenuItem>
                            {/* <MenuItem value={"price-lowest"}>Price (Lowest)</MenuItem>
                            <MenuItem value={"price-highest"}>Price (Highest)</MenuItem> */}
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div className='col-span-3 lg:col-span-4 relative'>
                {/* Only render row-based layout after component mounts on client-side */}
                {isMounted ? (
                    // Create a row container for each row of products
                    Array.from({ length: Math.ceil(sortedProducts().length / columnCount) }).map((_, rowIndex) => {
                        // Get products for this row
                        const rowProducts = sortedProducts().slice(
                            rowIndex * columnCount,
                            (rowIndex + 1) * columnCount
                        );

                        return (
                            <motion.div
                                key={`row-${rowIndex}`}
                                className='grid sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14 py-2'
                                variants={containerVariants}
                                initial='hidden'
                                whileInView='visible'
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                {rowProducts.map((prod, colIndex) => {
                                    const tag = '[mod:';
                                    let secondaryImageUrl = '';
                                    let secondaryImagePlaceholderUrl = '';
                                    let stringModIndex = prod.description.indexOf(tag);

                                    if (stringModIndex !== -1) {
                                        const closingBracketIndex = prod.description.slice(stringModIndex).indexOf(']');
                                        let secImageInd = parseInt(
                                            prod.description
                                                .slice(
                                                    stringModIndex + tag.length,
                                                    stringModIndex + closingBracketIndex
                                                )
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
                                                typeof categories === 'string'
                                                    ? categories
                                                    : categories?.find(
                                                          (cat) => cat.shop_section_id === prod.shop_section_id
                                                      )?.title ?? ''
                                            }
                                            productName={prod.title}
                                            //productPrice={prod.price.amount / prod.price.divisor}
                                            productPageLink={`/retail/products/${
                                                prod.title.includes('|')
                                                    ? formatProductTitleAsURL(prod.title)
                                                    : prod.listing_id
                                            }`}
                                            productFavourites={prod.num_favorers}
                                            index={colIndex}
                                        />
                                    );
                                })}
                            </motion.div>
                        );
                    })
                ) : (
                    // Simple grid display during server-side rendering to prevent hydration errors
                    <div className='grid sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14 py-2'>
                        {sortedProducts().map((prod) => {
                            const tag = '[mod:';
                            let secondaryImageUrl = '';
                            let secondaryImagePlaceholderUrl = '';
                            let stringModIndex = prod.description.indexOf(tag);

                            if (stringModIndex !== -1) {
                                const closingBracketIndex = prod.description.slice(stringModIndex).indexOf(']');
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
                                        typeof categories === 'string'
                                            ? categories
                                            : categories?.find((cat) => cat.shop_section_id === prod.shop_section_id)
                                                  ?.title ?? ''
                                    }
                                    productName={prod.title}
                                    //productPrice={prod.price.amount / prod.price.divisor}
                                    productPageLink={`/retail/products/${
                                        prod.title.includes('|') ? formatProductTitleAsURL(prod.title) : prod.listing_id
                                    }`}
                                    productFavourites={prod.num_favorers}
                                    disableAnimation={true}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
