import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // I need to config proxy because I can't access api fetch invoice list with /CORS reason
  server: {
    proxy: {
      '/api': {
        target: 'https://api-wso2-101digital-sandbox.101digital.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'https://is-101digital-sandbox.101digital.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ''),
      },
    },
  },
});
