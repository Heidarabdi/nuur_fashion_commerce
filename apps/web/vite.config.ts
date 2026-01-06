import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

import path from 'node:path'

const config = defineConfig(({ command }) => ({
  define: {
    // Replace __API_URL__ at build time with the production URL
    // command is 'serve' for dev server, 'build' for production build
    // mode is 'development' or 'production'
    '__API_URL__': JSON.stringify(
      command === 'build'
        ? 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev'
        : 'http://localhost:3002'
    ),
  },
  resolve: {
    alias: {
      'use-sync-external-store/shim/index.js': path.resolve(__dirname, 'src/shim.ts'),
      // Resolve API package from source so production URL is included
      '@nuur-fashion-commerce/api': path.resolve(__dirname, '../../packages/api/src/index.ts'),
    },
  },

  plugins: [
    devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['use-sync-external-store/shim/index.js'],
  },
}))

export default config
