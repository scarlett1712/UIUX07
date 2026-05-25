import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 👇 tell Vite that the app will be served from the GitHub Pages sub‑folder
  base: '/UIUX07/',

  plugins: [react()],
})
