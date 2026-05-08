"use client";

import CloseRounded from "@mui/icons-material/CloseRounded";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LegacyImage from "next/legacy/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ImageLightboxProps {
	open: boolean;
	onClose: () => void;
	src: string;
	alt: string;
	blurDataURL?: string;
}

const LOUPE_SIZE = 336;
const MAGNIFICATION = 2.35;
const DISMISS_MOVE_THRESHOLD_PX = 14;
const DISMISS_MOVE_THRESHOLD_SQ =
	DISMISS_MOVE_THRESHOLD_PX * DISMISS_MOVE_THRESHOLD_PX;
/** Viewport padding when clamping the loupe position */
const LOUPE_VIEWPORT_PAD = 12;

function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}

export default function ImageLightbox({
	open,
	onClose,
	src,
	alt,
	blurDataURL,
}: ImageLightboxProps) {
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const dismissPointerRef = useRef<{
		id: number;
		x: number;
		y: number;
		moved: boolean;
	} | null>(null);

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
					{alt}
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
				<div
					ref={imageContainerRef}
					className={`relative z-[5] h-[min(85vh,920px)] w-[min(92vw,920px)] max-w-full touch-none ${loupe ? "cursor-none" : "cursor-zoom-in"}`}
				>
					<LegacyImage
						src={src}
						alt={alt}
						layout="fill"
						objectFit="contain"
						className="rounded-lg select-none"
						{...(blurDataURL
							? { placeholder: "blur" as const, blurDataURL }
							: { placeholder: "empty" as const })}
						priority={open}
					/>
				</div>
				{loupe ? (
					<div
						className="pointer-events-none fixed z-40 overflow-hidden rounded-2xl border-2 border-white/90 shadow-xl ring-2 ring-black/20"
						style={{
							left: loupe.left,
							top: loupe.top,
							width: LOUPE_SIZE,
							height: LOUPE_SIZE,
							backgroundImage: `url(${src})`,
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
