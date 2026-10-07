/// <reference types="vitest" />

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import builtinModules from 'builtin-modules';
import pkg from './package.json';

const externalPackages = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies),
];
const isExternal = (id: string) => externalPackages.some(
  name => id === name || id.startsWith(`${name}/`)
);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.ts'),
      name: 'fetcher-axios',
      fileName: 'fetcher-axios',
    },
    rollupOptions: {
      external: isExternal,
      output: {
        globals: {
          axios: 'axios',
        },
      },
    },
  },
  optimizeDeps: {
    exclude: externalPackages,
  },
  plugins: [dts()],
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: [`text`, `json`, `html`, `lcov`]
    },
    environment: 'node',
    testTimeout: 20000
  },
});
