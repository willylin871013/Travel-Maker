export interface Destination {
  code: string;
  name: string;
  nameEn: string;
  country: string;
  region: string;
  keywords: string[];
}

export const POPULAR_DESTINATIONS: Destination[] = [
  { code: "ICN", name: "首爾", nameEn: "Seoul", country: "韓國", region: "東北亞", keywords: ["韓國", "首爾", "korea", "seoul"] },
  { code: "NRT", name: "東京", nameEn: "Tokyo", country: "日本", region: "東北亞", keywords: ["日本", "東京", "japan", "tokyo"] },
  { code: "KIX", name: "大阪", nameEn: "Osaka", country: "日本", region: "東北亞", keywords: ["大阪", "osaka", "關西"] },
  { code: "CTS", name: "北海道", nameEn: "Hokkaido", country: "日本", region: "東北亞", keywords: ["北海道", "hokkaido", "札幌"] },
  { code: "HKG", name: "香港", nameEn: "Hong Kong", country: "香港", region: "東南亞", keywords: ["香港", "hong kong"] },
  { code: "BKK", name: "曼谷", nameEn: "Bangkok", country: "泰國", region: "東南亞", keywords: ["泰國", "曼谷", "thailand", "bangkok"] },
  { code: "HKT", name: "普吉島", nameEn: "Phuket", country: "泰國", region: "東南亞", keywords: ["普吉", "phuket"] },
  { code: "SIN", name: "新加坡", nameEn: "Singapore", country: "新加坡", region: "東南亞", keywords: ["新加坡", "singapore"] },
  { code: "KUL", name: "吉隆坡", nameEn: "Kuala Lumpur", country: "馬來西亞", region: "東南亞", keywords: ["馬來西亞", "吉隆坡", "malaysia"] },
  { code: "MNL", name: "馬尼拉", nameEn: "Manila", country: "菲律賓", region: "東南亞", keywords: ["菲律賓", "馬尼拉", "philippines"] },
  { code: "CEB", name: "宿霧", nameEn: "Cebu", country: "菲律賓", region: "東南亞", keywords: ["宿霧", "cebu"] },
  { code: "DPS", name: "峇里島", nameEn: "Bali", country: "印尼", region: "東南亞", keywords: ["峇里", "巴厘", "bali"] },
  { code: "SGN", name: "胡志明市", nameEn: "Ho Chi Minh City", country: "越南", region: "東南亞", keywords: ["越南", "胡志明", "vietnam"] },
  { code: "HAN", name: "河內", nameEn: "Hanoi", country: "越南", region: "東南亞", keywords: ["河內", "hanoi"] },
  { code: "DAD", name: "峴港", nameEn: "Da Nang", country: "越南", region: "東南亞", keywords: ["峴港", "danang", "da nang"] },
  { code: "NHA", name: "芽莊", nameEn: "Nha Trang", country: "越南", region: "東南亞", keywords: ["芽莊", "nha trang"] },
  { code: "PNH", name: "金邊", nameEn: "Phnom Penh", country: "柬埔寨", region: "東南亞", keywords: ["柬埔寨", "金邊"] },
  { code: "REP", name: "暹粒", nameEn: "Siem Reap", country: "柬埔寨", region: "東南亞", keywords: ["暹粒", "吳哥", "angkor"] },
  { code: "PEK", name: "北京", nameEn: "Beijing", country: "中國", region: "東北亞", keywords: ["北京", "beijing"] },
  { code: "PVG", name: "上海", nameEn: "Shanghai", country: "中國", region: "東北亞", keywords: ["上海", "shanghai"] },
  { code: "CAN", name: "廣州", nameEn: "Guangzhou", country: "中國", region: "東北亞", keywords: ["廣州", "guangzhou"] },
  { code: "LHR", name: "倫敦", nameEn: "London", country: "英國", region: "歐洲", keywords: ["倫敦", "英國", "london", "uk"] },
  { code: "CDG", name: "巴黎", nameEn: "Paris", country: "法國", region: "歐洲", keywords: ["巴黎", "法國", "paris", "france"] },
  { code: "FCO", name: "羅馬", nameEn: "Rome", country: "義大利", region: "歐洲", keywords: ["羅馬", "義大利", "rome", "italy"] },
  { code: "BCN", name: "巴塞隆納", nameEn: "Barcelona", country: "西班牙", region: "歐洲", keywords: ["巴塞隆納", "barcelona", "spain"] },
  { code: "LAX", name: "洛杉磯", nameEn: "Los Angeles", country: "美國", region: "美洲", keywords: ["洛杉磯", "la", "los angeles"] },
  { code: "JFK", name: "紐約", nameEn: "New York", country: "美國", region: "美洲", keywords: ["紐約", "new york", "nyc"] },
  { code: "SYD", name: "雪梨", nameEn: "Sydney", country: "澳洲", region: "大洋洲", keywords: ["雪梨", "澳洲", "sydney", "australia"] },
];

export function findDestination(query: string): Destination | undefined {
  const q = query.toLowerCase();
  return POPULAR_DESTINATIONS.find((d) =>
    d.keywords.some((kw) => q.includes(kw.toLowerCase())) ||
    d.code.toLowerCase() === q
  );
}
