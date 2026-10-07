import lib from '../src/index';
import { describe, it, expect } from 'vitest';

// iterate over mocked and unmocked versions of the library
const libraryVariations = {
  mocked: lib.use(lib.mock),
  unmocked: lib.use(lib.default),
}

for (const [key, variation] of Object.entries(libraryVariations)) {

  await describe(`[${key}] test group ...`, async () => {

    if (key === `mocked`) {

      await it(`HTTP 500 response`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/500Error/aws` });
        expect(success).toBe(false);
        expect(error).toBe(`Expected status 204 from terraform/500Error/aws, recieved 500`);
        expect(value).toBeUndefined();
      });

      await it(`Unexpected response format`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/formatError/aws` });
        expect(success).toBe(true);
        expect(error).toBeNull();
        expect(value).toBe(`unexpectedformat`);
      });

      await it(`Missing x-terraform-get header`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/noXTFGetError/aws` });
        expect(success).toBe(true);
        expect(error).toBeNull();
        expect(value).toBeUndefined();
      });

      await it(`Missing response headers`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/undefError/aws` });
        expect(success).toBe(false);
        expect(error).toBe(`Response from terraform/undefError/aws did not include headers.`);
        expect(value).toBeUndefined();
      });

      // I am questioning the validity of this test
      await it(`Mock fallback response`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/Error/aws` });
        expect(success).toBe(true);
        expect(error).toBeNull();
        expect(value).toBe(`git::https://github.com/xascode/terraform-aws-modules/terraform-aws-vpc.git?ref=2.78.0`);
      });

      await it(`Mocked success response`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform/Success/aws` });
        expect(success).toBe(true);
        expect(error).toBeNull();
        expect(value).toBe(`git::https://github.com/xascode/terraform-aws-modules/terraform-aws-vpc.git?ref=2.78.0`);
      });

    } else {

      await it (`Registry download success`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `https://registry.terraform.io/v1/modules/terraform-aws-modules/vpc/aws/2.78.0/download` });
        expect(success).toBe(true);
        expect(error).toBeNull();
        expect(value).toMatch(/^git::https:\/\/github\.com\/terraform-aws-modules\/terraform-aws-vpc\?ref=.+$/);
      });

      await it (`Registry 404 response`, async () => {
        const {success, error, value} = await variation({ method: 'get', url: `terraform-aws-modules/vpc/404Error` });
        expect(success).toBe(false);
        expect(error).toContain(`Exception ecountered fetching terraform-aws-modules/vpc/404Error from terraform registry.`);
        expect(value).toBeUndefined();
      });

    }

  });

};
