"use client";

import CloseRounded from "@mui/icons-material/CloseRounded";
import KeyboardArrowLeftRounded from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ImageLightboxSlide = {
	src: string;
	alt: string;
	blurDataURL?: string;
};

export interface ImageLightboxProps {
	open: boolean;
	onClose: () => void;
	/** Single-image usage; ignored when `slides` is non-empty */
	src?: string;
	alt?: string;
	blurDataURL?: string;
	/** When length > 1, prev/next controls are shown */
	slides?: ImageLightboxSlide[];
	/** Controlled index (pair with `onActiveIndexChange` for multi-slide) */
	activeIndex?: number;
	onActiveIndexChange?: (index: number) => void;
}

const LOUPE_SIZE = 336;
const MAGNIFICATION = 2.35;
const DISMISS_MOVE_THRESHOLD_PX = 14;
const DISMISS_MOVE_THRESHOLD_SQ =
	DISMISS_MOVE_THRESHOLD_PX * DISMISS_MOVE_THRESHOLD_PX;
/** Viewport padding when clamping the loupe position */
const LOUPE_VIEWPORT_PAD = 12;

const navButtonClass =
	"z-[45] flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-bluegreen-500 opacity-90 shadow-md transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bluegreen-500";

function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}

export default function ImageLightbox({
	open,
	onClose,
	src,
	alt = "",
	blurDataURL,
	slides: slidesProp,
	activeIndex: activeIndexProp,
	onActiveIndexChange,
}: ImageLightboxProps) {
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const dismissPointerRef = useRef<{
		id: number;
		x: number;
		y: number;
		moved: boolean;
	} | null>(null);

	const resolvedSlides = useMemo((): ImageLightboxSlide[] => {
		if (slidesProp?.length) return slidesProp;
		if (src)
			return [{ src, alt: alt ?? "", ...(blurDataURL ? { blurDataURL } : {}) }];
		return [];
	}, [slidesProp, src, alt, blurDataURL]);

	const slideCount = resolvedSlides.length;
	const controlled =
		activeIndexProp !== undefined && onActiveIndexChange !== undefined;
	const [internalIndex, setInternalIndex] = useState(0);
	const [imageLoaded, setImageLoaded] = useState(false);

	const prevOpenRef = useRef(open);
	useEffect(() => {
		if (open && !prevOpenRef.current && !controlled && slideCount > 1) {
			setInternalIndex(0);
		}
		prevOpenRef.current = open;
	}, [open, controlled, slideCount]);

	const rawIndex =
		controlled && activeIndexProp !== undefined
			? activeIndexProp
			: internalIndex;
	const activeIndex = clamp(rawIndex, 0, Math.max(0, slideCount - 1));
	const activeSlide = resolvedSlides[activeIndex] ?? resolvedSlides[0];

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset when the visible image URL changes (body does not read `src` but must re-run on it).
	useEffect(() => {
		setImageLoaded(false);
	}, [activeSlide?.src]);

	const setIndex = useCallback(
		(next: number) => {
			const n = slideCount;
			if (n <= 0) return;
			const clamped = clamp(next, 0, n - 1);
			if (controlled) onActiveIndexChange?.(clamped);
			else setInternalIndex(clamped);
		},
		[controlled, onActiveIndexChange, slideCount],
	);

	const goPrev = useCallback(() => {
		if (slideCount <= 1) return;
		setIndex((activeIndex - 1 + slideCount) % slideCount);
	}, [activeIndex, setIndex, slideCount]);

	const goNext = useCallback(() => {
		if (slideCount <= 1) return;
		setIndex((activeIndex + 1) % slideCount);
	}, [activeIndex, setIndex, slideCount]);

	useEffect(() => {
		if (!open || slideCount <= 1) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				goPrev();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				goNext();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, slideCount, goPrev, goNext]);

	const [loupe, setLoupe] = useState<{
		left: number;
		top: number;
		bgW: number;
		bgH: number;
		bgX: number;
		bgY: number;
	} | null>(null);

	const hideLoupe = useCallback(() => setLoupe(null), []);

	const updateLoupeAtClientPoint = useCallback(
		(clientX: number, clientY: number) => {
			const wrap = imageContainerRef.current;
			const img = wrap?.querySelector("img");
			if (!wrap || !img || img.naturalWidth === 0) return;

			const rect = img.getBoundingClientRect();
			if (rect.width < 2 || rect.height < 2) return;

			const over =
				clientX >= rect.left &&
				clientX <= rect.right &&
				clientY >= rect.top &&
				clientY <= rect.bottom;

			if (!over) {
				hideLoupe();
				return;
			}

			const mx = clamp(clientX - rect.left, 0, rect.width);
			const my = clamp(clientY - rect.top, 0, rect.height);

			const bgW = rect.width * MAGNIFICATION;
			const bgH = rect.height * MAGNIFICATION;
			const bgX = LOUPE_SIZE / 2 - mx * MAGNIFICATION;
			const bgY = LOUPE_SIZE / 2 - my * MAGNIFICATION;

			const half = LOUPE_SIZE / 2;
			let left = clientX - half;
			let top = clientY - half;

			const maxLeft = window.innerWidth - LOUPE_SIZE - LOUPE_VIEWPORT_PAD;
			const maxTop = window.innerHeight - LOUPE_SIZE - LOUPE_VIEWPORT_PAD;
			left = clamp(left, LOUPE_VIEWPORT_PAD, maxLeft);
			top = clamp(top, LOUPE_VIEWPORT_PAD, maxTop);

			setLoupe({ left, top, bgW, bgH, bgX, bgY });
		},
		[hideLoupe],
	);

	const onRootPointerDown = useCallback((e: React.PointerEvent) => {
		dismissPointerRef.current = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			moved: false,
		};
	}, []);

	const onRootPointerMove = useCallback(
		(e: React.PointerEvent) => {
			const d = dismissPointerRef.current;
			if (d && e.pointerId === d.id) {
				const dx = e.clientX - d.x;
				const dy = e.clientY - d.y;
				if (dx * dx + dy * dy > DISMISS_MOVE_THRESHOLD_SQ) {
					d.moved = true;
				}
			}

			if (e.pointerType === "touch") {
				updateLoupeAtClientPoint(e.clientX, e.clientY);
			}
		},
		[updateLoupeAtClientPoint],
	);

	const onRootPointerUp = useCallback(
		(e: React.PointerEvent) => {
			const d = dismissPointerRef.current;
			if (!d || e.pointerId !== d.id) return;
			dismissPointerRef.current = null;
			if (!d.moved) {
				onClose();
			}
		},
		[onClose],
	);

	useEffect(() => {
		if (!open) return;

		const onWinMouseMove = (e: MouseEvent) => {
			updateLoupeAtClientPoint(e.clientX, e.clientY);
		};

		window.addEventListener("mousemove", onWinMouseMove);
		return () => window.removeEventListener("mousemove", onWinMouseMove);
	}, [open, updateLoupeAtClientPoint]);

	useEffect(() => {
		if (!open) {
			hideLoupe();
			dismissPointerRef.current = null;
		}
	}, [open, hideLoupe]);

	const showNav = slideCount > 1;
	/** Next's built-in blur uses an SVG that stretches with `preserveAspectRatio: none` when dimensions exist, which smears against `object-fit: contain`. We draw our own layer with `background-size: contain` instead. */
	const hasCustomBlur = Boolean(activeSlide.blurDataURL);
	const showCustomBlurPlaceholder = hasCustomBlur && !imageLoaded;
	const showImageSkeleton = !hasCustomBlur && !imageLoaded;
	const stopNavPropagation = (e: React.SyntheticEvent) => {
		e.stopPropagation();
	};

	const sideNavVisibility =
		"hidden md:flex max-md:[@media(min-aspect-ratio:1/1)]:flex";

	const navPrev = showNav ? (
		<button
			type="button"
			key="nav-prev"
			onPointerDown={stopNavPropagation}
			onPointerUp={stopNavPropagation}
			onClick={(e) => {
				e.stopPropagation();
				goPrev();
			}}
			className={`${navButtonClass} ${sideNavVisibility} absolute top-1/2 left-8 -translate-y-1/2 sm:left-10 md:left-12`}
			aria-label="Previous image"
		>
			<KeyboardArrowLeftRounded fontSize="medium" aria-hidden />
		</button>
	) : null;

	const navNext = showNav ? (
		<button
			type="button"
			key="nav-next"
			onPointerDown={stopNavPropagation}
			onPointerUp={stopNavPropagation}
			onClick={(e) => {
				e.stopPropagation();
				goNext();
			}}
			className={`${navButtonClass} ${sideNavVisibility} absolute top-1/2 right-8 -translate-y-1/2 sm:right-10 md:right-12`}
			aria-label="Next image"
		>
			<KeyboardArrowRightRounded fontSize="medium" aria-hidden />
		</button>
	) : null;

	const navRowPortrait = showNav ? (
		<div className="mt-2 flex w-full max-w-md shrink-0 flex-row items-center justify-center gap-6 px-8 md:hidden [@media(min-aspect-ratio:1/1)]:hidden">
			<button
				type="button"
				onPointerDown={stopNavPropagation}
				onPointerUp={stopNavPropagation}
				onClick={(e) => {
					e.stopPropagation();
					goPrev();
				}}
				className={navButtonClass}
				aria-label="Previous image"
			>
				<KeyboardArrowLeftRounded fontSize="medium" aria-hidden />
			</button>
			<button
				type="button"
				onPointerDown={stopNavPropagation}
				onPointerUp={stopNavPropagation}
				onClick={(e) => {
					e.stopPropagation();
					goNext();
				}}
				className={navButtonClass}
				aria-label="Next image"
			>
				<KeyboardArrowRightRounded fontSize="medium" aria-hidden />
			</button>
		</div>
	) : null;

	if (!activeSlide) return null;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullScreen
			slotProps={{
				paper: {
					sx: {
						backgroundColor: "transparent",
						boxShadow: "none",
						overflow: "hidden",
					},
				},
				backdrop: {
					sx: {
						backdropFilter: "blur(12px)",
						WebkitBackdropFilter: "blur(12px)",
						backgroundColor: "rgba(0, 0, 0, 0.55)",
					},
				},
			}}
		>
			<div
				className={`relative flex h-full w-full touch-manipulation items-center justify-center p-4 md:p-8 ${loupe ? "cursor-none" : "cursor-zoom-out"}`}
				onPointerDown={onRootPointerDown}
				onPointerMove={onRootPointerMove}
				onPointerUp={onRootPointerUp}
				onPointerCancel={onRootPointerUp}
			>
				<DialogTitle
					component="h2"
					sx={{
						position: "absolute",
						width: "1px",
						height: "1px",
						padding: 0,
						margin: "-1px",
						overflow: "hidden",
						clip: "rect(0, 0, 0, 0)",
						whiteSpace: "nowrap",
						border: 0,
					}}
				>
					{activeSlide.alt}
				</DialogTitle>
				<button
					type="button"
					onPointerDown={(e) => e.stopPropagation()}
					onPointerUp={(e) => e.stopPropagation()}
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}
					className="absolute top-4 right-4 z-[45] flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-bluegreen-500 opacity-90 shadow-md transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bluegreen-500"
					aria-label="Close enlarged image"
				>
					<CloseRounded fontSize="medium" aria-hidden />
				</button>
				{navPrev}
				{navNext}
				<div className="relative z-[5] flex w-full max-w-full flex-col items-center md:block md:h-[min(85vh,920px)] md:w-[min(92vw,920px)]">
					<div
						ref={imageContainerRef}
						className={`relative z-[5] h-[min(85vh,920px)] w-[min(92vw,920px)] max-w-full touch-none max-md:[@media(max-aspect-ratio:1/1)]:max-h-[min(calc(85vh-5.5rem),920px)] ${loupe ? "cursor-none" : "cursor-zoom-in"}`}
					>
						{showCustomBlurPlaceholder ? (
							<div
								className="pointer-events-none absolute inset-0 z-[1] rounded-lg bg-no-repeat"
								style={{
									backgroundImage: `url(${activeSlide.blurDataURL})`,
									backgroundPosition: "50% 50%",
									backgroundSize: "contain",
								}}
								aria-hidden
							/>
						) : null}
						{showImageSkeleton ? (
							<Skeleton
								variant="rounded"
								animation="pulse"
								className="pointer-events-none z-[1] rounded-lg"
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									width: "100%",
									height: "100%",
									borderRadius: 1,
									bgcolor: "rgba(255, 255, 255, 0.14)",
								}}
								aria-hidden
							/>
						) : null}
						<Image
							key={activeSlide.src}
							src={activeSlide.src}
							alt={activeSlide.alt}
							fill
							sizes="min(92vw, 920px)"
							style={{ objectFit: "contain" }}
							className="relative z-[2] rounded-lg select-none"
							placeholder="empty"
							preload={open}
							onLoad={() => setImageLoaded(true)}
							onError={() => setImageLoaded(true)}
						/>
					</div>
					{navRowPortrait}
				</div>
				{loupe ? (
					<div
						className="pointer-events-none fixed z-40 overflow-hidden rounded-2xl border-2 border-white/90 shadow-xl ring-2 ring-black/20"
						style={{
							left: loupe.left,
							top: loupe.top,
							width: LOUPE_SIZE,
							height: LOUPE_SIZE,
							backgroundImage: `url(${activeSlide.src})`,
							backgroundRepeat: "no-repeat",
							backgroundSize: `${loupe.bgW}px ${loupe.bgH}px`,
							backgroundPosition: `${loupe.bgX}px ${loupe.bgY}px`,
						}}
						aria-hidden
					/>
				) : null}
			</div>
		</Dialog>
	);
}
