/**
 * Theta Documentation for React Component: index.jsx
 * ----------------------------------------------------------------------
 * @file index.jsx
 * @description The entry point for the React application, setting up the root component with a theme provider and hash-based routing.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @component
 * @example
 * // This file should be linked in your HTML template
 * <React.StrictMode>
 *   <ThemeProvider>
 *     <HashRouter>
 *       <App />
 *     </HashRouter>
 *   </ThemeProvider>
 * </React.StrictMode>
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import ThemeProvider from "../theme"; // Adjust the path if needed

// Create a root element for the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component wrapped with HashRouter and ThemeProvider
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
