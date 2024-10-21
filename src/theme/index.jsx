/**
 * Theta Documentation for React Component: ThemeProvider
 * ----------------------------------------------------------------------
 * @file ThemeProvider.jsx
 * @description Provides a Material-UI theme context, allowing components to use a customized theme with support for dark and light modes. It uses memoization for performance optimization.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @component
 * @example
 * // Usage in another component
 * <ThemeProvider>
 *   <YourComponent />
 * </ThemeProvider>
 *
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The components that will receive the theme context.
 *
 * @returns {JSX.Element} The ThemeProvider component, wrapping its children with the customized Material-UI theme.
 */

import { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { overrides } from "./overrides";
import { typography } from "./typography";
import { customShadows } from "./custom-shadows";

// ----------------------------------------------------------------------

/**
 * Component: ThemeProvider
 * @description Provides a theme context for the application with support for dark and light modes.
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The child components that will receive the theme context.
 */
export default function ThemeProvider({ children }) {
  // ---------------------- State Variables ----------------------
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ---------------------- Event Handlers ----------------------
  /**
   * Toggles between dark and light mode themes.
   */
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  // ---------------------- Memoized Values ----------------------
  const memoizedValue = useMemo(
    () => ({
      palette: palette(isDarkMode),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    [isDarkMode]
  );

  const theme = createTheme(memoizedValue);

  // Applying component-specific overrides to the theme
  theme.components = overrides(theme);

  // ---------------------- Render ----------------------
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {/* Uncomment the button below for testing the theme toggle */}
      {/* <Button
        onClick={toggleDarkMode}
        variant="contained"
        style={{ position: "absolute", top: 10, left: 10 }}
      >
        {isDarkMode ? "Light" : "Dark"} Mode
      </Button> */}
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
