import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({

  base: '/make_file/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
