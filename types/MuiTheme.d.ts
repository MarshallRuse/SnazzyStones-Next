import { Palette as MuiPalette, PaletteOptions as MuiPaletteOptions } from "@mui/material/styles/createPalette";

declare module "@mui/material/styles/createPalette" {
    interface Palette extends MuiPalette {
        bluegreen: Palette["primary"];
        blueyonder: Palette["primary"];
        cerise: Palette["primary"];
    }

    interface PaletteOptions extends MuiPaletteOptions {
        bluegreen: PaletteOptions["primary"];
        blueyonder: PaletteOptions["primary"];
        cerise: PaletteOptions["primary"];
    }
}

// Extend color prop on components
declare module "@mui/material/TextField" {
    export interface TextFieldPropsColorOverrides {
        bluegreen: true;
        blueyonder: true;
        cerise: true;
    }
}
