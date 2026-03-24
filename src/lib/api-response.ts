import { NextResponse } from "next/server";

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(
  code: string,
  message: string,
  details: unknown = {},
  status = 400
) {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}

export const DEMO_BUSINESS_ID = "biz_demo_kasai";
