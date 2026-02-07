import { IReadonlyTheme } from "@microsoft/sp-component-base";

export interface HyperThemeTokens {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
  fontFamily: string;
  spacing: { xs: string; sm: string; md: string; lg: string; xl: string };
  shadows: { sm: string; md: string; lg: string };
}

export const resolveTheme = (spTheme: IReadonlyTheme | undefined): HyperThemeTokens => {
  const palette = spTheme?.palette;
  return {
    primaryColor: palette?.themePrimary ?? "#0078d4",
    backgroundColor: palette?.white ?? "#ffffff",
    textColor: palette?.neutralPrimary ?? "#323130",
    accentColor: palette?.themeSecondary ?? "#2b88d8",
    borderRadius: "8px",
    fontFamily: spTheme?.fonts?.medium?.fontFamily ?? "'Segoe UI', sans-serif",
    spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" },
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.1)",
      md: "0 2px 8px rgba(0,0,0,0.12)",
      lg: "0 8px 24px rgba(0,0,0,0.14)",
    },
  };
};
