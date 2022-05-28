import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Autocomplete, TextField } from "@mui/material";
import Search from "@mui/icons-material/Search";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import formatProductTitleAsURL from "../utils/formatProductTitleAsURL";

const theme = createTheme({
    palette: {
        bluegreen: {
            main: "#14b6b8",
        },
        blueyonder: {
            main: "#526996",
        },
        cerise: {
            main: "#E72565",
        },
    },
});

export default function SiteSearch({ className = "", ...rest }) {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [autocompleteVisible, setAutocompleteVisible] = useState(false);
    const [value, setValue] = useState(null);

    const handleClearAndCloseInput = () => {
        setValue(null);
        setAutocompleteVisible(false);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const apiResponse = await fetch("/api/retail/products");
            if (apiResponse.status === 200) {
                const responseProducts = await apiResponse.json();
                setProducts(responseProducts.products);
            }
        };

        fetchProducts();

        router.events.on("routeChangeComplete", handleClearAndCloseInput);

        return () => {
            router.events.off("routeChangeComplete", handleClearAndCloseInput);
        };
    }, [router.events]);

    return (
        <div
            className={`flex items-center justify-center relative text-blueyonder-500 hover:text-bluegreen-500 transition ${className}`}
            {...rest}
        >
            <Search className='cursor-pointer' onClick={() => setAutocompleteVisible(!autocompleteVisible)} />
            <div
                className={`absolute top-full right-1/2 translate-x-1/3 pt-4 z-30 rounded-sm transition ${
                    autocompleteVisible ? "opacity-100" : "opacity-0"
                } ${autocompleteVisible ? "pointer-events-auto" : "pointer-events-none"}`}
            >
                <ThemeProvider theme={theme}>
                    <Autocomplete
                        id='site-search'
                        sx={{
                            width: 300,
                            bgcolor: "#fff",
                            borderRadius: "0.25rem",
                            "& .MuiFormLabel-root-MuiInputLabel-root.MuiFocused": { color: "red" },
                        }}
                        options={products}
                        value={value}
                        onChange={(event, newValue) => setValue(newValue)}
                        autoHighlight
                        openOnFocus
                        clearOnEscape
                        onBlur={handleClearAndCloseInput}
                        getOptionLabel={(product) => product?.title}
                        renderOption={(props, product) => (
                            <li {...props}>
                                <Link
                                    href={`/retail/products/${
                                        product.title.includes("|")
                                            ? formatProductTitleAsURL(product.title)
                                            : product.listing_id
                                    }`}
                                >
                                    <a className='flex items-center gap-4'>
                                        <div className='flex-grow flex-shrink-0 w-20 h-20 mr-4'>
                                            {product && product.images?.length > 0 && (
                                                <Image
                                                    width={75}
                                                    height={75}
                                                    src={product?.images?.[0].url_75x75}
                                                    className='w-full'
                                                    alt={`Thumbnail sized main listing image for ${product.title}`}
                                                />
                                            )}
                                        </div>
                                        <div className='flex-grow-0 line-clamp-2'>
                                            {product?.title.split("|")[0].trim()}
                                        </div>
                                    </a>
                                </Link>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Search Products'
                                color='bluegreen'
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                }}
                            />
                        )}
                    />
                </ThemeProvider>
            </div>
        </div>
    );
}
