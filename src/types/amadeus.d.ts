declare module "amadeus" {
  interface AmadeusConfig {
    clientId: string;
    clientSecret: string;
    hostname?: "test" | "production";
    logLevel?: "debug" | "warn" | "silent";
  }

  interface AmadeusResponse {
    data: any[];
    status: number;
    result: unknown;
  }

  interface FlightOffersSearch {
    get(params: Record<string, string | number>): Promise<AmadeusResponse>;
  }

  interface Shopping {
    flightOffersSearch: FlightOffersSearch;
  }

  interface Locations {
    get(params: Record<string, string | number>): Promise<AmadeusResponse>;
  }

  interface ReferenceData {
    locations: Locations;
  }

  class Amadeus {
    constructor(config: AmadeusConfig);
    shopping: Shopping;
    referenceData: ReferenceData;
  }

  export = Amadeus;
}
