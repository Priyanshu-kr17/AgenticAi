import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:1800',
        changeOrigin: true,
        secure: false,
      },
      '/chat': {
        target: 'http://localhost:1800',
        changeOrigin: true,
        secure: false,
      },
      '/chatting': {
        target: 'http://localhost:1800',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:1800',
        changeOrigin: true,
        secure: false,
      },
      '/update': {
        target: 'http://localhost:1800',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
