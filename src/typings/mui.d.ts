declare module "@mui/private-theming" {
    import type { Theme } from "@mui/material/styles";
  
    export interface DefaultTheme extends Theme {
        pallete: Palette
    }

    export interface Palette { 
        primary: string
        secondary: string
    }
  }