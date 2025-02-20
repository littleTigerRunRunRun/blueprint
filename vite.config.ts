import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { fileURLToPath, URL } from 'node:url'
import detectPort from 'detect-port'

export default defineConfig(async () => {
  const DEFAULT_PORT = 3000
  const port = await detectPort(DEFAULT_PORT)

  return {
    server: {
      port
    },
    plugins: [
      react(),
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true
        },
        protocolImports: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      rollupOptions: {
        external: ['react', 'react-dom', 'react-router-dom', 'antd']
      }
    },
    optimizeDeps: {
      exclude: []
    }
  }
})
