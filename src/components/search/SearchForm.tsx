"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeftRight } from "lucide-react";
import { clsx } from "clsx";
import AirportInput from "./AirportInput";
import DatePicker from "./DatePicker";
import PassengerSelector from "./PassengerSelector";
import type { AirportSuggestion, SearchParams } from "@/types";

interface SearchFormValues {
  origin: string;
  originIata: string;
  destination: string;
  destinationIata: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  tripType: "oneway" | "roundtrip" | "multicity";
  cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
}

type TripType = "oneway" | "roundtrip" | "multicity";

const TRIP_TABS: { value: TripType; label: string }[] = [
  { value: "roundtrip", label: "Ida e volta" },
  { value: "oneway", label: "Somente ida" },
  { value: "multicity", label: "Múltiplas cidades" },
];

const CABIN_OPTIONS: { value: SearchParams["cabinClass"]; label: string }[] = [
  { value: "ECONOMY", label: "Econômica" },
  { value: "PREMIUM_ECONOMY", label: "Econômica Premium" },
  { value: "BUSINESS", label: "Executiva" },
  { value: "FIRST", label: "Primeira Classe" },
];

interface SearchFormProps {
  onSearch?: (params: SearchParams) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [tripType, setTripType] = useState<TripType>("roundtrip");

  const { control, handleSubmit, setValue, watch } =
    useForm<SearchFormValues>({
      defaultValues: {
        tripType: "roundtrip",
        cabinClass: "ECONOMY",
        adults: 1,
        children: 0,
        infants: 0,
        departureDate: "",
        returnDate: "",
        origin: "",
        originIata: "",
        destination: "",
        destinationIata: "",
      },
    });

  const watchedValues = watch();

  function handleOriginSelect(airport: AirportSuggestion) {
    setValue("origin", airport.name, { shouldValidate: true });
    setValue("originIata", airport.iataCode, { shouldValidate: true });
  }

  function handleDestinationSelect(airport: AirportSuggestion) {
    setValue("destination", airport.name, { shouldValidate: true });
    setValue("destinationIata", airport.iataCode, { shouldValidate: true });
  }

  function swapAirports() {
    const origin = watchedValues.originIata;
    const originName = watchedValues.origin;
    const dest = watchedValues.destinationIata;
    const destName = watchedValues.destination;
    setValue("originIata", dest);
    setValue("origin", destName);
    setValue("destinationIata", origin);
    setValue("destination", originName);
  }

  function onSubmit(data: SearchFormValues) {
    const params: SearchParams = {
      origin: data.originIata,
      destination: data.destinationIata,
      departureDate: data.departureDate,
      returnDate: tripType === "roundtrip" ? data.returnDate : undefined,
      adults: data.adults,
      children: data.children,
      infants: data.infants,
      tripType,
      cabinClass: data.cabinClass,
    };
    onSearch?.(params);
  }

  const cellLabel = (text: string) => (
    <p className="font-sans text-[10px] uppercase tracking-[0.8px] text-ink-400 mb-2">
      {text}
    </p>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-ink-900 border border-ink-700 w-full">

      {/* Trip type tabs */}
      <div className="flex border-b border-ink-700 px-1 pt-1">
        {TRIP_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setTripType(tab.value);
              setValue("tripType", tab.value);
            }}
            className={clsx(
              "font-sans text-[10px] uppercase tracking-widest py-2.5 px-3 -mb-px border-b-2 transition-colors duration-150",
              tripType === tab.value
                ? "border-gold text-gold"
                : "border-transparent text-ink-500 hover:text-ink-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Row 1: Origin | Destination | Departure | Return */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-ink-700">

        {/* Origin */}
        <div className="p-4 border-r border-ink-700 relative">
          {cellLabel("Origem")}
          <Controller
            name="originIata"
            control={control}
            render={() => (
              <AirportInput
                value={watchedValues.origin ?? ""}
                onChange={handleOriginSelect}
                placeholder="Cidade ou aeroporto"
              />
            )}
          />
        </div>

        {/* Destination — swap button sits on the divider */}
        <div className="p-4 md:border-r border-ink-700 relative">
          {cellLabel("Destino")}
          <Controller
            name="destinationIata"
            control={control}
            render={() => (
              <AirportInput
                value={watchedValues.destination ?? ""}
                onChange={handleDestinationSelect}
                placeholder="Cidade ou aeroporto"
              />
            )}
          />
          <button
            type="button"
            onClick={swapAirports}
            title="Inverter origem e destino"
            className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-10 bg-ink-800 border border-ink-600 p-1.5 hover:bg-ink-700 transition-colors hidden md:flex items-center justify-center"
            style={{ borderRadius: "2px" }}
          >
            <ArrowLeftRight size={11} className="text-ink-400" />
          </button>
        </div>

        {/* Departure */}
        <div className="p-4 border-r border-ink-700 border-t md:border-t-0">
          {cellLabel("Ida")}
          <Controller
            name="departureDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="dd/mm/aaaa"
                minDate={new Date()}
              />
            )}
          />
        </div>

        {/* Return */}
        <div className="p-4 border-t md:border-t-0">
          {cellLabel("Volta")}
          <Controller
            name="returnDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="dd/mm/aaaa"
                disabled={tripType !== "roundtrip"}
                minDate={
                  watchedValues.departureDate
                    ? new Date(watchedValues.departureDate)
                    : new Date()
                }
              />
            )}
          />
        </div>
      </div>

      {/* Row 2: Passengers | Cabin | Search button */}
      <div className="grid grid-cols-2 md:grid-cols-4">

        {/* Passengers */}
        <div className="p-4 border-r border-ink-700">
          {cellLabel("Passageiros")}
          <Controller
            name="adults"
            control={control}
            render={({ field }) => (
              <PassengerSelector
                value={{
                  adults: field.value,
                  children: watchedValues.children ?? 0,
                  infants: watchedValues.infants ?? 0,
                }}
                onChange={(counts) => {
                  setValue("adults", counts.adults);
                  setValue("children", counts.children);
                  setValue("infants", counts.infants);
                }}
              />
            )}
          />
        </div>

        {/* Cabin class */}
        <div className="p-4 md:border-r border-ink-700">
          {cellLabel("Classe")}
          <Controller
            name="cabinClass"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full bg-transparent text-ink-100 text-sm font-sans py-1 outline-none cursor-pointer appearance-none border-0"
              >
                {CABIN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-ink-100 bg-ink-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* CTA — spans 2 columns */}
        <div className="col-span-2 p-3 flex items-center border-t md:border-t-0 border-ink-700 md:border-l">
          <button
            type="submit"
            className="w-full bg-gold text-ink-950 font-sans text-[11px] uppercase tracking-[1.2px] py-4 hover:bg-gold-light transition-colors duration-200"
          >
            Consultar tarifas
          </button>
        </div>
      </div>
    </form>
  );
}
