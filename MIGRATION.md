# Migration Guide

## Unreleased

### Node.js requirement

This package now requires Node.js 22 or newer. Upgrade the runtime used by your application and CI before updating this package.

### CommonJS deprecation

Loading the CommonJS entry with `require('@jestaubach/fetcher-axios')` now emits a `DeprecationWarning` with code `DEP_FETCHER_AXIOS_CJS`. The entry and API remain available; no removal version is announced.

Migrate to ESM to avoid the warning:

```js
import fetcher from '@jestaubach/fetcher-axios';
```

The ESM entry does not emit the warning. No fetcher API changes are included in this release.
