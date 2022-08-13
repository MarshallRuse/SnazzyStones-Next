import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { styled } from "@mui/material/styles";
import { Skeleton, Tooltip, tooltipClasses } from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import useCountry from "../utils/fetching/country";

const ThemeTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#6980ad",
            color: "#fff",
            boxShadow: "8px 10px 10px 0px rgba(0, 0, 0, 0.1)",
            fontSize: 11,
        },
    })
);

export default function ProductListingCard({
    imagePrimary = "",
    imagePlaceholder = "",
    imageSecondary = "",
    imageSecondaryPlaceholder = "",
    productCategory = "",
    productName = "",
    productPrice,
    productPageLink = "",
    productFavourites = 0,
}) {
    const { countryData, isLoading, isError } = useCountry();
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0.5,
        triggerOnce: true,
    });

    return (
        <motion.div
            className='flex items-start flex-col'
            ref={ref}
            key={`listing-card-${productPageLink}`}
            variants={{
                open: {
                    y: 0,
                    opacity: 1,
                    transition: {
                        y: { stiffness: 1000, velocity: -100 },
                    },
                },
                closed: {
                    y: 50,
                    opacity: 0,
                    transition: {
                        y: { stiffness: 1000 },
                    },
                },
            }}
            initial='closed'
            animate={inView ? "open" : "closed"}
            exit={{ opacity: 0, x: -50 }}
        >
            <Link href={productPageLink}>
                <a>
                    <div className='flex relative transition cursor-pointer shadow-light rounded-md hover:shadow-bluegreenLight hover:scale-105 overflow-hidden'>
                        <Image
                            src={imagePrimary}
                            width={600}
                            height={600}
                            objectFit='cover'
                            className='rounded-md'
                            placeholder={imagePlaceholder ? "blur" : "empty"}
                            blurDataURL={imagePlaceholder}
                            alt={`Main listing image for ${productName}`}
                        />
                        {imageSecondary && (
                            <div className='absolute top-0 left-0 w-full h-full opacity-0 transition hover:opacity-100'>
                                <Image
                                    src={imageSecondary}
                                    width={600}
                                    height={600}
                                    objectFit='cover'
                                    className='rounded-md'
                                    placeholder={imageSecondaryPlaceholder ? "blur" : "empty"}
                                    blurDataURL={imageSecondaryPlaceholder}
                                    alt={`Secondary listing image for ${productName}`}
                                />
                            </div>
                        )}
                    </div>
                </a>
            </Link>

            <div className='flex items-center text-bluegreen-500 gap-3 mt-5'>
                {productFavourites > 0 && (
                    <>
                        <Favorite />
                        <span>{productFavourites} favorites!</span>
                    </>
                )}
            </div>
            <Link href={`/categories/${productCategory.replace(" ", "_")}`}>
                <a className='text-blueyonder-500 text-base opacity-60 mt-3 mb-2'>{productCategory}</a>
            </Link>
            <Link href={productPageLink}>
                <a>
                    <div className='flex justify-between items-end w-full gap-6'>
                        <ThemeTooltip title={productName}>
                            <span className='inline-block text-blueyonder-500 text-lg font-semibold'>
                                {productName.split("|")[0].trim()}
                            </span>
                        </ThemeTooltip>
                        <span className='inline-block text-bluegreen-500 text-base font-semibold'>
                            {isLoading ? (
                                <Skeleton />
                            ) : (
                                new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
                                    isError
                                        ? productPrice
                                        : countryData.countryCode === "CA"
                                        ? productPrice - 14
                                        : productPrice
                                )
                            )}
                        </span>
                    </div>
                </a>
            </Link>
        </motion.div>
    );
}
