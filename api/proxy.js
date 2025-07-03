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

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { stadt } = req.body;

    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stadt)}`);
    const geoData = await geoResponse.json();

    if (!geoData.length) {
      res.status(200).json({ message: 'Keine Ergebnisse gefunden', result: null });
      return;
    }

    const city = geoData[0];

    res.status(200).json({
      message: 'Ergebnis erhalten',
      result: {
        stadt: city.display_name,
        latitude: city.lat,
        longitude: city.lon,
        imageUrl: 'https://example.com/your-custom-image.jpg' // Optional für später
      }
    });
  } catch (error) {
    console.error('Proxy-Fehler:', error);
    res.status(500).json({ message: 'Interner Serverfehler', error: error.message });
  }
}
