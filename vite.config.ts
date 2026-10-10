/// <reference types="vitest" />

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import dts from 'unplugin-dts/vite';
import builtinModules from 'builtin-modules';
import pkg from './package.json' with { type: 'json' };

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
    rolldownOptions: {
      external: isExternal,
      output: {
        banner: `if (typeof module !== 'undefined' && module.exports && typeof process !== 'undefined' && typeof process.emitWarning === 'function') { process.emitWarning('@jestaubach/fetcher-axios: The CommonJS/UMD entry is deprecated; migrate to the ESM entry.', { code: 'DEP_FETCHER_AXIOS_CJS', type: 'DeprecationWarning' }); }`,
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
      reporter: [`text`, `json`, `html`, `lcov`],
      include: ['src'],
      exclude: ['src/**/*.d.ts', 'src/**/__tests__/**'],
    },
    environment: 'node',
    testTimeout: 20000
  },
});
