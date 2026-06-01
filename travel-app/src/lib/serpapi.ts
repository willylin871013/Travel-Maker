const SERPAPI_KEY = process.env.SERPAPI_API_KEY || "";
const DEPARTURE = process.env.DEPARTURE_AIRPORT || "TPE";

export interface FlightResult {
  price: number;
  currency: string;
  departureDate: string;
  returnDate: string;
  duration: number; // days
  airline: string;
  stops: number;
  priceLevel?: string; // "low", "typical", "high"
  typicalPriceRange?: [number, number];
}

export interface DestinationPrice {
  destination: string;
  destinationCode: string;
  price: number;
  currency: string;
  priceLevel: string;
  typicalLow: number;
  typicalHigh: number;
  savingsPercent: number;
  departureDate: string;
  returnDate: string;
  airline: string;
}

async function fetchFlights(params: Record<string, string>): Promise<unknown> {
  const url = new URL("https://serpapi.com/search");
  url.searchParams.set("engine", "google_flights");
  url.searchParams.set("api_key", SERPAPI_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`);
  return res.json();
}

export async function searchCheapestDates(
  destinationCode: string,
  tripDays: number[],
  startDate: Date,
  endDate: Date
): Promise<FlightResult[]> {
  const results: FlightResult[] = [];

  // Use Google Flights calendar view to get price grid
  const data = await fetchFlights({
    departure_id: DEPARTURE,
    arrival_id: destinationCode,
    outbound_date: formatDate(startDate),
    return_date: formatDate(endDate),
    type: "1", // round trip
    currency: "TWD",
    hl: "zh-TW",
  }) as Record<string, unknown>;

  // Parse best flights
  const allFlights = [
    ...((data.best_flights as unknown[]) || []),
    ...((data.other_flights as unknown[]) || []),
  ] as Record<string, unknown>[];

  for (const flight of allFlights.slice(0, 20)) {
    const legs = flight.flights as Record<string, unknown>[] | undefined;
    if (!legs || legs.length === 0) continue;

    const firstLeg = legs[0] as Record<string, unknown>;
    const depDateStr = (firstLeg.departure_airport as Record<string, unknown>)?.time as string;
    if (!depDateStr) continue;

    const depDate = new Date(depDateStr);
    const price = flight.price as number;

    for (const days of tripDays) {
      const retDate = new Date(depDate);
      retDate.setDate(retDate.getDate() + days);
      if (retDate > endDate) continue;

      results.push({
        price,
        currency: "TWD",
        departureDate: formatDate(depDate),
        returnDate: formatDate(retDate),
        duration: days,
        airline: (firstLeg.airline as string) || "Unknown",
        stops: (flight.layovers as unknown[])?.length || 0,
        priceLevel: getPriceLevel(flight),
        typicalPriceRange: getTypicalRange(flight),
      });
    }
  }

  // Sort by price
  return results.sort((a, b) => a.price - b.price);
}

export async function searchDestinationsByDates(
  departureDate: string,
  returnDate: string,
  topDestinations: Array<{ code: string; name: string }>
): Promise<DestinationPrice[]> {
  const results: DestinationPrice[] = [];

  const destList = topDestinations;

  await Promise.allSettled(
    destList.map(async (dest) => {
      try {
        const data = await fetchFlights({
          departure_id: DEPARTURE,
          arrival_id: dest.code,
          outbound_date: departureDate,
          return_date: returnDate,
          type: "1",
          currency: "TWD",
          hl: "zh-TW",
        }) as Record<string, unknown>;

        const allFlights = [
          ...((data.best_flights as unknown[]) || []),
          ...((data.other_flights as unknown[]) || []),
        ] as Record<string, unknown>[];

        if (allFlights.length === 0) return;

        const cheapest = allFlights.reduce((min, f) =>
          (f.price as number) < (min.price as number) ? f : min
        );

        const price = cheapest.price as number;
        const range = getTypicalRange(cheapest);
        const typicalLow = range?.[0] || price;
        const typicalHigh = range?.[1] || price * 1.3;
        const typicalMid = (typicalLow + typicalHigh) / 2;
        const savingsPercent =
          typicalMid > 0 ? Math.round(((typicalMid - price) / typicalMid) * 100) : 0;

        const legs = cheapest.flights as Record<string, unknown>[];
        const firstLeg = legs?.[0] as Record<string, unknown>;

        results.push({
          destination: dest.name,
          destinationCode: dest.code,
          price,
          currency: "TWD",
          priceLevel: getPriceLevel(cheapest),
          typicalLow,
          typicalHigh,
          savingsPercent,
          departureDate,
          returnDate,
          airline: (firstLeg?.airline as string) || "Unknown",
        });
      } catch {
        // skip failed destinations
      }
    })
  );

  return results.sort((a, b) => b.savingsPercent - a.savingsPercent);
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getPriceLevel(flight: Record<string, unknown>): string {
  return (flight.price_insights as Record<string, unknown>)?.price_level as string || "typical";
}

function getTypicalRange(flight: Record<string, unknown>): [number, number] | undefined {
  const insights = flight.price_insights as Record<string, unknown>;
  if (!insights) return undefined;
  const range = insights.typical_price_range as number[];
  if (Array.isArray(range) && range.length >= 2) return [range[0], range[1]];
  return undefined;
}
