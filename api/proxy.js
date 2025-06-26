console.log("Proxy API gestartet");
// Datei: api/proxy.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST erlaubt" });
  }

  try {
    const body = req.body;

    const makeWebhookUrl = "https://hook.eu2.make.com/agkpxsp8oki976hdxoo6oev8r6hgdgbc"; // DEIN HOOK

    const forward = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await forward.text();
    return res.status(forward.status).json({ message: "Ergebnis erhalten", result: text });

  } catch (error) {
    return res.status(500).json({ message: "Proxy-Fehler", error: error.message });
  }
}
