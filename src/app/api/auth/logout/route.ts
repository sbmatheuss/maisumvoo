import { NextResponse } from "next/server";
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/session";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await destroySession();
    const body: ApiResponse<boolean> = { data: true, error: null };
    const res = NextResponse.json(body, { status: 200 });
    res.cookies.set({ name: SESSION_COOKIE_NAME, value: "", maxAge: 0, path: "/" });
    return res;
  } catch {
    const body: ApiResponse<boolean> = { data: null, error: "Erro interno." };
    return NextResponse.json(body, { status: 500 });
  }
}
