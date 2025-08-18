import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
  },
  assetsInclude: ['**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'],
  build: {
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(png|gif|jpg|jpeg)$/i.test(assetInfo.name)) {
            return 'assets/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    copyPublicDir: true,
  },
  publicDir: 'src/assets',
});
