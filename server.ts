import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
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

  // Initialize AI clients
  const apiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  
  console.log(`Server Startup: GEMINI_API_KEY detected? ${!!apiKey} (${apiKey?.substring(0, 5)}...)`);
  console.log(`Server Startup: GROQ_API_KEY detected? ${!!groqKey} (${groqKey?.substring(0, 5)}...)`);

  const genAI = new GoogleGenAI({ apiKey: apiKey || "MISSING_KEY" });
  const groq = new Groq({ apiKey: groqKey || "MISSING_KEY" });

  const hasGemini = !!apiKey && apiKey.length > 20 && !apiKey.includes("MY_GEMINI");
  const hasGroq = !!groqKey && groqKey.startsWith("gsk_");

  // API Route: AI Agent for General Questions and Crop Scanning
  app.post("/api/ai", async (req, res) => {
    try {
      const { text, imageBase64, history } = req.body;
      
      // Debug logs to terminal
      console.log(`AI Request: text="${text?.substring(0, 50)}...", hasImage=${!!imageBase64}`);
      
      console.log(`AI Route Status: hasGemini=${hasGemini}, hasGroq=${hasGroq}`);

      // 1. Demo Mode Fallback
      if (!hasGemini && !hasGroq) {
         console.log("Both keys missing, falling back to Demo Mode.");
         if (text && text.includes('Timetable')) {
            return res.json({ result: "## AI Farm Timetable (Demo Mode)\n\n**Day 1-3:** Apply recommended fungicide in early morning.\n**Day 4:** Apply 20-10-10 NPK Fertilizer.\n**Day 5-7:** Wait and observe. Maintain normal basal watering.\n\n*Note: To activate live AI, add your GEMINI_API_KEY or GROQ_API_KEY to .env*" });
         }
         return res.json({ result: "I am currently in Demo Mode. To activate my live crop intelligence and voice assistant, please add your GEMINI_API_KEY or GROQ_API_KEY in the AI Studio Settings / Secrets panel!" });
      }

      // 2. Groq Priority
      if (hasGroq) {
        try {
          console.log("Attempting Groq Request...");
          const parsedImg = parseImageInput(imageBase64);
          
          const messages: any[] = [
            { role: "system", content: "You are KisanMind AI, an elite agricultural autonomous agent. Act brilliant, technical, and empathetic to farmers. Use detailed Markdown. Always maintain context." }
          ];

          // Add history if present
          if (Array.isArray(history) && history.length > 0) {
            history.forEach(h => {
              if (h.parts && h.parts[0] && h.parts[0].text) {
                messages.push({ 
                  role: h.role === 'model' ? 'assistant' : 'user', 
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

          const reply = completion.choices[0]?.message?.content;
          if (reply) {
            console.log("Groq Success!");
            return res.json({ result: reply });
          }
          throw new Error("Empty response from Groq");
        } catch (groqErr: any) {
          console.error("Groq Failed, falling back to Gemini if available:", groqErr.message);
          if (!hasGemini) throw groqErr; // If no Gemini, throw to catch block
          // Else continue to Gemini below
        }
      }

      // 3. Gemini Fallback
      console.log("Attempting Gemini Request...");
      const parts: any[] = [];
      const parsedImg = parseImageInput(imageBase64);
      if (parsedImg) {
        parts.push({
          inlineData: {
            mimeType: parsedImg.mimeType,
            data: parsedImg.data,
          },
        });
      }
      if (text) parts.push({ text });

      const contents = Array.isArray(history) ? [...history] : [];
      contents.push({ role: "user", parts });

      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
        config: {
          systemInstruction: "You are KisanMind AI, an elite agricultural autonomous agent. Act brilliant, technical, and empathetic to farmers. Use detailed Markdown. Identify exact causes, fertilizers, and treatments. Always maintain context of the conversation.",
        }
      });

      console.log("Gemini Success!");
      res.json({ result: result.text });
    } catch (e: any) {
      console.error("AI ROUTE FATAL ERROR:", e);
      const errorMsg = e?.message || String(e);
      
      // If it's an auth error, show the nice demo message
      if (errorMsg.includes("API key not valid") || errorMsg.includes("401") || errorMsg.includes("invalid_api_key")) {
         return res.json({ result: `⚠️ **AI Authentication Error**: Your API key seems invalid. \n\n**Error Details**: ${errorMsg}\n\nPlease check your .env file.` });
      }
      
      res.status(500).json({ error: "Failed to process AI request.", details: errorMsg });
    }
  });

  // API Route: AI Mandi Price Prediction / Generation
  app.post("/api/mandi", async (req, res) => {
    try {
      const { city, state, crop } = req.body;
      const c = city || 'Local Area';
      const s = state || 'India';
      const targetCrop = crop ? `specifically for ${crop} and other related crops` : 'at least 15 key crops relevant to that region';
      
      if (!hasGemini && !hasGroq) {
         const mockData = [
           { crop: 'Wheat (Sharbati)', category: 'Crops', market: `${c} Principal Mandi`, price: 2450, trend: 'up', change: '+2.4%', date: 'Live', distance: '12 km' },
           { crop: 'Soybean (Yellow)', category: 'Crops', market: `${c} Krishi Upaj Mandi`, price: 4200, trend: 'down', change: '-1.2%', date: 'Live', distance: '15 km' },
           { crop: 'Mustard', category: 'Crops', market: `${c} APMC`, price: 5120, trend: 'stable', change: '0.0%', date: 'Live', distance: '4 km' },
           { crop: 'Cotton', category: 'Crops', market: `${c} Regional Mandi`, price: 7120, trend: 'up', change: '+1.5%', date: 'Live', distance: '22 km' },
           { crop: 'Paddy (Basmati)', category: 'Crops', market: `${c} APMC`, price: 3800, trend: 'up', change: '+3.1%', date: 'Live', distance: '8 km' },
           { crop: 'Tomato (Desi)', category: 'Vegetables', market: `${c} Sabzi Mandi`, price: 1800, trend: 'stable', change: '0.0%', date: 'Live', distance: '5 km' },
           { crop: 'Onion', category: 'Vegetables', market: `${c} Main Market`, price: 3400, trend: 'up', change: '+8.1%', date: 'Live', distance: '8 km' },
           { crop: 'Potato', category: 'Vegetables', market: `${c} Sabzi Mandi`, price: 1200, trend: 'down', change: '-2.0%', date: 'Live', distance: '5 km' },
           { crop: 'Mango', category: 'Fruits', market: `${c} Fruit Market`, price: 4500, trend: 'stable', change: '0.0%', date: 'Live', distance: '10 km' },
           { crop: 'Banana', category: 'Fruits', market: `${c} Fruit Market`, price: 1500, trend: 'down', change: '-1.5%', date: 'Live', distance: '10 km' },
           { crop: 'Milk (Buffalo)', category: 'Dairy', market: `${c} Dairy Coop`, price: 5500, trend: 'stable', change: '0.0%', date: 'Live', distance: '2 km' },
           { crop: 'Milk (Cow)', category: 'Dairy', market: `${c} Dairy Coop`, price: 4800, trend: 'up', change: '+1.0%', date: 'Live', distance: '2 km' }
         ];
         
         let filteredMock = [...mockData];
         if (crop) {
           const found = mockData.find(m => m.crop.toLowerCase().includes(crop.toLowerCase()));
           if (found) {
             filteredMock = [found, ...mockData.filter(m => m !== found)];
           } else {
             filteredMock = [{ 
               crop: crop.charAt(0).toUpperCase() + crop.slice(1), 
               category: 'Crops', 
               market: `${c} Market`, 
               price: 2500 + Math.random() * 2000, 
               trend: 'up', 
               change: '+0.5%', 
               date: 'Live', 
               distance: '5 km' 
             }, ...mockData];
           }
         }
         
         return res.json({ data: filteredMock });
      }

      if (hasGroq) {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are an agricultural market data simulator. Generate a realistic JSON response containing current mandi prices, trends, distances, and crops. Reply ONLY with valid JSON." },
            { role: "user", content: `Run a simulated LightGBM regression model based on current dynamic Agmarknet market data to predict realistic mandi prices for ${city || 'local area'}, ${state || 'India'}. Return highly accurate predictions ${targetCrop}. Include trend, distance, and 80-90% confidence score. List at least 15 items total.` }
          ],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" }
        });
        const content = completion.choices[0]?.message?.content || "[]";
        // Groq might return the array directly or inside a property. We expect an array based on original code schema.
        // But the original code used a schema that forced an array.
        const parsed = JSON.parse(content);
        return res.json({ data: Array.isArray(parsed) ? parsed : (parsed.data || []) });
      }

      // Gemini Fallback
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Run a simulated LightGBM regression model based on current dynamic Agmarknet market data to predict realistic mandi prices for ${city || 'local area'}, ${state || 'India'}. Return highly accurate predictions ${targetCrop}. Include trend, distance, and 80-90% confidence score. List at least 15 items total.`,
        config: {
          systemInstruction: "You are an agricultural market data simulator. Generate a realistic JSON response containing current mandi prices, trends, distances, and crops. Reply ONLY with valid JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                crop: { type: "STRING" },
                category: { type: "STRING", enum: ["Crops", "Vegetables", "Fruits", "Dairy"] },
                market: { type: "STRING" },
                price: { type: "NUMBER" },
                trend: { type: "STRING" },
                change: { type: "STRING" },
                date: { type: "STRING" },
                distance: { type: "STRING" }
              },
              required: ["crop", "category", "market", "price", "trend", "change", "date", "distance"]
            }
          }
        }
      });

      const text = result.text;
      res.json({ data: JSON.parse(text) });
    } catch (e: any) {
      console.error("Mandi API Error:", e);
      // Fallback for API errors
      const c = req.body.city || 'Local Area';
      const mockData = [
        { crop: 'Wheat (Sharbati)', category: 'Crops', market: `${c} Principal Mandi`, price: 2450, trend: 'up', change: '+2.4%', date: 'Live', distance: '12 km' },
        { crop: 'Soybean (Yellow)', category: 'Crops', market: `${c} Krishi Upaj Mandi`, price: 4200, trend: 'down', change: '-1.2%', date: 'Live', distance: '15 km' },
        { crop: 'Mustard', category: 'Crops', market: `${c} APMC`, price: 5120, trend: 'stable', change: '0.0%', date: 'Live', distance: '4 km' },
        { crop: 'Cotton', category: 'Crops', market: `${c} Regional Mandi`, price: 7120, trend: 'up', change: '+1.5%', date: 'Live', distance: '22 km' },
        { crop: 'Paddy (Basmati)', category: 'Crops', market: `${c} APMC`, price: 3800, trend: 'up', change: '+3.1%', date: 'Live', distance: '8 km' },
        { crop: 'Tomato (Desi)', category: 'Vegetables', market: `${c} Sabzi Mandi`, price: 1800, trend: 'stable', change: '0.0%', date: 'Live', distance: '5 km' },
        { crop: 'Onion', category: 'Vegetables', market: `${c} Main Market`, price: 3400, trend: 'up', change: '+8.1%', date: 'Live', distance: '8 km' },
        { crop: 'Potato', category: 'Vegetables', market: `${c} Sabzi Mandi`, price: 1200, trend: 'down', change: '-2.0%', date: 'Live', distance: '5 km' },
        { crop: 'Mango', category: 'Fruits', market: `${c} Fruit Market`, price: 4500, trend: 'stable', change: '0.0%', date: 'Live', distance: '10 km' },
        { crop: 'Banana', category: 'Fruits', market: `${c} Fruit Market`, price: 1500, trend: 'down', change: '-1.5%', date: 'Live', distance: '10 km' },
        { crop: 'Milk (Buffalo)', category: 'Dairy', market: `${c} Dairy Coop`, price: 5500, trend: 'stable', change: '0.0%', date: 'Live', distance: '2 km' },
        { crop: 'Milk (Cow)', category: 'Dairy', market: `${c} Dairy Coop`, price: 4800, trend: 'up', change: '+1.0%', date: 'Live', distance: '2 km' }
      ];
      res.json({ data: mockData });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { contact } = req.body;
      if (!contact) {
        return res.status(400).json({ error: "Contact information is required." });
      }

      // Server-side validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[0-9]{10,14}$/;
      if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
        return res.status(400).json({ error: "Invalid email or phone number format." });
      }

      console.log(`New subscription request: ${contact}`);
      // In a real app, save to DB here
      res.json({ message: "Successfully subscribed!" });
    } catch (e: any) {
      console.error("Subscription Error:", e);
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
