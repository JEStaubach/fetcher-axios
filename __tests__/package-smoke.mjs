import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import process from 'node:process';
import { test } from 'node:test';

const require = createRequire(import.meta.url);

test('CommonJS entry warns and retains a mockable fetcher', async () => {
  const warnings = [];
  const originalEmitWarning = process.emitWarning;
  process.emitWarning = (...args) => warnings.push(args);

  try {
    const fetcherApi = require('@jestaubach/fetcher-axios');
    const fetcher = fetcherApi.use(async (request) => {
      assert.deepEqual(request, { method: 'get', url: 'https://registry.example/modules' });
      return { status: 204, headers: { 'x-terraform-get': 'git::https://example.com/repo.git' } };
    });
    const result = await fetcher({ url: 'https://registry.example/modules' });

    assert.equal(result.success, true);
    assert.equal(result.value, 'git::https://example.com/repo.git');
    assert.ok(warnings.some(([message, options]) =>
      String(message).includes('CommonJS/UMD entry is deprecated') &&
      options?.code === 'DEP_FETCHER_AXIOS_CJS' &&
      options?.type === 'DeprecationWarning'));
  } finally {
    process.emitWarning = originalEmitWarning;
  }
});

test('ESM entry exposes the fetcher API without a CommonJS deprecation warning', async () => {
  const warnings = [];
  const originalEmitWarning = process.emitWarning;
  process.emitWarning = (...args) => warnings.push(args);

  try {
    const fetcherApi = await import('@jestaubach/fetcher-axios');
    assert.equal(typeof fetcherApi.default.use, 'function');
    assert.ok(fetcherApi.default.default);
    assert.equal(warnings.some(([, options]) => options?.code === 'DEP_FETCHER_AXIOS_CJS'), false);
  } finally {
    process.emitWarning = originalEmitWarning;
  }
});
