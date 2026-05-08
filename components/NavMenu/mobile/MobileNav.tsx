"use client";

import { motion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useRef, useState } from "react";
import { MenuToggle } from "./MenuToggle";
import { MobileNavList } from "./MobileNavList";
import { useDimensions } from "./use-dimensions";

const sidebar: Variants = {
	open: (height = 1000) => ({
		clipPath: `circle(${height * 2 + 200}px at calc(100% - 3.5rem) 3rem)`,
		transition: {
			type: "spring",
			stiffness: 20,
			restDelta: 2,
		},
	}),
	closed: {
		clipPath: "circle(30px at calc(100% - 3.5rem) 3rem)",
		transition: {
			delay: 0.5,
			type: "spring",
			stiffness: 400,
			damping: 40,
		},
	},
};

export default function MobileNav() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLElement>(null);
	const { height } = useDimensions(containerRef as RefObject<HTMLElement>);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Menu should close on path change
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "unset";
	}, [isOpen]);

	return (
		<motion.nav
			className="absolute top-0 left-0 bottom-0 right-0 w-12 h-12"
			initial={false}
			animate={isOpen ? "open" : "closed"}
			custom={height}
			ref={containerRef}
		>
			<motion.div
				className="fixed top-0 right-0 bottom-0 overflow-y-auto  w-80 bg-white shadow-light"
				variants={sidebar}
			>
				<MobileNavList />
			</motion.div>
			<MenuToggle toggle={() => setIsOpen(!isOpen)} />
		</motion.nav>
	);
}
