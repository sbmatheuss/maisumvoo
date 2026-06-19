import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, getSessionCookieOptions } from "@/lib/session";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, passwordHash: true },
    });

    // Tempo constante para evitar timing attacks
    const dummyHash = "$2a$12$invalidhashfortimingprotection000000000000000000000000";
    const valid = await bcrypt.compare(password, user?.passwordHash ?? dummyHash);

    if (!user || !valid) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const sessionUser = { id: user.id, email: user.email, name: user.name };
    const sessionId = await createSession(sessionUser);

    const res = NextResponse.json<ApiResponse<typeof sessionUser>>({
      data: sessionUser,
      error: null,
    });

    res.cookies.set(getSessionCookieOptions(sessionId));

    return res;
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
