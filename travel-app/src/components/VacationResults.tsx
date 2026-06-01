"use client";

import { MapPin, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface DestinationPrice {
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

interface VacationData {
  results: DestinationPrice[];
  startDate: string;
  endDate: string;
}

function PriceIcon({ level }: { level: string }) {
  if (level === "low") return <TrendingDown size={14} className="text-green-500" />;
  if (level === "high") return <TrendingUp size={14} className="text-red-400" />;
  return <Minus size={14} className="text-gray-400" />;
}

export default function VacationResults({ data }: { data: VacationData }) {
  if (!data?.results?.length) return null;

  const sorted = [...data.results].sort((a, b) => b.savingsPercent - a.savingsPercent);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin size={14} />
        <span>
          {data.startDate} → {data.endDate} 各目的地比較
        </span>
      </div>
      <div className="space-y-2">
        {sorted.slice(0, 8).map((d, i) => (
          <div
            key={d.destinationCode}
            className={`rounded-xl p-3 border ${i === 0 ? "border-green-300 bg-green-50" : "border-gray-100 bg-gray-50"}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PriceIcon level={d.priceLevel} />
                <div>
                  <div className="font-medium text-sm">
                    {d.destination}
                    <span className="text-xs text-gray-400 ml-1">({d.destinationCode})</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {d.airline} · 均價 {d.currency} {d.typicalLow.toLocaleString()}–{d.typicalHigh.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {d.currency} {d.price.toLocaleString()}
                </div>
                {d.savingsPercent > 0 ? (
                  <div className="text-xs text-green-600 font-medium">省 {d.savingsPercent}%</div>
                ) : d.savingsPercent < 0 ? (
                  <div className="text-xs text-red-400">貴 {Math.abs(d.savingsPercent)}%</div>
                ) : (
                  <div className="text-xs text-gray-400">均價</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
