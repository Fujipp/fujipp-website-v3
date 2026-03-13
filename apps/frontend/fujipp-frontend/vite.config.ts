import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  build: {
    // Increase the inline asset threshold so small files are inlined
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split vendor chunks to reduce initial bundle size (improves TBT)
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
          if (id.includes('motion')) return 'vendor-motion';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
        },
      },
    },
    // Limit individual chunk size warning threshold
    chunkSizeWarningLimit: 600,
  },
})
