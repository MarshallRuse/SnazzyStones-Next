"use client";

import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
// Nextjs 13 broke blurDataURL (need to convert to base64), so we're using the legacy image component
// https://github.com/vercel/next.js/issues/42140
import LegacyImage from "next/legacy/image";
import { wrap } from "popmotion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ListingImage } from "@/types/EtsyAPITypes";
import type { ListingImageMin } from "@/types/Types";

const enterExitDistance = 250;

function galleryVariants(axis: "x" | "y") {
	const primary = axis === "y" ? "y" : "x";
	const secondary = axis === "y" ? "x" : "y";
	return {
		enter: (direction: number) => ({
			[primary]: direction > 0 ? enterExitDistance : -enterExitDistance,
			[secondary]: 0,
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			y: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			[primary]: direction < 0 ? enterExitDistance : -enterExitDistance,
			[secondary]: 0,
			opacity: 0,
		}),
	};
}

const verticalTransitionConfig = {
	y: {
		type: "spring" as const,
		stiffness: 300,
		damping: 30,
	},
	opacity: { duration: 0.2 },
};

const horizontalTransitionConfig = {
	x: {
		type: "spring" as const,
		stiffness: 300,
		damping: 30,
	},
	opacity: { duration: 0.2 },
};

const getTransitionConfig = (isMdUp: boolean) => {
	return isMdUp ? verticalTransitionConfig : horizontalTransitionConfig;
};

const verticalDragConstraints = { top: 0, bottom: 0 };
const horizontalDragConstraints = { left: 0, right: 0 };

const getDragConstraints = (isMdUp: boolean) => {
	return isMdUp ? verticalDragConstraints : horizontalDragConstraints;
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
	return Math.abs(offset) * velocity;
};

const navArrowButtonClass =
	"bg-white text-bluegreen-500 opacity-50 hover:opacity-90 transition rounded-full w-10 h-10 flex justify-center items-center select-none cursor-pointer shrink-0 z-20";

export interface ImageGalleryProps {
	images: ListingImage[] | ListingImageMin[];
	productTitle?: string;
}

export default function ImageGallery({
	images = [],
	productTitle = "",
}: ImageGalleryProps) {
	const [[page, direction], setPage] = useState([0, 0]);
	const [isAnimating, setIsAnimating] = useState(false);
	const [initialAnimationComplete, setInitialAnimationComplete] =
		useState(false);

	// array of thumbnail refs for scrolling to active thumbnail
	const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
	// then wrap that within 0-2 to find our image ID in the array below. By passing an
	// absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
	// detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
	const imageIndex = wrap(0, images.length, page);

	// Match Tailwind `md` (768px). Initial false keeps SSR + first client render identical
	// so Motion's drag axis / touch-action hydrate without mismatch; sync after mount.
	const [isMdUp, setIsMdUp] = useState(false);
	useLayoutEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		const sync = () => setIsMdUp(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const variants = useMemo(() => galleryVariants(isMdUp ? "y" : "x"), [isMdUp]);

	const paginate = (newDirection: number, newPage?: number) => {
		const n = images.length;
		if (isAnimating || n <= 1) return;

		if (newPage !== undefined) {
			setPage([newPage, newDirection]);
		} else {
			const next = (page + newDirection + n) % n;
			setPage([next, newDirection]);
		}
	};

	const handleThumbnailClick = (thumbIndex: number) => {
		const n = images.length;
		if (n <= 1 || thumbIndex === page) return;

		const forward = (thumbIndex - page + n) % n;
		const backward = (page - thumbIndex + n) % n;
		const direction = forward <= backward ? 1 : -1;
		paginate(direction, thumbIndex);
	};

	const arrowsDisabled = images.length <= 1;

	const thumbnailButtons = images?.map(
		(img: ListingImageMin | ListingImage, ind: number) => (
			<button
				key={`thumbnail-${img.url_170x135}`}
				ref={(el) => {
					thumbnailRefs.current[ind] = el;
				}}
				type="button"
				className={`flex w-20 h-20 aspect-square md:w-auto md:h-auto shrink-0 rounded-lg cursor-pointer ${
					ind !== page ? "hover:scale-105" : ""
				} transition ${ind === page ? "scale-105 border-2 border-bluegreen-500" : ""}`}
				onClick={() => handleThumbnailClick(ind)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleThumbnailClick(ind);
					}
				}}
				aria-label={`Show thumbnail ${ind + 1}`}
			>
				<Image
					src={img.url_170x135}
					width={100}
					height={100}
					style={{ objectFit: "cover" }}
					className={`rounded-md aspect-square`}
					alt={`Product image thumbnail ${ind + 1} for ${productTitle}`}
					priority
				/>
			</button>
		),
	);

	useEffect(() => {
		thumbnailRefs.current?.[page]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "nearest",
		});
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

	return (
		<div>
			<div className="flex flex-col md:flex-row gap-4 w-full">
				<div className="order-2 md:order-1 flex flex-row md:flex-col items-center gap-2 w-full md:w-24 shrink-0 min-w-0">
					<button
						type="button"
						className={`flex md:hidden shrink-0 ${navArrowButtonClass} disabled:opacity-30 disabled:pointer-events-none disabled:hover:opacity-30`}
						disabled={arrowsDisabled}
						onClick={() => paginate(-1)}
						aria-label="Show previous product image"
					>
						<KeyboardArrowUpRounded
							className="-rotate-90"
							fontSize="small"
							aria-hidden
						/>
					</button>
					<button
						type="button"
						className={`hidden md:flex shrink-0 ${navArrowButtonClass} disabled:opacity-30 disabled:pointer-events-none disabled:hover:opacity-30`}
						disabled={arrowsDisabled}
						onClick={() => paginate(-1)}
						aria-label="Show previous product image"
					>
						<KeyboardArrowUpRounded fontSize="small" aria-hidden />
					</button>
					<div className="flex-1 min-w-0 md:flex-none max-w-screen md:w-24 shrink-0 md:shrink-0 overflow-x-auto md:overflow-y-auto md:overflow-x-visible noScrollbar md:max-h-[min(70vh,520px)]">
						<div className="relative flex flex-row md:flex-col gap-2 p-2 md:min-h-0">
							{thumbnailButtons}
						</div>
					</div>
					<button
						type="button"
						className={`flex md:hidden shrink-0 ${navArrowButtonClass} disabled:opacity-30 disabled:pointer-events-none disabled:hover:opacity-30`}
						disabled={arrowsDisabled}
						onClick={() => paginate(1)}
						aria-label="Show next product image"
					>
						<KeyboardArrowUpRounded
							className="rotate-90"
							fontSize="small"
							aria-hidden
						/>
					</button>
					<button
						type="button"
						className={`hidden md:flex shrink-0 ${navArrowButtonClass} disabled:opacity-30 disabled:pointer-events-none disabled:hover:opacity-30`}
						disabled={arrowsDisabled}
						onClick={() => paginate(1)}
						aria-label="Show next product image"
					>
						<KeyboardArrowUpRounded
							className="rotate-180"
							fontSize="small"
							aria-hidden
						/>
					</button>
				</div>
				<div className="relative order-1 md:order-2 p-2 h-full flex-1 min-w-0">
					<AnimatePresence initial={false} custom={direction} mode="wait">
						<motion.div
							key={`gallery-image-${page}`}
							className="self-start rounded-xs aspect-square shadow-light w-full overflow-hidden"
							custom={direction}
							variants={variants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={getTransitionConfig(isMdUp)}
							drag={isMdUp ? "y" : "x"}
							dragConstraints={getDragConstraints(isMdUp)}
							dragElastic={1}
							onDragEnd={(_e, { offset, velocity }) => {
								const swipe = isMdUp
									? swipePower(offset.y, velocity.y)
									: swipePower(offset.x, velocity.x);

								if (swipe < -swipeConfidenceThreshold) {
									paginate(1);
								} else if (swipe > swipeConfidenceThreshold) {
									paginate(-1);
								}
							}}
							onAnimationStart={() => setIsAnimating(true)}
							onAnimationComplete={() => setIsAnimating(false)}
						>
							<div className="w-full">
								<LegacyImage
									src={images[imageIndex].url_fullxfull}
									width={442}
									height={442}
									layout="responsive"
									objectFit="cover"
									className="rounded-md w-full h-auto aspect-square shadow-light"
									placeholder="blur"
									blurDataURL={images[imageIndex].url_75x75}
									alt={`Product gallery image ${page + 1} for ${productTitle}`}
									loading="eager"
									priority
								/>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
