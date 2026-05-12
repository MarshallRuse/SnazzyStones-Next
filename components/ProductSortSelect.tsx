"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useCallback } from "react";

export type SortOptionValue =
	| "date-added-newest"
	| "date-added-oldest"
	| "most-popular"
	| "price-lowest"
	| "price-highest";

export type SortOption = {
	value: SortOptionValue;
	label: string;
};

/** Labels for visible sort items — keep in sync with `<MenuItem>`s below (width derives from longest label). */
const SORT_MENU_ITEMS: SortOption[] = [
	{ value: "date-added-newest", label: "Date Added (Newest)" },
	{ value: "date-added-oldest", label: "Date Added (Oldest)" },
	{ value: "most-popular", label: "Most Popular" },
];

const SORT_SELECT_MIN_WIDTH_CH =
	Math.max(...SORT_MENU_ITEMS.map((item) => item.label.length)) + 8;

const sortSelectSx = {
	minWidth: `${SORT_SELECT_MIN_WIDTH_CH}ch`,
	"& .MuiOutlinedInput-notchedOutline": {
		borderColor: "rgba(0, 0, 0, 0.23)",
	},
	"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
		borderColor: "var(--color-bluegreen-500)",
	},
	"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
		borderWidth: 2,
		borderColor: "var(--color-bluegreen-500)",
	},
	"& .MuiInputLabel-root.Mui-focused": {
		color: "var(--color-bluegreen-500)",
	},
};

const sortLabel = "Sort by...";

export const DEFAULT_SORT_OPTION = SORT_MENU_ITEMS[0];

export interface ProductSortSelectProps {
	value: SortOption;
	onChange: (option: SortOption) => void;
}

export default function ProductSortSelect({
	value,
	onChange,
}: ProductSortSelectProps) {
	const handleChange = useCallback(
		(event: SelectChangeEvent<SortOptionValue>) => {
			const next = SORT_MENU_ITEMS.find(
				(item) => item.value === event.target.value,
			);

			if (next) onChange(next);
		},
		[onChange],
	);

	return (
		<div className="opacity-100 pt-4 col-span-3">
			<FormControl sx={sortSelectSx}>
				<InputLabel id="sort-products-select-label">{sortLabel}</InputLabel>
				<Select
					labelId="sort-products-select-label"
					id="sort-products-select"
					value={value.value}
					label={sortLabel}
					onChange={handleChange}
					MenuProps={{ disableScrollLock: true }}
				>
					{SORT_MENU_ITEMS.map(({ value: optionValue, label }) => (
						<MenuItem key={optionValue} value={optionValue}>
							{label}
						</MenuItem>
					))}
					{/* <MenuItem value={"price-lowest"}>Price (Lowest)</MenuItem>
					<MenuItem value={"price-highest"}>Price (Highest)</MenuItem> */}
				</Select>
			</FormControl>
		</div>
	);
}
