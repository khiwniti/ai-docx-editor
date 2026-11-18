// NVIDIA NIM (OpenAI-compatible) server-side helper.

const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NIM_MODEL = 'google/gemma-4-31b-it';

export async function nimChat(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured');

  const res = await fetch(`${NIM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: NIM_MODEL,
      messages,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens ?? 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`NIM error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/** Extract the first JSON object/array from model text (handles ```json fences). */
export function extractJson(text: string): any | null {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidates = [fenced?.[1], text];
  for (const c of candidates) {
    if (!c) continue;
    const start = c.search(/[[{]/);
    if (start === -1) continue;
    try {
      return JSON.parse(c.slice(start).trim());
    } catch {
      // fall through
    }
  }
  return null;
}
