"use client";

import he from "he";
import {
	type ReactNode,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

/** Pixels from an edge before the corresponding fade appears or disappears. */
const EDGE_FADE_THRESHOLD_PX = 16;

function renderDescriptionParagraphs(description: string) {
	return description
		.split("\n")
		.filter((line) => line !== "")
		.map((line) => he.decode(line))
		.map((line, index) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: index is stable for this use case
			<p key={`description-line-${index}`} className="mb-0 text-lg first:mt-0">
				{line
					.split(" ")
					.map((word) =>
						word.substring(0, 8) === "https://" ? (
							<a
								key={`description-link-${word}`}
								href={word}
								target="_blank"
								rel="noreferrer"
								className="text-bluegreen-500 break-all navItem"
							>
								{word}
							</a>
						) : (
							word
						),
					)
					.reduce<ReactNode[] | null>((accumulator, element) => {
						if (accumulator === null) return [element];
						accumulator.push(" ", element);
						return accumulator;
					}, null)}
			</p>
		));
}

type ProductPageDescriptionProps = {
	description?: string;
};

export default function ProductPageDescription({
	description = "",
}: ProductPageDescriptionProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [showTopFade, setShowTopFade] = useState(false);
	const [showBottomFade, setShowBottomFade] = useState(false);

	const updateFades = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;

		const { scrollTop, scrollHeight, clientHeight } = el;
		const epsilon = 1;
		const canScroll = scrollHeight > clientHeight + epsilon;

		if (!canScroll) {
			setShowTopFade(false);
			setShowBottomFade(false);
			return;
		}

		setShowTopFade(scrollTop > EDGE_FADE_THRESHOLD_PX);
		setShowBottomFade(
			scrollTop + clientHeight < scrollHeight - EDGE_FADE_THRESHOLD_PX,
		);
	}, []);

	useLayoutEffect(() => {
		updateFades();

		const scrollEl = scrollRef.current;
		const contentEl = contentRef.current;
		if (!scrollEl) return;

		scrollEl.addEventListener("scroll", updateFades, { passive: true });

		const ro = new ResizeObserver(updateFades);
		ro.observe(scrollEl);
		if (contentEl) ro.observe(contentEl);

		return () => {
			scrollEl.removeEventListener("scroll", updateFades);
			ro.disconnect();
		};
	}, [updateFades]);

	return (
		<div className="relative mt-4 flex max-h-56 min-h-0 flex-col md:max-h-none md:flex-1">
			<div
				ref={scrollRef}
				className="subtleScrollbar min-h-0 flex-1 overflow-y-auto"
			>
				<div ref={contentRef}>
					{renderDescriptionParagraphs(description ?? "")}
				</div>
			</div>
			<div
				aria-hidden
				className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-b from-white to-transparent transition-opacity duration-200 ${
					showTopFade ? "opacity-100" : "opacity-0"
				}`}
			/>
			<div
				aria-hidden
				className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-linear-to-t from-white to-transparent transition-opacity duration-200 ${
					showBottomFade ? "opacity-100" : "opacity-0"
				}`}
			/>
		</div>
	);
}
