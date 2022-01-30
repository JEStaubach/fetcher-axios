type Request = {
  method: `get`;
  url: string;
};

type Response = {
  status: number;
  headers?: Record<string, string>;
};

type Path = string;

type RetVal = {
  success: boolean;
  error?: string;
};

interface RetString extends RetVal {
  value?: string;
}

interface RetBool extends RetVal {
  value?: boolean;
}

interface RetPath extends RetVal {
  value?: Path;
}

export {
  Path,
  RetBool,
  RetString,
  RetVal,
  RetPath,
  Request,
  Response,
};
