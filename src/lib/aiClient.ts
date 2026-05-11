/**
 * Calls the Express `/api/ai` route (same origin when using `npm run dev`).
 */
export async function postAi(body: { 
  text?: string; 
  imageBase64?: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof json?.details === 'string' ? json.details : '';
    throw new Error(json?.error || detail || `AI request failed (${res.status})`);
  }
  if (typeof json?.result === 'string') return json.result;
  throw new Error('Invalid AI response');
}
