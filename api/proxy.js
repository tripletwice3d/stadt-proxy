export default async function handler(req, res) {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', 'https://urban-origin.de');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight-Anfrage behandeln
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Nur POST erlaubt' });
    return;
  }

try {
  let body = req.body;

  if (!body || typeof body !== 'object') {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();

    try {
      body = JSON.parse(data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(400).json({ message: 'Ungültiges JSON', error: parseError.message });
      return;
    }
  }

  console.log('Body:', body);

  const { stadt } = body;


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
        imageUrl: 'https://example.com/your-custom-image.jpg' // Optional
      }
    });
  } catch (error) {
    console.error('Proxy-Fehler:', error);
    res.status(500).json({ message: 'Interner Serverfehler', error: error.message });
  }
}
