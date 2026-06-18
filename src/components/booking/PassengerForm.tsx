"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { clsx } from "clsx";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { PassengerInfo } from "@/types";

function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(clean[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10 || check === 11) check = 0;
  if (check !== Number(clean[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(clean[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10 || check === 11) check = 0;
  return check === Number(clean[10]);
}

function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

interface PassengerFormValues {
  passengers: {
    firstName: string;
    lastName: string;
    cpf: string;
    dateOfBirth: string;
    type: "ADULT" | "CHILD" | "INFANT";
  }[];
}

interface PassengerFormProps {
  passengerCount: { adults: number; children: number; infants: number };
  onSubmit: (passengers: PassengerInfo[]) => void;
}

function passengerTypeLabel(type: PassengerInfo["type"], index: number) {
  const map = { ADULT: "Adulto", CHILD: "Criança", INFANT: "Bebê" };
  return `${map[type]} ${index + 1}`;
}

export default function PassengerForm({
  passengerCount,
  onSubmit,
}: PassengerFormProps) {
  const defaultPassengers: PassengerFormValues["passengers"] = [
    ...Array(passengerCount.adults)
      .fill(null)
      .map(() => ({
        firstName: "",
        lastName: "",
        cpf: "",
        dateOfBirth: "",
        type: "ADULT" as const,
      })),
    ...Array(passengerCount.children)
      .fill(null)
      .map(() => ({
        firstName: "",
        lastName: "",
        cpf: "",
        dateOfBirth: "",
        type: "CHILD" as const,
      })),
    ...Array(passengerCount.infants)
      .fill(null)
      .map(() => ({
        firstName: "",
        lastName: "",
        cpf: "",
        dateOfBirth: "",
        type: "INFANT" as const,
      })),
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm<PassengerFormValues>({
    defaultValues: { passengers: defaultPassengers },
  });

  const { fields } = useFieldArray({ control, name: "passengers" });

  const typeIndexes: Record<string, number> = {};

  function getTypeIndex(type: string) {
    typeIndexes[type] = (typeIndexes[type] ?? -1) + 1;
    return typeIndexes[type];
  }

  function handleFormSubmit(data: PassengerFormValues) {
    const passengers: PassengerInfo[] = data.passengers.map((p) => ({
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      cpf: p.cpf.replace(/\D/g, ""),
      dateOfBirth: p.dateOfBirth,
      type: p.type,
    }));
    onSubmit(passengers);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-8">
      {fields.map((field, index) => {
        const typeIdx = getTypeIndex(field.type);
        const label = passengerTypeLabel(field.type, typeIdx);
        const passengerErrors = errors.passengers?.[index];

        return (
          <div key={field.id} className="flex flex-col gap-4">
            <h3 className="font-sans text-xs uppercase tracking-widest text-ink-400 border-b border-ink-800 pb-3">
              {label}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome"
                placeholder="Nome"
                error={passengerErrors?.firstName?.message}
                {...register(`passengers.${index}.firstName`, {
                  required: "Nome é obrigatório",
                  minLength: { value: 2, message: "Nome muito curto" },
                })}
              />
              <Input
                label="Sobrenome"
                placeholder="Sobrenome"
                error={passengerErrors?.lastName?.message}
                {...register(`passengers.${index}.lastName`, {
                  required: "Sobrenome é obrigatório",
                  minLength: { value: 2, message: "Sobrenome muito curto" },
                })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name={`passengers.${index}.cpf`}
                control={control}
                rules={{
                  required: "CPF é obrigatório",
                  validate: (v) =>
                    validateCPF(v) || "CPF inválido",
                }}
                render={({ field: cpfField }) => (
                  <Input
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={cpfField.value}
                    onChange={(e) => {
                      cpfField.onChange(maskCPF(e.target.value));
                    }}
                    error={passengerErrors?.cpf?.message}
                    maxLength={14}
                  />
                )}
              />
              <Input
                label="Data de nascimento"
                type="date"
                error={passengerErrors?.dateOfBirth?.message}
                {...register(`passengers.${index}.dateOfBirth`, {
                  required: "Data de nascimento é obrigatória",
                  validate: (v) => {
                    const dob = new Date(v);
                    const now = new Date();
                    const age =
                      now.getFullYear() - dob.getFullYear() -
                      (now <
                        new Date(
                          now.getFullYear(),
                          dob.getMonth(),
                          dob.getDate()
                        )
                        ? 1
                        : 0);
                    if (field.type === "ADULT" && age < 18) {
                      return "Adulto deve ter 18 anos ou mais";
                    }
                    if (field.type === "CHILD" && (age < 2 || age >= 12)) {
                      return "Criança deve ter entre 2 e 11 anos";
                    }
                    if (field.type === "INFANT" && age >= 2) {
                      return "Bebê deve ter menos de 2 anos";
                    }
                    return true;
                  },
                })}
              />
            </div>
          </div>
        );
      })}

      <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
        Continuar para pagamento
      </Button>
    </form>
  );
}
