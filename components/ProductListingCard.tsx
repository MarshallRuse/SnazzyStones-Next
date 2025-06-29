'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { styled } from '@mui/material/styles';
import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
// import useCountry from '@/utils/fetching/country';

type ThemeTooltipProps = TooltipProps & {
    className?: string;
};

const ThemeTooltip = styled(({ className, ...props }: ThemeTooltipProps) => (
    <Tooltip
        {...props}
        classes={{ popper: className }}
    />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#6980ad',
        color: '#fff',
        boxShadow: '8px 10px 10px 0px rgba(0, 0, 0, 0.1)',
        fontSize: 11,
    },
}));

export interface ProductListingCardProps {
    imagePrimary?: string;
    imagePlaceholder?: string;
    imageSecondary?: string;
    imageSecondaryPlaceholder?: string;
    productCategory?: string;
    productName?: string;
    productPrice?: number;
    productPageLink?: string;
    productFavourites?: number;
    index?: number;
    disableAnimation?: boolean;
}

export default function ProductListingCard({
    imagePrimary = '',
    imagePlaceholder = '',
    imageSecondary = '',
    imageSecondaryPlaceholder = '',
    productCategory = '',
    productName = '',
    productPrice,
    productPageLink = '',
    productFavourites = 0,
    index = 0,
    disableAnimation = false,
}: ProductListingCardProps) {
    // const { countryData, isLoading, isError } = useCountry();

    // Item variants for staggered animation
    // These will be controlled by the parent container
    const itemVariants = {
        hidden: {
            y: 50,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                y: { type: 'spring', stiffness: 200, velocity: 10, mass: 0.5 },
                opacity: { duration: 0.3 },
            },
        },
    };

    // Content to render
    const content = (
        <>
            <Link
                href={productPageLink}
                prefetch={false}
            >
                <div className='flex relative transition cursor-pointer shadow-light rounded-md hover:shadow-bluegreenLight hover:scale-105 overflow-hidden'>
                    <Image
                        src={imagePrimary}
                        width={600}
                        height={600}
                        style={{ objectFit: 'cover' }}
                        className='rounded-md'
                        placeholder={imagePlaceholder ? 'blur' : 'empty'}
                        blurDataURL={imagePlaceholder}
                        alt={`Main listing image for ${productName}`}
                    />
                    {imageSecondary && (
                        <div className='absolute top-0 left-0 w-full h-full opacity-0 transition hover:opacity-100'>
                            <Image
                                src={imageSecondary}
                                width={600}
                                height={600}
                                style={{ objectFit: 'cover' }}
                                className='rounded-md'
                                placeholder={imageSecondaryPlaceholder ? 'blur' : 'empty'}
                                blurDataURL={imageSecondaryPlaceholder}
                                alt={`Secondary listing image for ${productName}`}
                            />
                        </div>
                    )}
                </div>
            </Link>

            <div className='flex items-center text-bluegreen-500 gap-3 mt-5'>
                {productFavourites > 0 && (
                    <>
                        <Favorite />
                        <span>{productFavourites} favorites!</span>
                    </>
                )}
            </div>
            <Link
                href={`/categories/${productCategory.replace(' ', '_')}`}
                className='text-blueyonder-500 text-base opacity-60 mt-3 mb-2'
            >
                {productCategory}
            </Link>
            <Link href={productPageLink}>
                <div className='flex justify-between items-end w-full gap-6'>
                    <ThemeTooltip title={productName}>
                        <span className='inline-block text-blueyonder-500 text-lg font-semibold'>
                            {productName.split('|')[0].trim()}
                        </span>
                    </ThemeTooltip>
                    {/* <span className='inline-block text-bluegreen-500 text-base font-semibold'>
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
                        </span> */}
                </div>
            </Link>
        </>
    );

    // Return different wrappers based on animation state
    return disableAnimation ? (
        // Regular div for server-side rendering to prevent hydration mismatch
        <div className='flex items-start flex-col'>{content}</div>
    ) : (
        // Motion div for client-side animation
        <motion.div
            className='flex items-start flex-col'
            key={`listing-card-${productPageLink}`}
            variants={itemVariants}
        >
            {content}
        </motion.div>
    );
}
