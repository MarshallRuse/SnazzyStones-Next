'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Autocomplete, TextField } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import formatProductTitleAsURL from '@/utils/formatProductTitleAsURL';
import { APIProductsResponse } from '@/app/api/retail/products/route';
import { ProductMinAPIData } from '@/types/Types';

const theme = createTheme({
    palette: {
        bluegreen: {
            main: '#14b6b8',
        },
        blueyonder: {
            main: '#526996',
        },
        cerise: {
            main: '#E72565',
        },
    },
});

export interface SiteSearchProps {
    className?: string;
}

export default function SiteSearch({ className = '', ...rest }: SiteSearchProps) {
    const pathname = usePathname();
    const [products, setProducts] = useState<Partial<ProductMinAPIData>[]>([]);
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);
    const [value, setValue] = useState<Partial<ProductMinAPIData> | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClearAndCloseInput = () => {
        setValue(null);
        setAutocompleteVisible(false);
        inputRef.current?.blur();
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const apiResponse = await fetch('/api/retail/products?fields=title,listing_id,images');
            if (apiResponse.status === 200) {
                const responseProducts: APIProductsResponse = await apiResponse.json();
                setProducts(responseProducts.products);
            } else {
                throw new Error(`Error fetching products in SiteSearch: ${apiResponse.status}`);
            }
        };

        try {
            fetchProducts();
        } catch (error) {
            console.log(`Error fetching products: ${error}`);
        }
    }, []);

    useEffect(() => {
        if (autocompleteVisible) {
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur();
        }
    }, [autocompleteVisible]);

    useEffect(() => {
        handleClearAndCloseInput();
    }, [pathname]);

    return (
        <div
            className={`flex items-center justify-center relative text-blueyonder-500 hover:text-bluegreen-500 transition ${className}`}
            {...rest}
        >
            <Search
                className='cursor-pointer'
                onClick={() => setAutocompleteVisible(!autocompleteVisible)}
            />
            <div
                className={`absolute top-full right-1/2 translate-x-1/3 pt-7 z-30 rounded-sm transition ${
                    autocompleteVisible ? 'opacity-100' : 'opacity-0'
                } ${autocompleteVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                <ThemeProvider theme={theme}>
                    <Autocomplete
                        id='site-search'
                        sx={{
                            width: 300,
                            bgcolor: '#fff',
                            borderRadius: '0.25rem',
                            '& .MuiFormLabel-root-MuiInputLabel-root.MuiFocused': { color: 'red' },
                        }}
                        open={autocompleteVisible}
                        options={products}
                        loading={autocompleteVisible && products.length === 0}
                        loadingText='Loading Snazziness...'
                        value={value}
                        onChange={(_, newValue) => typeof newValue !== 'string' && setValue(newValue)}
                        openOnFocus
                        clearOnEscape
                        onBlur={handleClearAndCloseInput}
                        onClose={handleClearAndCloseInput}
                        getOptionLabel={(product) => product?.title ?? ''}
                        renderOption={(props, product) => {
                            const { key, ...rest } = props;
                            return (
                                <li
                                    key={key}
                                    {...rest}
                                >
                                    <Link
                                        href={`/retail/products/${
                                            product.title?.includes('|')
                                                ? formatProductTitleAsURL(product.title)
                                                : product.listing_id
                                        }`}
                                        className='flex items-center gap-4'
                                    >
                                        <div className='grow shrink-0 w-20 h-20 mr-4'>
                                            {product && (product.images?.length ?? 0) > 0 && (
                                                <Image
                                                    width={75}
                                                    height={75}
                                                    src={product?.images?.[0].url_75x75 ?? ''}
                                                    className='w-full'
                                                    alt={`Thumbnail sized main listing image for ${product.title}`}
                                                />
                                            )}
                                        </div>
                                        <div className='grow-0 line-clamp-2'>
                                            {product?.title?.split('|')[0].trim()}
                                        </div>
                                    </Link>
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={inputRef}
                                label='Search Products'
                                color='bluegreen'
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                            />
                        )}
                    />
                </ThemeProvider>
            </div>
        </div>
    );
}
