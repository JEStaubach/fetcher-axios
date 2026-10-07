type Request = {
  method: `get`;
  url: string;
};

type Response = {
  status: number;
  headers?: Record<string, string>;
};

type RetVal = {
  success: boolean;
  error?: string | null;
};

interface RetString extends RetVal {
  value?: string;
}

interface RetBool extends RetVal {
  value?: boolean;
}

interface RetPath extends RetVal {
  value?: string;
}

export type {
  RetBool,
  RetString,
  RetVal,
  RetPath,
  Request,
  Response,
};
