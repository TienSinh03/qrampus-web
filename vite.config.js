import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@api': path.resolve(__dirname, './src/api'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@config': path.resolve(__dirname, './src/config'),
      '@routes': path.resolve(__dirname, './src/routes'),
      // '@utils': path.resolve(__dirname, './src/services/utils'),
    },
  },
})
