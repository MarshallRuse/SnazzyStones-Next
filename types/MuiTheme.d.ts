import type {} from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Palette {
		bluegreen: Palette["primary"];
		blueyonder: Palette["primary"];
		cerise: Palette["primary"];
	}

	interface PaletteOptions {
		bluegreen?: PaletteOptions["primary"];
		blueyonder?: PaletteOptions["primary"];
		cerise?: PaletteOptions["primary"];
	}
}

declare module "@mui/material/TextField" {
	export interface TextFieldPropsColorOverrides {
		bluegreen: true;
		blueyonder: true;
		cerise: true;
	}
}
