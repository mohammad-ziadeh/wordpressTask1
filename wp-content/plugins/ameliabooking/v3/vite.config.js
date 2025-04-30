import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { useDynamicPublicPath } from 'vite-plugin-dynamic-publicpath'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Inspect(),
    useDynamicPublicPath({
      dynamicImportHandler: 'window.__dynamic_handler__',
      dynamicImportPreload: 'window.__dynamic_preload__'
    }),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],

  resolve: {
    extensions: ['.js', '.vue', '.json', '.mjs'],
    alias: {
      '@css': path.resolve(__dirname, '/src/assets/scss')
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@css/admin/_variables";
        @import "@css/common/variables/_breakpoints";
        @import "@css/common/icon-fonts/variables";
        @import "@css/common/animations/animations";
        `
      }
    }
  },

  base: '',

  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: ['src/assets/js/admin/admin.js', 'src/assets/js/public/public.js'],
      output: {
        manualChunks: {
          stepForm: [
            'src/views/public/StepForm/BookingStepForm.vue',
          ],
          catalogForm: [
            'src/views/public/CatalogForm/CatalogForm.vue',
          ],
          eventListForm: [
            'src/views/public/EventForm/EventListForm/EventsListForm.vue'
          ],
          eventCalendarForm: [
            'src/views/public/EventForm/EventCalendarForm/EvensCalendarForm.vue'
          ],
          customerPanel: [
            'src/views/public/Cabinet/CustomerPanel/CustomerPanel.vue',
          ],
          customizeForm: [
            'src/views/admin/customize/Customize.vue',
          ],
        },
      }
    },
    outDir: './public'
  }
})
