import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🔹 OpenAI Realtime Session Route
app.get("/session", async (req, res) => {
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17", // low-latency realtime model
        voice: "verse" // default voice
      })
    });

    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI session failed" });
  }
});

// 🔹 ElevenLabs Text-to-Speech Route
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;

    const r = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/cgSgspJ2msm6clMCkdW9", // Replace with your ElevenLabs voice ID
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVEN_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          voice_settings: { stability: 0.5, similarity_boost: 0.5 }
        })
      }
    );

    // Stream audio back
    res.setHeader("Content-Type", "audio/mpeg");
    r.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "TTS failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
