import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/eks-addon-configuration/',
    plugins: [react()],
    build: {
        outDir: 'build',
    },
    server: {
        port: 3000,
    },
});
