'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
// Nextjs 13 broke blurDataURL (need to convert to base64), so we're using the legacy image component
// https://github.com/vercel/next.js/issues/42140
import LegacyImage from 'next/legacy/image';
import { motion, AnimatePresence } from 'motion/react';
import { wrap } from 'popmotion';
import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRounded from '@mui/icons-material/ArrowBackIosRounded';
import { ListingImage } from '@/types/EtsyAPITypes';
import { ListingImageMin } from '@/types/Types';

const enterExitDistance = 250;
const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? enterExitDistance : -enterExitDistance,
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? enterExitDistance : -enterExitDistance,
            opacity: 0,
        };
    },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export interface ImageGalleryProps {
    images: ListingImage[] | ListingImageMin[];
    productTitle?: string;
}

export default function ImageGallery({ images = [], productTitle = '' }: ImageGalleryProps) {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);

    // array of thumbnail refs for scrolling to active thumbnail
    const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

    // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
    // then wrap that within 0-2 to find our image ID in the array below. By passing an
    // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
    // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
    const imageIndex = wrap(0, images.length, page);

    const paginate = (newDirection, newPage = undefined) => {
        if (!isAnimating) {
            if (newPage !== undefined && newPage < images.length && newPage >= 0) {
                setPage([newPage, newDirection]);
            } else if (page + newDirection < images.length && page + newDirection >= 0) {
                setPage([page + newDirection, newDirection]);
            }
        }
    };

    const handleThumbnailClick = (thumbIndex) => {
        let direction;
        if (thumbIndex < page) {
            direction = -1;
        } else if (thumbIndex > page) {
            direction = 1;
        }
        if (thumbIndex !== page) {
            paginate(direction, thumbIndex);
        }
    };

    useEffect(() => {
        thumbnailRefs.current?.[page]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, [page]);

    useEffect(() => {
        thumbnailRefs.current = thumbnailRefs.current.slice(0, images.length);
    }, [images]);

    // Hacky workaround for a bug introduce in framer-motion.
    // Previously AnimatePresence had the exitBeforeEnter prop, and things worked as expected -
    // init state of isAnimating would remain false and paging buttons and thumbnails would work as
    // expected on page load.  Now exitBeforeEnter is deprecated and replaced with mode='wait', and it
    // sets isAnimating to true on page load by calling onAnimationStart but not onAnimationComplete,
    // which breaks the paging buttons and thumbnails
    useEffect(() => {
        if (isAnimating && !initialAnimationComplete) {
            setIsAnimating(false);
            setInitialAnimationComplete(true);
        }
    }, [isAnimating, initialAnimationComplete]);
    console.log('images', images);

    return (
        <div>
            <div className='flex flex-col md:flex-row gap-4 max-w-sm md:max-w-(--breakpoint-lg)'>
                <div className='order-2 md:order-1 max-w-screen md:w-auto overflow-auto md:overflow-auto noScrollbar'>
                    <div className='relative flex md:flex-col gap-2 md:min-h-full md:h-0 p-2'>
                        {images?.map((img, ind) => (
                            <div
                                key={`thumbnail-${ind}`}
                                ref={(el) => {
                                    thumbnailRefs.current[ind] = el;
                                }}
                                className={`flex w-20 h-20 aspect-square md:w-auto md:h-auto shrink-0 rounded-lg cursor-pointer ${
                                    ind !== page ? 'hover:scale-105' : ''
                                } transition ${ind === page ? 'scale-105 border-2 border-bluegreen-500' : ''}`}
                                onClick={() => handleThumbnailClick(ind)}
                            >
                                <Image
                                    src={img.url_170x135}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                    className={`rounded-md aspect-square`}
                                    alt={`Product image thumbnail ${ind + 1} for ${productTitle}`}
                                    priority
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='relative order-1 md:order-2 group p-2 h-full'>
                    <AnimatePresence
                        initial={false}
                        custom={direction}
                        mode='wait'
                    >
                        <motion.div
                            key={`gallery-image-${page}`}
                            className='flex self-start justify-center items-center  rounded-xs aspect-square shadow-light'
                            custom={direction}
                            variants={variants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            drag='x'
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                            onAnimationStart={() => setIsAnimating(true)}
                            onAnimationComplete={() => setIsAnimating(false)}
                        >
                            <LegacyImage
                                src={images[imageIndex].url_fullxfull}
                                width={442}
                                height={442}
                                objectFit='cover'
                                className='rounded-md w-full h-auto aspect-square shadow-light'
                                placeholder='blur'
                                blurDataURL={images[imageIndex].url_75x75}
                                alt={`Product gallery image ${page + 1} for ${productTitle}`}
                                loading='eager'
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>
                    {page < images.length - 1 && (
                        <div
                            className='absolute top-1/2 right-3 bg-white text-bluegreen-500 opacity-50 group-hover:opacity-90 transition rounded-full w-10 h-10 flex justify-center items-center select-none cursor-pointer font-bold text-lg z-20'
                            onClick={() => paginate(1)}
                        >
                            <ArrowForwardIosRounded />
                        </div>
                    )}
                    {page > 0 && (
                        <div
                            className='absolute top-1/2 left-3 bg-white text-bluegreen-500 opacity-50 group-hover:opacity-90 transition rounded-full w-10 h-10 flex justify-center items-center select-none cursor-pointer font-bold text-lg z-20'
                            onClick={() => paginate(-1)}
                        >
                            <ArrowBackIosRounded />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
