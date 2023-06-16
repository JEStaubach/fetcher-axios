import lib from '../src/index';
import fsHelpers from '@jestaubach/fs-helpers';
import exp from 'constants';
import { beforeAll, afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

const fsh = fsHelpers.use(fsHelpers.default);
//const fetch = lib.use(lib.mock);

// create all test directories and files inside one root directory for easy cleanup
const rootTestDir = `.testDir`;

// iterate over mocked and unmocked versions of the library
const libraryVariations = {
  mocked: lib.use(lib.mock),
  unmocked: lib.use(lib.default),
}

// setup
beforeEach(async () => {
  vi.resetAllMocks();
  await fsh.rimrafDir(`${rootTestDir}`);
});

// teardown
afterEach(async () => {
  await fsh.rimrafDir(`${rootTestDir}`);
});


for (const [key, variation] of Object.entries(libraryVariations)) {

  await describe(`[${key}] test group ...`, async () => {

    if (key === `mocked`) {

      await it(`500 Error ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/500Error/aws` });
        expect(success).toBe(false);
        expect(error).toBe(`Expected status 204 from terraform/500Error/aws, recieved 500`);
        expect(value).toBe(undefined);
      });

      await it(`format Error ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/formatError/aws` });
        expect(success).toBe(true);
        expect(error).toBe(null);
        expect(value).toBe(`unexpectedformat`);
      });

      await it(`noXTFGet Error ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/noXTFGetError/aws` });
        expect(success).toBe(true);
        expect(error).toBe(null);
        expect(value).toBe(undefined);
      });

      await it(`undef Error ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/undefError/aws` });
        expect(success).toBe(false);
        expect(error).toBe(`Response from terraform/undefError/aws did not include headers.`);
        expect(value).toBe(undefined);
      });

      // I am questioning the validity of this test
      await it(`Error ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/Error/aws` });
        expect(success).toBe(true);
        expect(error).toBe(null);
        expect(value).toBe(`git::https://github.com/xascode/terraform-aws-modules/terraform-aws-vpc.git?ref=2.78.0`);
      });

      await it(`Success ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/Success/aws` });
        expect(success).toBe(true);
        expect(error).toBe(null);
        expect(value).toBe(`git::https://github.com/xascode/terraform-aws-modules/terraform-aws-vpc.git?ref=2.78.0`);
      });

    } else {

      await it (`Success ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `https://registry.terraform.io/v1/modules/terraform-aws-modules/vpc/aws/2.78.0/download` });
        expect(success).toBe(true);
        expect(error).toBe(null);
        expect(value).toBe(`git::https://github.com/terraform-aws-modules/terraform-aws-vpc?ref=v2.78.0`);
      });

      await it (`404 Error ...`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform-aws-modules/vpc/404Error` });
        expect(success).toBe(false);
        expect(error).toContain(`Exception ecountered fetching terraform-aws-modules/vpc/404Error from terraform registry.`);
        expect(value).toBe(undefined);
      });

    }

  });

};
