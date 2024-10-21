/**
 * Theta Documentation for React Styles Utility Functions
 * ----------------------------------------------------------------------
 * @file stylesUtility.js
 * @description This file contains reusable style utility functions and styles for Material-UI components, including
 *              gradient backgrounds, blur effects, and custom component styling for menus, papers, and more.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 */

// ----------------------------------------------------------------------

import { alpha } from "@mui/material/styles";
import { dividerClasses } from "@mui/material/Divider";
import { checkboxClasses } from "@mui/material/Checkbox";
import { menuItemClasses } from "@mui/material/MenuItem";
import { autocompleteClasses } from "@mui/material/Autocomplete";

/**
 * Style: paper
 * @param {Object} params - Object containing theme, background color, and dropdown flag
 * @returns {Object} - Paper component styles with optional background and blur effects
 */
export const paper = ({ theme, bgcolor, dropdown }) => ({
  ...bgBlur({
    blur: 20,
    opacity: 0.9,
    color: theme.palette.background.paper,
    ...(bgcolor && {
      color: bgcolor,
    }),
  }),
  backgroundImage: "url(/assets/cyan-blur.png), url(/assets/red-blur.png)",
  backgroundRepeat: "no-repeat, no-repeat",
  backgroundPosition: "top right, left bottom",
  backgroundSize: "50%, 50%",
  ...(theme.direction === "rtl" && {
    backgroundPosition: "top left, right bottom",
  }),
  ...(dropdown && {
    padding: theme.spacing(0.5),
    boxShadow: theme.customShadows.dropdown,
    borderRadius: theme.shape.borderRadius * 1.25,
  }),
});

// ----------------------------------------------------------------------

/**
 * Style: menuItem
 * @param {Object} theme - Theme object for accessing typography and palette values
 * @returns {Object} - Styles for menu items, including padding and selected state
 */
export const menuItem = (theme) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.shape.borderRadius * 0.75,
  "&:not(:last-of-type)": {
    marginBottom: 4,
  },
  [`&.${menuItemClasses.selected}`]: {
    fontWeight: theme.typography.fontWeightSemiBold,
    backgroundColor: theme.palette.action.selected,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  [`& .${checkboxClasses.root}`]: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(-0.5),
    marginRight: theme.spacing(0.5),
  },
  [`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
    backgroundColor: theme.palette.action.selected,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  [`&+.${dividerClasses.root}`]: {
    margin: theme.spacing(0.5, 0),
  },
});

// ----------------------------------------------------------------------

/**
 * Utility Function: bgBlur
 * @param {Object} props - Object containing blur, opacity, color, and image URL
 * @returns {Object} - Styles applying blur effect and optional background image
 */
export function bgBlur(props) {
  const color = props?.color || "#000000";
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: "relative",
      backgroundImage: `url(${imgUrl})`,
      "&:before": {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: "100%",
        height: "100%",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    };
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

// ----------------------------------------------------------------------

/**
 * Utility Function: bgGradient
 * @param {Object} props - Object containing gradient direction, colors, and image URL
 * @returns {Object} - Styles applying gradient background and optional image
 */
export function bgGradient(props) {
  const direction = props?.direction || "to bottom";
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// ----------------------------------------------------------------------

/**
 * Utility Function: textGradient
 * @param {string} value - Gradient value for text
 * @returns {Object} - Styles applying a gradient to text
 */
export function textGradient(value) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
}

// ----------------------------------------------------------------------

/**
 * Utility Function: hideScroll
 * Description: Styles to hide scrollbars for x or y axis
 * @returns {Object} - Scroll hiding styles for x and y axes
 */
export const hideScroll = {
  x: {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    overflowX: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  y: {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
};
