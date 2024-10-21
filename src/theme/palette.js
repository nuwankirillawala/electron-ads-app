/**
 * Theta Documentation for React Palette Configuration
 * ----------------------------------------------------------------------
 * @file palette.js
 * @description This file defines the color palette for the application, including the setup of primary, secondary, and other color variants. It supports light and dark modes and provides various levels of transparency for interactive elements.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @function
 * @example
 * // Usage in ThemeProvider
 * import { palette } from './palette';
 * const theme = createTheme({ palette: palette(isDarkMode) });
 *
 * @param {boolean} isDarkMode - Flag indicating if the dark mode is active.
 * @returns {Object} The palette configuration for the application theme.
 */

import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

export const primary = {
  lighter: "#C5D7FF",
  light: "#5A7BD9",
  main: "#283D94",
  dark: "#1E2F70",
  darker: "#121D44",
  contrastText: "#FFFFFF",
};

export const secondary = {
  lighter: "#EFD6FF",
  light: "#C684FF",
  main: "#8E33FF",
  dark: "#5119B7",
  darker: "#27097A",
  contrastText: "#FFFFFF",
};

export const info = {
  lighter: "#CAFDF5",
  light: "#61F3F3",
  main: "#00B8D9",
  dark: "#006C9C",
  darker: "#003768",
  contrastText: "#FFFFFF",
};

export const success = {
  lighter: "#C8FAD6",
  light: "#5BE49B",
  main: "#00A76F",
  dark: "#007867",
  darker: "#004B50",
  contrastText: "#FFFFFF",
};

export const warning = {
  lighter: "#FFF5CC",
  light: "#FFD666",
  main: "#FFAB00",
  dark: "#B76E00",
  darker: "#7A4100",
  contrastText: grey[800],
};

export const error = {
  lighter: "#FFE9D5",
  light: "#FFAC82",
  main: "#FF5630",
  dark: "#B71D18",
  darker: "#7A0916",
  contrastText: "#FFFFFF",
};

export const common = {
  black: "#000000",
  white: "#FFFFFF",
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

/**
 * Function: palette
 * @description Returns the palette configuration based on the mode (light/dark).
 * @param {boolean} isDarkMode - Flag indicating if dark mode is enabled.
 * @returns {Object} - An object containing the color settings for the theme.
 */
export function palette(isDarkMode) {
  return {
    ...base,
    mode: isDarkMode ? "dark" : "light",
    text: {
      primary: isDarkMode ? grey[100] : grey[800],
      secondary: isDarkMode ? grey[300] : grey[600],
      disabled: isDarkMode ? grey[500] : grey[400],
    },
    background: {
      paper: isDarkMode ? grey[900] : "#FFFFFF",
      default: isDarkMode ? grey[800] : grey[100],
      neutral: isDarkMode ? grey[700] : grey[200],
      lightBlueLavender: isDarkMode ? grey[600] : "#D4D8EA",
    },
    action: {
      ...base.action,
      active: isDarkMode ? grey[500] : grey[600],
    },
  };
}
