import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ParsedIntent =
  | { type: "destination_search"; destination: string; tripDays: number[] }
  | { type: "vacation_search"; startDate: string; endDate: string; regions?: string[] }
  | { type: "unknown"; message: string };

export async function parseUserIntent(userMessage: string): Promise<ParsedIntent> {
  const today = new Date().toISOString().split("T")[0];
  const yearEnd = `${new Date().getFullYear()}-12-31`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: `你是旅遊助理，負責解析使用者的旅遊意圖。今天日期：${today}。
請以 JSON 格式回應，不要有其他文字。

可能的意圖類型：
1. destination_search：使用者想去特定地方（如「我想去韓國」）
   → { "type": "destination_search", "destination": "目的地名稱（中文）", "tripDays": [3,4,5,6,7] }
   tripDays 預設為 [3,4,5,6,7]，若使用者有指定天數則只填對應天數

2. vacation_search：使用者有特定假期想出發（如「7月10號到15號我有空」）
   → { "type": "vacation_search", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "regions": ["東南亞","東北亞"] }
   regions 可包含：東南亞、東北亞、歐洲、美洲、大洋洲，若未指定則為 null
   若使用者只說「我有假期」沒說區域，regions 設為 null

3. unknown：無法解析
   → { "type": "unknown", "message": "請使用者提供更多資訊的提示" }`,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = (response.content[0] as { type: string; text: string }).text.trim();
  try {
    return JSON.parse(text) as ParsedIntent;
  } catch {
    return { type: "unknown", message: "無法解析您的需求，請重新描述。" };
  }
}

export async function generateFlightSummary(data: unknown, intent: ParsedIntent): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: "你是旅遊顧問，用親切繁體中文回覆，重點突出最便宜的選項。使用 emoji 讓回覆更生動。",
    messages: [
      {
        role: "user",
        content: `根據以下搜尋結果，給使用者一個友善的摘要建議：
意圖：${JSON.stringify(intent)}
搜尋結果：${JSON.stringify(data)}`,
      },
    ],
  });
  return (response.content[0] as { type: string; text: string }).text;
}
