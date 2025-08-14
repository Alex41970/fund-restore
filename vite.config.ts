import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "ethers": "ethers",
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      include: [/ethers/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['ethers'],
    exclude: [],
    esbuildOptions: {
      target: 'es2020',
    },
    force: true
  },
}));
