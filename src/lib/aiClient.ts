/**
 * Calls the Express `/api/ai` route (same origin when using `npm run dev`).
 */
export async function postAi(body: { 
  text?: string; 
  imageBase64?: string;
  history?: any[];
}): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: body.text,
      imageBase64: body.imageBase64,
      history: body.history
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || `Chat failed (${res.status})`);
  }
  if (typeof json?.reply === 'string') return json.reply;
  throw new Error('Invalid chat response');
}
