import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { searchFlights } from "@/lib/amadeus";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é um analista de preços de passagens aéreas. Sua função é avaliar se o preço atual de um voo atingiu ou está próximo o suficiente do preço-alvo definido pelo usuário para justificar uma notificação.

Considere como "notificar" quando:
- O preço atual está igual ou abaixo do preço-alvo
- O preço está até 5% acima do alvo (variação mínima aceitável)

Não notifique quando:
- O preço está mais de 5% acima do alvo
- O preço não representa uma oportunidade real de compra

Responda SOMENTE com JSON: { "shouldNotify": true|false, "reason": "justificativa curta" }`;

export async function evaluatePrice(
  currentPrice: number,
  targetPrice: number,
  context: string
): Promise<boolean> {
  const tolerance = targetPrice * 1.05;
  if (currentPrice > tolerance) {
    return false;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Preço atual: R$ ${currentPrice.toFixed(2)}\nPreço-alvo: R$ ${targetPrice.toFixed(2)}\nContexto: ${context}\n\nDevo notificar o usuário?`,
        },
      ],
    });

    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return currentPrice <= targetPrice;

    const parsed = JSON.parse(jsonMatch[0]) as {
      shouldNotify: boolean;
      reason: string;
    };

    console.log(
      `[PriceMonitor] evaluatePrice resultado: shouldNotify=${parsed.shouldNotify}, reason="${parsed.reason}"`
    );

    return parsed.shouldNotify;
  } catch (err) {
    console.error("[PriceMonitor] evaluatePrice erro:", err);
    return currentPrice <= targetPrice;
  }
}

export async function checkPriceAlerts(): Promise<void> {
  const alerts = await db.priceAlert.findMany({
    where: { isActive: true },
    include: { user: { select: { email: true, name: true } } },
  });

  console.log(
    JSON.stringify({
      event: "price_monitor_start",
      alertsCount: alerts.length,
      timestamp: new Date().toISOString(),
    })
  );

  if (alerts.length === 0) {
    console.log(
      JSON.stringify({ event: "price_monitor_done", message: "Nenhum alerta ativo." })
    );
    return;
  }

  let triggeredCount = 0;
  let checkedCount = 0;

  for (const alert of alerts) {
    try {
      const today = new Date();
      const departureDate = new Date(today);
      departureDate.setDate(today.getDate() + 30);
      const departureDateStr = departureDate.toISOString().split("T")[0];

      const flights = await searchFlights({
        origin: alert.origin,
        destination: alert.destination,
        departureDate: departureDateStr,
        adults: 1,
        children: 0,
        infants: 0,
        tripType: "oneway",
        cabinClass: "ECONOMY",
      });

      await db.priceAlert.update({
        where: { id: alert.id },
        data: { lastCheckedAt: new Date() },
      });

      checkedCount++;

      if (flights.length === 0) {
        console.log(
          JSON.stringify({
            event: "price_alert_no_flights",
            alertId: alert.id,
            origin: alert.origin,
            destination: alert.destination,
          })
        );
        continue;
      }

      const lowestFlight = flights.reduce((min, f) =>
        parseFloat(f.price.total) < parseFloat(min.price.total) ? f : min
      );

      const currentPrice = parseFloat(lowestFlight.price.total);
      const targetPrice = alert.targetPrice;

      const context = `Rota ${alert.origin} → ${alert.destination}. Menor preço encontrado: R$ ${currentPrice.toFixed(2)} (${lowestFlight.validatingAirlineCodes.join(", ")}).`;

      const shouldNotify = await evaluatePrice(currentPrice, targetPrice, context);

      console.log(
        JSON.stringify({
          event: "price_alert_evaluated",
          alertId: alert.id,
          userId: alert.userId,
          origin: alert.origin,
          destination: alert.destination,
          currentPrice,
          targetPrice,
          shouldNotify,
        })
      );

      if (shouldNotify) {
        await db.priceAlert.update({
          where: { id: alert.id },
          data: { isActive: false },
        });

        triggeredCount++;

        console.log(
          JSON.stringify({
            event: "price_alert_triggered",
            alertId: alert.id,
            userId: alert.userId,
            userEmail: alert.user.email,
            origin: alert.origin,
            destination: alert.destination,
            currentPrice,
            targetPrice,
            message: `Notificar ${alert.user.name} (${alert.user.email}): preço R$ ${currentPrice.toFixed(2)} atingiu alvo de R$ ${targetPrice}.`,
          })
        );
      }
    } catch (err) {
      console.error(
        JSON.stringify({
          event: "price_alert_error",
          alertId: alert.id,
          error: err instanceof Error ? err.message : String(err),
        })
      );
    }
  }

  console.log(
    JSON.stringify({
      event: "price_monitor_done",
      checkedCount,
      triggeredCount,
      timestamp: new Date().toISOString(),
    })
  );
}
