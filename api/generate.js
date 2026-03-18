export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in environment variables." });
  }

  const { owner, address, sender, deadline, items, emailType, notes, platform, link } = req.body;

  if (!owner || !address) {
    return res.status(400).json({ error: "Owner name and property address are required." });
  }
  if (emailType !== "review" && (!items || items.length === 0)) {
    return res.status(400).json({ error: "At least one compliance item is required." });
  }

  const toneInstructions = {
    initial: "TONE: Warm, friendly, professional. First outreach. Be helpful, explain why items matter for Philadelphia compliance. Owner should feel supported. Relationship matters. End warmly.",
    followup: "TONE: Professional and direct. Previous reminder sent, items outstanding. Acknowledge politely, restate items, make deadline prominent. Firm but warm.",
    final: "TONE: Firm and serious. Final notice. State non-compliance risks fines and inability to legally rent under Philadelphia law. Respectful but urgent.",
    review: "TONE: Warm, grateful, personal. Compliance resolved. Thank owner, acknowledge positive relationship, kindly ask for a review. Low-pressure."
  };

  const itemBlock = emailType !== "review" && items?.length
    ? `Missing compliance items:\n${items.map(i => `- ${i}`).join("\n")}` : "";
  const reviewBlock = emailType === "review"
    ? `Review platform: ${platform || "Google"}\nReview link: ${link || "(ask them to search)"}` : "";

  const prompt = `You are a professional property manager in Philadelphia, PA.
Property owner/contact: ${owner}
Property address: ${address}
Sender: ${sender || "our property management team"}
${deadline ? `Deadline: ${deadline}` : ""}
${notes ? `Context: ${notes}` : ""}
${itemBlock}
${reviewBlock}
${toneInstructions[emailType] || toneInstructions.initial}
Return ONLY raw JSON, no markdown fences: {"subject":"...","body":"..."}
Rules: Philadelphia-specific context. No unfilled placeholders. Sign off with sender. Use \\n\\n between paragraphs. Prose only, no bullet points.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || JSON.stringify(data) });
    }

    const raw = data.content.map(b => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown server error" });
  }
}
