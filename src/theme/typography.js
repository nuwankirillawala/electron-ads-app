/**
 * Theta Documentation for Typography Configuration
 * ---------------------------------------------------------
 * @file typography.js
 * @description Typography configuration for the QuantumHR Notify application,
 *              providing consistent font scaling, responsive settings, and font weights.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 */

// ----------------------------------------------------------------------

/**
 * Converts rem units to px.
 * @param {string} value - The rem value as a string (e.g., "1rem").
 * @returns {number} The corresponding value in pixels.
 */
export function remToPx(value) {
  return Math.round(parseFloat(value) * 16);
}

/**
 * Converts px units to rem.
 * @param {number} value - The pixel value.
 * @returns {string} The corresponding value in rem.
 */
export function pxToRem(value) {
  return `${value / 16}rem`;
}

/**
 * Generates responsive font sizes based on screen width breakpoints.
 * @param {Object} sizes - An object with sm, md, and lg values.
 * @param {number} sizes.sm - Font size for small screens (min-width: 600px).
 * @param {number} sizes.md - Font size for medium screens (min-width: 900px).
 * @param {number} sizes.lg - Font size for large screens (min-width: 1200px).
 * @returns {Object} CSS media queries for responsive font sizes.
 */
export function responsiveFontSizes({ sm, md, lg }) {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

// Font families used throughout the application
export const primaryFont = "Public Sans, sans-serif";
export const secondaryFont = "Barlow, sans-serif";

// ----------------------------------------------------------------------

/**
 * Typography settings for various text elements used across the application.
 */
export const typography = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 800,
    lineHeight: 80 / 64,
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 800,
    lineHeight: 64 / 48,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: "uppercase",
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: "unset",
  },
};
