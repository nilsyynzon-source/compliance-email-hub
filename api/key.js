export default function handler(req, res) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "No API key set" });
  return res.status(200).json({ key });
}
