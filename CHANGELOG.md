# Changelog

## [0.2.1](https://github.com/JEStaubach/fetcher-axios/compare/fetcher-axios-v0.2.0...fetcher-axios-v0.2.1) (2026-10-11)


### deps

* **fetcher-axios:** refresh analysis and coverage tooling ([e787079](https://github.com/JEStaubach/fetcher-axios/commit/e78707954f7440422cce546b4d893ec12815728d))

## [0.2.0](https://github.com/JEStaubach/fetcher-axios/compare/fetcher-axios-v0.1.9...fetcher-axios-v0.2.0) (2026-10-10)

### ⚠ BREAKING CHANGES

* require Node.js 22 and deprecate CommonJS entry ([#60](https://github.com/JEStaubach/fetcher-axios/issues/60))

### Features

* require Node.js 22 and deprecate CommonJS entry ([#60](https://github.com/JEStaubach/fetcher-axios/issues/60)) ([8a4769a](https://github.com/JEStaubach/fetcher-axios/commit/8a4769ad4303051750dad922e62f1851f315c0af))

## Changelog

All notable changes to this project are documented here.

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Changed

* Emit a Node.js deprecation warning when the CommonJS/UMD entry is loaded; retain the entry and API.
* Require Node.js 22 or newer and enable strict TypeScript checking.
* Enforce zero-warning linting.

### Added

* Add package smoke tests for the built ESM and UMD entry points.
