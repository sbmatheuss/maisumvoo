"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AirportInput from "@/components/search/AirportInput";
import type { AirportSuggestion } from "@/types";

interface PriceAlertFormValues {
  email: string;
  originIata: string;
  destinationIata: string;
  targetPrice: number;
}

interface PriceAlertFormProps {
  userId?: string;
  onSuccess?: () => void;
}

export default function PriceAlertForm({ userId, onSuccess }: PriceAlertFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PriceAlertFormValues>({
    defaultValues: {
      email: "",
      originIata: "",
      destinationIata: "",
      targetPrice: 0,
    },
  });

  function handleOriginSelect(airport: AirportSuggestion) {
    setValue("originIata", airport.iataCode, { shouldValidate: true });
    setOrigin(`${airport.iataCode} — ${airport.city}`);
  }

  function handleDestinationSelect(airport: AirportSuggestion) {
    setValue("destinationIata", airport.iataCode, { shouldValidate: true });
    setDestination(`${airport.iataCode} — ${airport.city}`);
  }

  async function onSubmit(data: PriceAlertFormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/agents/price-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId ?? data.email,
          origin: data.originIata,
          destination: data.destinationIata,
          targetPrice: Number(data.targetPrice),
          email: data.email,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        onSuccess?.();
      } else {
        const body = await res.json();
        setServerError(body.error ?? "Erro ao criar alerta. Tente novamente.");
      }
    } catch {
      setServerError("Sem conexão com o servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="font-serif text-xl text-ink-100">Alerta criado com sucesso.</p>
        <p className="font-sans text-sm text-ink-400">
          Você receberá um e-mail quando o preço atingir a meta.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register("email", {
          required: "E-mail é obrigatório",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "E-mail inválido",
          },
        })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <AirportInput
            value={origin}
            onChange={handleOriginSelect}
            placeholder="Aeroporto de origem"
            label="Origem"
          />
          {errors.originIata && (
            <span className="font-sans text-xs text-red-400 mt-1 block">
              {errors.originIata.message}
            </span>
          )}
          <input
            type="hidden"
            {...register("originIata", { required: "Selecione a origem" })}
          />
        </div>

        <div>
          <AirportInput
            value={destination}
            onChange={handleDestinationSelect}
            placeholder="Aeroporto de destino"
            label="Destino"
          />
          {errors.destinationIata && (
            <span className="font-sans text-xs text-red-400 mt-1 block">
              {errors.destinationIata.message}
            </span>
          )}
          <input
            type="hidden"
            {...register("destinationIata", { required: "Selecione o destino" })}
          />
        </div>
      </div>

      <Input
        label="Preço alvo (R$)"
        type="number"
        placeholder="Ex: 500"
        error={errors.targetPrice?.message}
        {...register("targetPrice", {
          required: "Informe o preço alvo",
          min: { value: 1, message: "Preço deve ser maior que zero" },
          valueAsNumber: true,
        })}
      />

      {serverError && (
        <p className="font-sans text-sm text-red-400">{serverError}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Criando alerta..." : "Criar alerta"}
      </Button>
    </form>
  );
}
