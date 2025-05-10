import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/acsl-practice-website/",
  server: {
    cors: true,
  },
  build: {
    outDir: "./build",
    emptyOutDir: true,
  },
})
