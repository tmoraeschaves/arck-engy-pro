import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Permite `import { criarArck } from '@arck/core'` em todo o ui-web
      // sem caminhos relativos frágeis (../../../../core/src/...)
      '@arck/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
