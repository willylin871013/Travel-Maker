"use client";

import { Plane, Clock, TrendingDown } from "lucide-react";

interface FlightResult {
  price: number;
  currency: string;
  departureDate: string;
  returnDate: string;
  duration: number;
  airline: string;
  stops: number;
  priceLevel?: string;
}

interface FlightData {
  destination: { name: string; country: string; code: string };
  results: FlightResult[];
  searchedUntil: string;
}

function priceBadge(level?: string) {
  if (level === "low") return "bg-green-100 text-green-700";
  if (level === "high") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

function priceLevelText(level?: string) {
  if (level === "low") return "低於均價 🔥";
  if (level === "high") return "高於均價";
  return "正常均價";
}

export default function FlightResults({ data }: { data: FlightData }) {
  if (!data?.results?.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Plane size={14} />
        <span>
          {data.destination.name}（{data.destination.code}）最便宜機票
        </span>
      </div>
      <div className="space-y-2">
        {data.results.slice(0, 6).map((r, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 border ${i === 0 ? "border-green-300 bg-green-50" : "border-gray-100 bg-gray-50"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-base">
                  {r.currency} {r.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <Clock size={11} />
                  {r.departureDate} → {r.returnDate}（{r.duration} 天）
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {r.airline} · {r.stops === 0 ? "直飛" : `${r.stops} 轉`}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {i === 0 && (
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                    最便宜
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full ${priceBadge(r.priceLevel)}`}>
                  {priceLevelText(r.priceLevel)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">搜尋範圍：今天 → {data.searchedUntil}</p>
    </div>
  );
}
