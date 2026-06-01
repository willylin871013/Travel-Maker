import { NextRequest, NextResponse } from "next/server";
import { parseUserIntent, generateFlightSummary } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const intent = await parseUserIntent(message);

    if (intent.type === "unknown") {
      return NextResponse.json({ intent, summary: intent.message, results: null });
    }

    let searchResults = null;
    let apiPath = "";

    if (intent.type === "destination_search") {
      apiPath = "/api/search-destination";
      const res = await fetch(new URL(apiPath, req.url), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          destination: intent.destination,
          tripDays: intent.tripDays,
        }),
      });
      searchResults = await res.json();
    } else if (intent.type === "vacation_search") {
      apiPath = "/api/search-vacation";
      const res = await fetch(new URL(apiPath, req.url), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          startDate: intent.startDate,
          endDate: intent.endDate,
          regions: intent.regions,
        }),
      });
      searchResults = await res.json();
    }

    const summary = await generateFlightSummary(searchResults, intent);

    return NextResponse.json({ intent, summary, results: searchResults });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
