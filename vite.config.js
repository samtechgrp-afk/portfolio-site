import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Two pages: the portfolio (index.html) and the project page (project.html, served at /work/:slug).
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: { main: resolve(__dirname, 'index.html'), project: resolve(__dirname, 'project.html') } } },
});
