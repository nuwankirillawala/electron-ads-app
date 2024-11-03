/**
 * Theta Documentation for Vite Configuration File: vite.config.mjs
 * ----------------------------------------------------------------------
 * @file vite.config.mjs
 * @description Configuration settings for Vite, tailored for the QuantumHR Notify React application.
 *              This configuration includes plugin setups, build output specifications, and server settings.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import path from "path";

// Export Vite configuration
export default defineConfig({
  base: "./", // Ensures paths are relative for Electron's file:// protocol
  plugins: [react()], // Integrates React support via Vite plugin
  resolve: {
    alias: {
      // Path alias for cleaner imports (e.g., '@' points to the 'src' directory)
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
    },
  },
  build: {
    outDir: "dist", // Output directory for production build
    assetsDir: "./",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Custom file naming patterns for output assets
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name]-[hash].js`,
        assetFileNames: `assets/[ext]/[name]-[hash].[ext]`,
      },
    },
  },
  server: {
    port: 3000, // Port for local development server
  },
  preview: {
    port: 3000, // Port for preview mode
  },
});
