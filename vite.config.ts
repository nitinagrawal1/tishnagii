import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const projectRoot = import.meta.dirname;
  return {
    root: path.resolve(projectRoot, 'client'),
    envDir: projectRoot,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, 'client/src'),
        '@shared': path.resolve(projectRoot, 'shared'),
      },
    },
    build: {
      outDir: path.resolve(projectRoot, 'client/dist'),
    },
    server: {
      // Server options
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
