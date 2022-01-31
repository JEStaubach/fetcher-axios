import axios from 'axios';
import { Request, Response, RetString } from 'src/types';
import mock from 'src/mock';

function use(fetchLibrary: (_: Request) => Promise<Response>): (_: Record<string, string>) => Promise<RetString> {
  return async function fetcher({ url }: Record<string, string>): Promise<RetString> {
    try {
      const response: Response = await fetchLibrary({
        method: `get`,
        url,
      } as Request);
      if (response.status !== 204) {
        return { success: false, error: `Expected status 204 from ${url}, recieved ${response.status}` };
      }
      if (response.headers === undefined) {
        return { success: false, error: `Response from ${url} did not include headers.` };
      }
      return { success: true, error: null, value: response.headers[`x-terraform-get`] };
    } catch (err) {
      return {
        success: false,
        error: `Exception ecountered fetching ${url} from terraform registry. ${JSON.stringify(err)}`,
      };
    }
  };
}

export type Fetcher = {
  use: (_: (_: Request) => Promise<Response>) => (_: Record<string, string>) => Promise<RetString>;
  default: (_: Request) => Promise<Response>;
  mock: (_: Request) => Promise<Response>;
}

export default { use, default: axios, mock: mock.mock } as unknown as Fetcher;
