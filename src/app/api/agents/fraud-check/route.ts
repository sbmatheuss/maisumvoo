import { NextRequest, NextResponse } from "next/server";
import { detectFraud, FraudInput } from "@/lib/agents/fraud-detection-agent";
import { BookingPayload, PassengerInfo, ApiResponse, FraudCheckResult } from "@/types";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      booking: BookingPayload;
      passengers: PassengerInfo[];
      ip?: string;
      userAgent?: string;
      previousBookings?: number;
    };

    const { booking, passengers, ip, userAgent, previousBookings } = body;

    if (!booking || typeof booking !== "object") {
      const response: ApiResponse<null> = {
        data: null,
        error: "Campo 'booking' é obrigatório.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      const response: ApiResponse<null> = {
        data: null,
        error: "Campo 'passengers' é obrigatório e deve conter ao menos um passageiro.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const requiredBookingFields: (keyof BookingPayload)[] = [
      "flightOfferId",
      "totalAmount",
      "contactEmail",
      "origin",
      "destination",
    ];

    const missingFields = requiredBookingFields.filter(
      (field) => booking[field] === undefined || booking[field] === null
    );

    if (missingFields.length > 0) {
      const response: ApiResponse<null> = {
        data: null,
        error: `Campos obrigatórios ausentes em 'booking': ${missingFields.join(", ")}`,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const clientIp =
      ip ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      undefined;

    const clientUserAgent = userAgent ?? req.headers.get("user-agent") ?? undefined;

    const fraudInput: FraudInput = {
      booking,
      passengers,
      ip: clientIp,
      userAgent: clientUserAgent,
      previousBookings,
    };

    const result = await detectFraud(fraudInput);

    const response: ApiResponse<FraudCheckResult> = {
      data: result,
      error: null,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/agents/fraud-check]", err);

    const response: ApiResponse<null> = {
      data: null,
      error: "Erro interno na verificação de fraude.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
