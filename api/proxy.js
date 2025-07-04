export default async function handler(req, res) {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', 'https://urban-origin.de'); // oder '*' für Tests
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight-Anfragen (OPTIONS) sofort beenden
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Nur POST erlauben
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Nur POST erlaubt' });
    return;
  }

  try {
    const { city, country, lat, lng } = req.body;

    if (!lat || !lng || !city || !country) {
      console.warn('Ungültige oder unvollständige Daten empfangen:', req.body);
      return res.status(400).json({
        message: 'Fehlende oder ungültige Daten: city, country, lat, lng erforderlich',
        received: req.body
      });
    }

    // Debug-Ausgabe für Logs
    console.log('Empfangen von Frontend:', { city, country, lat, lng });

    // 🔁 Daten an Make-Webhook senden
    await fetch('https://hook.eu2.make.com/agkpxsp8oki976hdxoo6oev8r6hgdgbc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, country, lat, lng })
    });

    // Rückgabe an Frontend
    res.status(200).json({
      message: 'Ergebnis erhalten und an Make weitergegeben',
      result: {
        stadt: city,
        country: country,
        latitude: lat,
        longitude: lng,
        imageUrl: 'https://example.com/your-custom-image.jpg'
      }
    });

  } catch (error) {
    console.error('Proxy-Fehler:', error);
    res.status(500).json({ message: 'Interner Serverfehler', error: error.message });
  }
}
