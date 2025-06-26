export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST erlaubt" });
  }

  const makeWebhookUrl = "https://hook.eu2.make.com/agkpxsp8oki976hdxoo6oev8r6hgdgbc";

  try {
    const body = req.body;

    if (!body || typeof body !== "object") {
      return res.status(400).json({ message: "Body fehlt oder ist ungültig" });
    }

    const forward = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const resultText = await forward.text();

    return res.status(forward.status).json({
      message: "Ergebnis erhalten",
      result: resultText
    });

  } catch (error) {
    return res.status(500).json({
      message: "Proxy-Fehler",
      error: error.message
    });
  }
}
