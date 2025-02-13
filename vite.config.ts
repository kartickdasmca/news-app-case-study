import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/nyt-api": {
        target: "https://api.nytimes.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nyt-api/, ""),
      },
      "/guardian-api": {
        target: "https://content.guardianapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/guardian-api/, ""),
      },
    },
  },
});
