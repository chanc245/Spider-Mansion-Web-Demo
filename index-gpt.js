// ---------- GPT API ----------
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

const apiKey = (
  process.env.OPENAI_API_KEY ||
  process.env.GPTAPIKEY ||
  ""
).trim();
// console.log("Server __dirname:", __dirname);
// console.log("Loaded .env from :", join(__dirname, ".env"));
const masked = apiKey
  ? apiKey.slice(0, 3) + "..." + apiKey.slice(-4)
  : "(none)";
// console.log("API key detected:", masked);
if (!apiKey) {
  console.error(
    "❌ Missing API key. Put OPENAI_API_KEY (or GPTAPIKEY) in .env next to index-gpt.js"
  );
}

const openai = new OpenAI({ apiKey });

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

app.post("/submit", async (req, res, next) => {
  try {
    const input = req.body && req.body.input ? String(req.body.input) : "";
    if (!input) {
      return res.status(400).json({ error: 'Missing "input" in JSON body' });
    }
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server missing API key. Check .env." });
    }
    const ai = await getGptResultAsString(input);
    res.json({ ai });
  } catch (err) {
    next(err);
  }
});

async function getGptResultAsString(input) {
  console.log("--Run GPT with model:", MODEL);
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: input }],
      temperature: 0.2,
    });
    const text =
      completion.choices?.[0]?.message?.content?.trim() ?? "(no content)";
    console.log("--AI reply:", text);
    return text;
  } catch (error) {
    console.error(
      "OpenAI error:",
      error?.status,
      error?.message,
      error?.response?.data || ""
    );
    throw new Error(error?.message || "OpenAI request failed");
  }
}

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
