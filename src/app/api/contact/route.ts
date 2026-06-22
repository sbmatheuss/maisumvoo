import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode exceder 100 caracteres"),
  email: z.string().email("E-mail inválido"),
  cpfOrReservation: z
    .string()
    .max(20, "Campo CPF/Reserva muito longo")
    .optional()
    .or(z.literal("")),
  subject: z.enum(
    ["reserva", "cancelamento", "reembolso", "bagagem", "checkin", "conta", "pagamento", "outro"],
    { errorMap: () => ({ message: "Assunto inválido" }) }
  ),
  message: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(2000, "Mensagem não pode exceder 2000 caracteres"),
});

const subjectMap: Record<string, string> = {
  reserva: "BOOKING",
  cancelamento: "CANCELLATION",
  reembolso: "REFUND",
  bagagem: "BAGGAGE",
  checkin: "CHECKIN",
  conta: "ACCOUNT",
  pagamento: "PAYMENT",
  outro: "OTHER",
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ contactId: string }>>> {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return NextResponse.json(
        { data: null, error: `Dados inválidos: ${errorMessage}` },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const contact = await db.contact.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        cpfOrReservation: data.cpfOrReservation?.trim() || null,
        subject: subjectMap[data.subject] as any,
        message: data.message.trim(),
        status: "OPEN",
      },
      select: { id: true },
    });

    return NextResponse.json(
      { data: { contactId: contact.id }, error: null },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/contact] Unexpected error:", err);
    return NextResponse.json(
      { data: null, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
