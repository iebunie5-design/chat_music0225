import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: '단짝친구 - 어르신용 AI 말벗 & 음악 재생 앱',
        short_name: '단짝친구',
        description: '외로울 때, 적적할 때 찾아오는 나만의 단짝친구',
        theme_color: '#F8F9FA',
        background_color: '#F8F9FA',
        display: 'standalone',
        icons: [
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
