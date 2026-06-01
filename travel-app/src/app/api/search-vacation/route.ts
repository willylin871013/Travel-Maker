import { NextRequest, NextResponse } from "next/server";
import { searchDestinationsByDates } from "@/lib/serpapi";
import { POPULAR_DESTINATIONS } from "@/lib/destinations";

export async function POST(req: NextRequest) {
  const { startDate, endDate, regions } = await req.json();

  let destinations = POPULAR_DESTINATIONS;
  if (regions && regions.length > 0) {
    destinations = destinations.filter((d) => regions.includes(d.region));
  }

  // Limit to top 12 to avoid too many API calls
  const top12 = destinations.slice(0, 12).map((d) => ({ code: d.code, name: d.name }));

  try {
    const results = await searchDestinationsByDates(startDate, endDate, top12);
    return NextResponse.json({ results, startDate, endDate });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
