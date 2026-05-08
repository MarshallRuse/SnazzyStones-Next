"use client";

import SearchRounded from "@mui/icons-material/SearchRounded";
import StarRateRounded from "@mui/icons-material/StarRateRounded";
import dayjs from "dayjs";
import he from "he";
import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { APIReviewsResponse } from "@/app/api/retail/products/reviews/[listing_id]/route";
import ImageLightbox from "@/components/ImageLightbox";
import type { ListingReview } from "@/types/EtsyAPITypes";

const STAR_ROW_DELAY_CHILDREN = 0.04;
const STAR_ROW_STAGGER_CHILDREN = 0.055;

const starRowContainer: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: STAR_ROW_STAGGER_CHILDREN,
			delayChildren: STAR_ROW_DELAY_CHILDREN,
		},
	},
};

const starItem: Variants = {
	hidden: {
		scale: 0,
		opacity: 0,
		x: -14,
	},
	show: {
		scale: 1,
		opacity: 1,
		x: 0,
		transition: {
			type: "spring",
			stiffness: 420,
			damping: 14,
			mass: 0.65,
		},
	},
};

/** Rough settle after the last star begins so the date reads as following the row. */
const DATE_FADE_AFTER_STAR_STAGGER_EXTRA = 0.14;

const TEXT_REVIEW_DELAY_CHILDREN = 0.3;
const TEXT_REVIEW_STAGGER_CHILDREN = 0.028;
const TEXT_REVIEW_WORD_DURATION = 0.48;

const textReviewContainer: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: TEXT_REVIEW_STAGGER_CHILDREN,
			delayChildren: TEXT_REVIEW_DELAY_CHILDREN,
		},
	},
};

const textReviewWord: Variants = {
	hidden: { opacity: 0, y: 4 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: TEXT_REVIEW_WORD_DURATION,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

/** Delay (s) from when the star row hits the viewport until the date fade begins. */
function dateFadeDelayAfterStarsEnter(rating: number): number {
	if (rating <= 0) {
		return STAR_ROW_DELAY_CHILDREN + 0.1;
	}
	return (
		STAR_ROW_DELAY_CHILDREN +
		(rating - 1) * STAR_ROW_STAGGER_CHILDREN +
		DATE_FADE_AFTER_STAR_STAGGER_EXTRA
	);
}

function animatedReviewParagraphNodes(
	decoded: string,
	reviewKey: string,
): ReactNode[] {
	const lines = decoded.split("\n");
	const nodes: ReactNode[] = [];
	let wordIndex = 0;
	let needsLeadingSpace = false;

	for (let li = 0; li < lines.length; li++) {
		const words = lines[li].split(/\s+/).filter(Boolean);
		for (let wi = 0; wi < words.length; wi++) {
			if (needsLeadingSpace) {
				nodes.push(<span key={`${reviewKey}-space-${wordIndex}`}> </span>);
			}
			needsLeadingSpace = true;
			nodes.push(
				<motion.span
					key={`${reviewKey}-word-${wordIndex}`}
					variants={textReviewWord}
					className="inline-block align-baseline"
				>
					{words[wi]}
				</motion.span>,
			);
			wordIndex += 1;
		}
		if (li < lines.length - 1) {
			nodes.push(<br key={`${reviewKey}-nl-${li}`} />);
			needsLeadingSpace = false;
		}
	}
	return nodes;
}

function AnimatedReviewEntry({ review }: { review: ListingReview }) {
	const decoded = he.decode(review.review ?? "");
	const dateFadeDelay = dateFadeDelayAfterStarsEnter(review.rating);
	const [lightboxOpen, setLightboxOpen] = useState(false);

	const { ref: starRowRef, inView: starRowInView } = useInView({
		threshold: 0.35,
		triggerOnce: true,
	});

	const { ref: textBlockRef, inView: textBlockInView } = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});

	return (
		<div className="py-4 border-b border-slate-100">
			<div className="flex items-end gap-4">
				<motion.div
					ref={starRowRef}
					className="text-bluegreen-500 inline-flex items-end"
					variants={starRowContainer}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.35 }}
				>
					{[...Array(review.rating)].map((_, i) => (
						<motion.span
							// biome-ignore lint/suspicious/noArrayIndexKey: index is stable for this use case
							key={`review-${review.created_timestamp}-star-${i}`}
							variants={starItem}
							className="inline-flex leading-none origin-center"
						>
							<StarRateRounded />
						</motion.span>
					))}
				</motion.div>
				<motion.div
					className="text-blueyonder-400"
					initial={{ opacity: 0 }}
					animate={starRowInView ? { opacity: 1 } : { opacity: 0 }}
					transition={{
						delay: dateFadeDelay,
						duration: 0.45,
						ease: [0.22, 1, 0.36, 1],
					}}
				>
					{dayjs.unix(review.created_timestamp).format("MMMM DD, YYYY")}
				</motion.div>
			</div>
			<div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
				<motion.p
					ref={textBlockRef}
					className="text-blueyonder-500 mt-4"
					variants={textReviewContainer}
					initial="hidden"
					animate={textBlockInView ? "show" : "hidden"}
				>
					{animatedReviewParagraphNodes(
						decoded,
						`review-${review.created_timestamp}`,
					)}
				</motion.p>
				{review.image_url_fullxfull && (
					<div className="rounded-md shadow-light w-fit shrink-0">
						<button
							type="button"
							className="group relative block h-[200px] w-[200px] shrink-0 overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bluegreen-500 cursor-zoom-in"
							aria-label={`View enlarged customer photo for ${review.rating} star review`}
							aria-haspopup="dialog"
							aria-expanded={lightboxOpen}
							onClick={() => setLightboxOpen(true)}
						>
							<Image
								src={review.image_url_fullxfull}
								fill
								sizes="200px"
								alt=""
								className="object-cover pointer-events-none"
								aria-hidden
							/>
							<span
								className="pointer-events-none absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-bluegreen-600 opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
								aria-hidden
							>
								<SearchRounded fontSize="small" />
							</span>
						</button>
						<ImageLightbox
							open={lightboxOpen}
							onClose={() => setLightboxOpen(false)}
							src={review.image_url_fullxfull}
							alt={`Customer photo for ${review.rating} star review`}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default function ReviewsSection({ listingId }: { listingId: string }) {
	const [reviews, setReviews] = useState<ListingReview[]>([]);

	useEffect(() => {
		const fetchReviews = async () => {
			const reviewsResponse = await fetch(
				`/api/retail/products/reviews/${listingId}`,
			);
			const reviewsData: APIReviewsResponse = await reviewsResponse.json();
			setReviews(reviewsData.reviews || []);
		};

		fetchReviews();
	}, [listingId]);

	return (
		<section className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] px-4 sm:px-6 lg:px-8 py-16 mx-auto border-t border-slate-100">
			<h2 className="text-blueyonder-500">
				Reviews{" "}
				{reviews.length > 0 ? (
					<span className="text-blueyonder-400 text-2xl inline-flex items-center">
						({reviews.length}, Average{" "}
						{(
							reviews.reduce((acc, curr) => acc + curr.rating, 0) /
							reviews.length
						).toFixed(1)}{" "}
						<StarRateRounded />)
					</span>
				) : (
					<span className="text-blueyonder-400 text-2xl inline-flex items-center">
						(0 reviews)
					</span>
				)}
			</h2>
			{reviews
				?.sort((a, b) => b.created_timestamp - a.created_timestamp)
				.map((review) => (
					<AnimatedReviewEntry
						key={`review-${review.created_timestamp}`}
						review={review}
					/>
				))}
		</section>
	);
}
