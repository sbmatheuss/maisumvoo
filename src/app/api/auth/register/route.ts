import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

interface RegisterBody {
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterBody = await req.json();
    const { name, cpf, email, phone, password } = body;

    if (!name || !cpf || !email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const cpfDigits = cpf.replace(/\D/g, "");
    if (cpfDigits.length !== 11) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "CPF inválido." },
        { status: 400 }
      );
    }

    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { cpf: cpfDigits }] },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Já existe uma conta com esse e-mail ou CPF." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, cpf: cpfDigits, email, phone, passwordHash },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json<ApiResponse<typeof user>>({ data: user, error: null }, { status: 201 });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
