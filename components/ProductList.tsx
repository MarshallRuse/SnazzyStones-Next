"use client";

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ShopListingCondensed } from "@/types/EtsyAPITypes";
import type { CategoriesMinAPIData, ProductMinAPIData } from "@/types/Types";
import formatProductTitleAsURL from "@/utils/formatProductTitleAsURL";
import ProductListingCard from "./ProductListingCard";

export interface ProductListProps {
	backgroundColor?: boolean;
	categories: string | CategoriesMinAPIData[] | null;
	products: (ShopListingCondensed | ProductMinAPIData)[];
	sortable?: boolean;
}

export default function ProductList({
	products = [],
	categories = [],
	backgroundColor = true,
	sortable = true,
}: ProductListProps) {
	const [sortOption, setSortOption] = useState("date-added-newest");
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

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const sortedProducts = () => {
		const list = products?.length ? [...products] : [];
		switch (sortOption) {
			case "date-added-newest":
				return list.sort(
					(prodA, prodB) =>
						prodB.original_creation_timestamp -
						prodA.original_creation_timestamp,
				);
			case "date-added-oldest":
				return list.sort(
					(prodA, prodB) =>
						prodA.original_creation_timestamp -
						prodB.original_creation_timestamp,
				);
			case "most-popular":
				return list.sort(
					(prodA, prodB) => prodB.num_favorers - prodA.num_favorers,
				);
			case "price-lowest":
				return list.sort((prodA, prodB) =>
					prodA.price && prodB.price
						? prodA.price.amount / prodA.price.divisor -
							prodB.price.amount / prodB.price.divisor
						: 0,
				);
			case "price-highest":
				return list.sort((prodA, prodB) =>
					prodB.price && prodA.price
						? prodB.price.amount / prodB.price.divisor -
							prodA.price.amount / prodA.price.divisor
						: 0,
				);
			default:
				return list;
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
		<section
			className={`${
				backgroundColor ? "bg-white" : ""
			} grid sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14 px-4 md:px-32 py-6 relative`}
		>
			{sortable && (
				<div className="opacity-100 pt-4 col-span-3">
					<Box sx={{ minWidth: 120 }}>
						<FormControl>
							<InputLabel id="sort-products-select">Sort by...</InputLabel>
							<Select
								labelId="sort-products-select-label"
								id="sort-products-select"
								value={sortOption}
								label="Sort by..."
								onChange={(e) => setSortOption(e.target.value)}
							>
								<MenuItem value={"date-added-newest"}>
									Date Added (Newest)
								</MenuItem>
								<MenuItem value={"date-added-oldest"}>
									Date Added (Oldest)
								</MenuItem>
								<MenuItem value={"most-popular"}>Most Popular</MenuItem>
								{/* <MenuItem value={"price-lowest"}>Price (Lowest)</MenuItem>
                            <MenuItem value={"price-highest"}>Price (Highest)</MenuItem> */}
							</Select>
						</FormControl>
					</Box>
				</div>
			)}
			<div className="col-span-3 lg:col-span-4 relative">
				{/* Only render row-based layout after component mounts on client-side */}
				{isMounted ? (
					// Create a row container for each row of products
					Array.from({
						length: Math.ceil(sortedProducts().length / columnCount),
					}).map((_, rowIndex) => {
						// Get products for this row
						const rowProducts = sortedProducts().slice(
							rowIndex * columnCount,
							(rowIndex + 1) * columnCount,
						);

						const rowKey = rowProducts.map((prod) => prod.listing_id).join("-");

						return (
							<motion.div
								// Include sortOption so rows remount on re-sort; otherwise new cards can stay at
								// variant "hidden" (opacity 0) because the parent row already finished whileInView.
								key={rowKey}
								className="grid sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14 py-2"
								variants={containerVariants}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.3 }}
							>
								{rowProducts.map((prod, colIndex) => {
									const tag = "[mod:";
									let secondaryImageUrl = "";
									let secondaryImagePlaceholderUrl = "";
									const stringModIndex = prod.description.indexOf(tag);

									if (stringModIndex !== -1) {
										const closingBracketIndex = prod.description
											.slice(stringModIndex)
											.indexOf("]");
										const secImageInd = parseInt(
											prod.description
												.slice(
													stringModIndex + tag.length,
													stringModIndex + closingBracketIndex,
												)
												.trim(),
											10,
										);
										if (!Number.isNaN(secImageInd)) {
											// Note secondary images are 1-indexed for simplicity of user's counting
											secondaryImageUrl =
												prod.images[secImageInd - 1]?.url_fullxfull;
											secondaryImagePlaceholderUrl =
												prod.images[secImageInd - 1]?.blurDataURL ?? "";
										}
									}

									return (
										<ProductListingCard
											key={prod.listing_id}
											imagePrimary={prod.images[0].url_fullxfull}
											imagePlaceholder={prod.images[0].blurDataURL}
											imageSecondary={secondaryImageUrl}
											imageSecondaryPlaceholder={secondaryImagePlaceholderUrl}
											productCategory={
												typeof categories === "string"
													? categories
													: (categories?.find(
															(cat) =>
																cat.shop_section_id === prod.shop_section_id,
														)?.title ?? "")
											}
											productName={prod.title}
											//productPrice={prod.price.amount / prod.price.divisor}
											productPageLink={`/retail/products/${
												prod.title.includes("|")
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
					<div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14 py-2">
						{sortedProducts().map((prod) => {
							const tag = "[mod:";
							let secondaryImageUrl = "";
							let secondaryImagePlaceholderUrl = "";
							const stringModIndex = prod.description.indexOf(tag);

							if (stringModIndex !== -1) {
								const closingBracketIndex = prod.description
									.slice(stringModIndex)
									.indexOf("]");
								const secImageInd = parseInt(
									prod.description
										.slice(
											stringModIndex + tag.length,
											stringModIndex + closingBracketIndex,
										)
										.trim(),
									10,
								);
								if (!Number.isNaN(secImageInd)) {
									// Note secondary images are 1-indexed for simplicity of user's counting
									secondaryImageUrl =
										prod.images[secImageInd - 1]?.url_fullxfull;
									secondaryImagePlaceholderUrl =
										prod.images[secImageInd - 1]?.blurDataURL ?? "";
								}
							}

							return (
								<ProductListingCard
									key={prod.listing_id}
									imagePrimary={prod.images[0].url_fullxfull}
									imagePlaceholder={prod.images[0].blurDataURL}
									imageSecondary={secondaryImageUrl}
									imageSecondaryPlaceholder={secondaryImagePlaceholderUrl}
									productCategory={
										typeof categories === "string"
											? categories
											: (categories?.find(
													(cat) => cat.shop_section_id === prod.shop_section_id,
												)?.title ?? "")
									}
									productName={prod.title}
									//productPrice={prod.price.amount / prod.price.divisor}
									productPageLink={`/retail/products/${
										prod.title.includes("|")
											? formatProductTitleAsURL(prod.title)
											: prod.listing_id
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
