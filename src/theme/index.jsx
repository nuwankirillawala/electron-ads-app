import { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";

import CssBaseline from "@mui/material/CssBaseline";
import { Button } from "@mui/material";
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

export default function ThemeProvider({ children }) {
  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

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

  theme.components = overrides(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
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
