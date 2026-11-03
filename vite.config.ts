import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({ esbuild: { jsx: 'automatic' }, optimizeDeps: { esbuildOptions: { jsx: 'automatic' } }, resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, server: { host: '127.0.0.1', port: 4175, strictPort: true } });
