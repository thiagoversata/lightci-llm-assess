import express from "express";
import cors from "cors";
import { chat } from "./openai.js";

const port = Number(process.env.PORT) || 3003;

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/messages", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const latestUserMessage = messages[messages.length - 1];
  if (latestUserMessage.role !== "user") {
    return res.status(400).json({ error: "Invalid role, not user" });
  }

  const chatResponse = await chat([...messages]);
  console.log(`Chat response: ${chatResponse}`);
  res.json({
    messages: [...messages, { role: "assistant", content: chatResponse }],
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
