// /api/proxy.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST erlaubt" });
  }

  const body = await req.json();
  const makeWebhookUrl = "https://hook.eu2.make.com/agkpxsp8oki976hdxoo6oev8r6hgdgbc";

  try {
    const forward = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await forward.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Proxy-Fehler", details: error.message });
  }
}
