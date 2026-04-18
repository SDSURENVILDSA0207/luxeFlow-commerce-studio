import { NextResponse } from "next/server";

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function success<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status });
}

export function failure(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json<ApiError>(
    { ok: false, error: { code, message, details } },
    { status }
  );
}
