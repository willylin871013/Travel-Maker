import { NextRequest, NextResponse } from "next/server";
import { searchCheapestDates } from "@/lib/serpapi";
import { findDestination } from "@/lib/destinations";

export async function POST(req: NextRequest) {
  const { destination, tripDays } = await req.json();

  const dest = findDestination(destination);
  if (!dest) {
    return NextResponse.json({ error: `找不到目的地：${destination}` }, { status: 400 });
  }

  const today = new Date();
  const yearEnd = new Date(`${today.getFullYear()}-12-31`);

  try {
    const results = await searchCheapestDates(dest.code, tripDays, today, yearEnd);
    return NextResponse.json({
      destination: dest,
      results: results.slice(0, 10),
      searchedUntil: yearEnd.toISOString().split("T")[0],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
