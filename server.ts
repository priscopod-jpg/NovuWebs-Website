import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Streaming Chatbot with Gemini
app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback responses if API key is not configured or fails
  const getFallbackStream = (msg: string) => {
    const textLower = msg.toLowerCase();
    let responseText = "Thanks for asking! As Mike's Plumbing receptionist, I can certainly help you. Would you like to book an appointment with our team today?";
    
    if (textLower.includes("services") || textLower.includes("offer") || textLower.includes("what do you do")) {
      responseText = "We offer a full range of services including professional drain cleaning, emergency boiler repairs, hot water replacement, and fast 24/7 leak fixes. Would you like to schedule an appointment with one of our certified technicians?";
    } else if (textLower.includes("book") || textLower.includes("appointment") || textLower.includes("schedule")) {
      responseText = "I'd love to help you book! Can you please tell me your preferred day, time, and your best phone number? Once I have those details, our dispatcher will lock in your slot immediately.";
    } else if (textLower.includes("price") || textLower.includes("cost") || textLower.includes("how much")) {
      responseText = "Our emergency callouts start at just $79, which is fully credited toward any repair we do. We provide clear, upfront flat-rate pricing before we begin any work. Could I book a diagnostic visit for you?";
    } else if (textLower.includes("price card") || textLower.includes("plumber") || textLower.includes("emergency")) {
      responseText = "For emergency plumbing callouts, we are available 24/7! We guarantee responsive dispatch and flat-rate pricing with no hidden charges. Can I get your telephone number to have a plumber call you right now?";
    }

    return responseText;
  };

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    // Elegant chunk-by-chunk fallback stream for high-quality simulation
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const fallbackText = getFallbackStream(message);
    const words = fallbackText.split(" ");
    
    let index = 0;
    const sendNextWord = () => {
      if (index < words.length) {
        const chunkStr = words[index] + (index === words.length - 1 ? "" : " ");
        res.write(`data: ${JSON.stringify({ text: chunkStr })}\n\n`);
        index++;
        setTimeout(sendNextWord, 60 + Math.random() * 40);
      } else {
        res.write("data: [DONE]\n\n");
        res.end();
      }
    };
    sendNextWord();
    return;
  }

  try {
    // Lazy initialize the SDK client ONLY when first needed as per guidelines
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Format history for the generateContentStream call
    // contents must be an array of Content objects: { role, parts: [{ text }] }
    const formattedContents = history.map((h: any) => ({
      role: h.role,
      parts: Array.isArray(h.parts) ? h.parts : [{ text: h.text || "" }]
    }));

    // Add the current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const sysInstruction = "You are a friendly AI receptionist for a local plumbing company called Mike's Plumbing. You help visitors book appointments, answer questions about services (drain cleaning, boiler repair, emergency callouts), and capture their contact details. Keep responses short, warm, and conversational — 2–3 sentences max. Always try to guide toward booking.";

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error: any) {
    console.error("Gemini stream error:", error);
    // Graceful error fallback
    res.write(`data: ${JSON.stringify({ text: " (Service currently operating in demo mode) Would you like to schedule an appointment with Mike's Plumbing?" })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Support root paths without extensions (e.g. /services serving services.html)
    app.use(express.static(distPath, { extensions: ["html"] }));
    
    // Explicit mappings for multi-page structure
    app.get("/services", (req, res) => res.sendFile(path.join(distPath, "services.html")));
    app.get("/process", (req, res) => res.sendFile(path.join(distPath, "process.html")));
    app.get("/calculator", (req, res) => res.sendFile(path.join(distPath, "calculator.html")));
    app.get("/results", (req, res) => res.sendFile(path.join(distPath, "results.html")));
    app.get("/contact", (req, res) => res.sendFile(path.join(distPath, "contact.html")));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
