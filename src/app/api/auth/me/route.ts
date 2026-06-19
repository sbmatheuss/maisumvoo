import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { ApiResponse } from "@/types";
import type { SessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSession();
    const body: ApiResponse<SessionUser> = { data: user, error: null };
    return NextResponse.json(body, { status: 200 });
  } catch {
    const body: ApiResponse<SessionUser> = { data: null, error: "Erro interno." };
    return NextResponse.json(body, { status: 500 });
  }
}
