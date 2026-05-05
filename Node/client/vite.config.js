import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/admin/",   // 🔥 THIS is what we actually needed
  plugins: [react()],
})