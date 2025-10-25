export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing Hugging Face key' });

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

    const data = await response.json();

    const label0 = data?.[0]?.find(d => d.label === 'LABEL_0')?.score || 0;
    const label1 = data?.[0]?.find(d => d.label === 'LABEL_1')?.score || 0;
    const isFirstAid = label1 > label0;

    res.status(200).json({ isFirstAid, label0, label1 });
  } catch (error) {
    console.error('Classification error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
