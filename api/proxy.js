export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST erlaubt" });
  }

  let body = '';
  try {
    for await (const chunk of req) {
      body += chunk;
    }
    body = JSON.parse(body);
  } catch (e) {
    return res.status(400).json({ message: "Ungültiger JSON Body", error: e.message });
  }

  const makeWebhookUrl = "https://hook.eu2.make.com/agkpxsp8oki976hdxoo6oev8r6hgdgbc";

  try {
    const forward = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await forward.text();

    return res.status(forward.status).json({
      message: "Resultat erhalten",
      result: text
    });
  } catch (error) {
    return res.status(500).json({ message: "Proxy-Fehler", error: error.message });
  }
}
