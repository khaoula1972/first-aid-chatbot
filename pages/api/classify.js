export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Get API key from environment variables
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    console.error('Hugging Face API key not configured');
    return res.status(500).json({ error: 'Service configuration error' });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/imaneumabderahmane/Arabertv02-classifier-FA',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: query }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Classifier API error:', response.status);
      throw new Error(`Classification service error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Classification error:', error.message);
    res.status(500).json({ 
      error: 'Classification service unavailable',
      details: error.message 
    });
  }
}
