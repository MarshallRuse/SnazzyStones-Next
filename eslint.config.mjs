import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * Next 16 ships stricter `eslint-plugin-react-hooks` rules (`refs`, `set-state-in-effect`)
 * that flag common UI patterns (route-driven resets, mount gates, measured refs).
 * Turn off here so `npm run lint` stays usable; tighten file-by-file later.
 */
const eslintConfig = [
	...nextCoreWebVitals,
	{
		rules: {
			"react-hooks/refs": "off",
			"react-hooks/set-state-in-effect": "off",
		},
	},
];

export default eslintConfig;
