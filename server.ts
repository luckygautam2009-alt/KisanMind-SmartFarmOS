import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Accept raw base64 or a data URL (`data:image/png;base64,...`). */
function parseImageInput(raw: string | undefined): { mimeType: string; data: string } | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  const dataUrl = trimmed.match(/^data:([^;]+);base64,([\s\S]+)$/i);
  if (dataUrl) {
    return { mimeType: dataUrl[1] || 'image/jpeg', data: dataUrl[2].replace(/\s/g, '') };
  }
  return { mimeType: 'image/jpeg', data: trimmed.replace(/\s/g, '') };
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Global Logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API REQUEST] ${req.method} ${req.path}`);
    }
    next();
  });

  // Initialize Groq AI
  const groqKey = process.env.GROQ_API_KEY;
  console.log(`Server Startup: GROQ_API_KEY detected? ${!!groqKey} (${groqKey?.substring(0, 5)}...)`);

  const groq = new Groq({ apiKey: groqKey || "MISSING_KEY" });
  const hasGroq = !!groqKey && groqKey.startsWith("gsk_");

  // API Route: AI Agent for General Questions and Crop Scanning (GROQ ONLY)
  app.post(["/api/chat", "/api/ai"], async (req, res) => {
    try {
      const { message, text: oldText, imageBase64, history } = req.body;
      const text = message || oldText;
      
      console.log(`Chat Request: text="${text?.substring(0, 50)}...", hasImage=${!!imageBase64}`);

      if (!hasGroq) {
         return res.json({ error: "⚠️ **Groq API Key Missing**: Please add your `GROQ_API_KEY` to the `.env` file to enable the chatbot." });
      }

      const parsedImg = parseImageInput(imageBase64);
      const messages: any[] = [
        { role: "system", content: "You are KisanMind AI, an elite agricultural autonomous agent. Act brilliant, technical, and empathetic to farmers. Use detailed Markdown. Identify exact causes, fertilizers, and treatments. Always maintain context of the conversation." }
      ];

      // Add history if present
      if (Array.isArray(history) && history.length > 0) {
        history.forEach(h => {
          if (h.parts && h.parts[0] && h.parts[0].text) {
            messages.push({ 
              role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user', 
              content: h.parts[0].text 
            });
          }
        });
      }

      // Add current message
      if (parsedImg) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: text || "Analyze this crop image." },
            { type: "image_url", image_url: { url: `data:${parsedImg.mimeType};base64,${parsedImg.data}` } }
          ]
        });
      } else {
        messages.push({ role: "user", content: text || "Hello" });
      }

      const completion = await groq.chat.completions.create({
        messages,
        model: parsedImg ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
      });

      const replyContent = completion.choices[0]?.message?.content || "I couldn't generate a response.";
      res.json({ 
        reply: replyContent,
        result: replyContent 
      });

    } catch (e: any) {
      console.error("CHAT ROUTE ERROR:", e);
      const errorMsg = e?.message || String(e);
      if (errorMsg.includes("401") || errorMsg.includes("invalid_api_key")) {
         return res.json({ error: `⚠️ **Invalid Groq API Key**: The key provided is invalid. Please check your .env file. \n\nDetails: ${errorMsg}` });
      }
      res.status(500).json({ error: "Failed to process chat request.", details: errorMsg });
    }
  });

  // API Route: AI Mandi Price Prediction (GROQ ONLY)
  app.post("/api/mandi", async (req, res) => {
    try {
      const { city, state, crop, isSearch } = req.body;
      const c = city || 'Local Area';
      const s = state || 'India';
      
      // If the user typed a state in the city box, we treat it as a regional search
      const locationLabel = (c.toLowerCase() === s.toLowerCase()) ? s : `${c}, ${s}`;
      const targetCrop = crop ? `specifically for ${crop} and other related crops` : 'at least 15 key crops relevant to that region';
      
      console.log(`Mandi Request: location=${locationLabel}, crop=${crop || 'All'}, isSearch=${isSearch}`);

      if (!hasGroq) {
         const mockData = [
           { crop: 'Wheat (Sharbati)', category: 'Crops', market: `${c} Principal Mandi`, price: 2450, trend: 'up', change: '+2.4%', date: 'Live', distance: '12 km' },
           { crop: 'Soybean (Yellow)', category: 'Crops', market: `${c} Krishi Upaj Mandi`, price: 4200, trend: 'down', change: '-1.2%', date: 'Live', distance: '15 km' },
           { crop: 'Mustard', category: 'Crops', market: `${c} APMC`, price: 5120, trend: 'stable', change: '0.0%', date: 'Live', distance: '4 km' },
           { crop: 'Cotton', category: 'Crops', market: `${c} Regional Mandi`, price: 7120, trend: 'up', change: '+1.5%', date: 'Live', distance: '22 km' },
           { crop: 'Paddy (Basmati)', category: 'Crops', market: `${c} APMC`, price: 3800, trend: 'up', change: '+3.1%', date: 'Live', distance: '8 km' },
           { crop: 'Tomato (Desi)', category: 'Vegetables', market: `${c} Sabzi Mandi`, price: 1800, trend: 'stable', change: '0.0%', date: 'Live', distance: '5 km' },
           { crop: 'Onion', category: 'Vegetables', market: `${c} Main Market`, price: 3400, trend: 'up', change: '+8.1%', date: 'Live', distance: '8 km' },
           { crop: 'Potato', category: 'Vegetables', market: `${c} Sabzi Mandi`, price: 1200, trend: 'down', change: '-2.0%', date: 'Live', distance: '5 km' },
           { crop: 'Mango', category: 'Fruits', market: `${c} Fruit Market`, price: 4500, trend: 'stable', change: '0.0%', date: 'Live', distance: '10 km' }
         ];
         return res.json({ data: mockData });
      }

      const itemCount = isSearch ? '1 to 2' : 'at least 15';

      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert Indian agricultural market analyst. Generate realistic, live Mandi price data based on the latest Agmarknet trends. Return a JSON object with a 'data' array of items. Focus EXCLUSIVELY on crops, vegetables, and fruits. DO NOT include dairy or milk." },
          { role: "user", content: `Generate realistic live mandi prices for ${locationLabel}, focusing ${targetCrop}. 
          Requirements:
          1. Provide ${itemCount} items total.
          2. Fields per item: 
             - crop: (string) name of the crop
             - category: (string) 'Crops', 'Vegetables', or 'Fruits'
             - market: (string) name of the mandi in or near ${locationLabel}
             - price: (NUMBER) current rate per quintal (NO COMMAS, NO CURRENCY SYMBOLS, MUST BE A NUMBER)
             - trend: (string) 'up', 'down', or 'stable'
             - change: (string) e.g. '+2.5%'
             - date: (string) 'Live'
             - distance: (string) e.g. '5 km'
          3. Ensure prices are realistic for ${locationLabel}.
          4. Return ONLY valid JSON.` }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      let content = completion.choices[0]?.message?.content || '{"data":[]}';
      let parsed = JSON.parse(content);
      
      // Ensure price is always a number
      const cleanData = (parsed.data || parsed.prices || parsed.items || []).map((item: any) => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price
      }));

      res.json({ data: cleanData });

    } catch (e: any) {
      console.error("Mandi API Error:", e);
      res.json({ data: [] });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { contact } = req.body;
      if (!contact) return res.status(400).json({ error: "Contact information is required." });
      console.log(`New subscription: ${contact}`);
      res.json({ message: "Successfully subscribed!" });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to process subscription." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (GROQ ACTIVE)`);
  });
}

startServer();
