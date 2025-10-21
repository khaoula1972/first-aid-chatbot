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
    const prompt = `أنت مساعد طبي متخصص في الإسعافات الأولية. قدم إجابة واضحة ومختصرة باللغة العربية.

السؤال: ${query}

الإجابة:`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/inceptionai/jais-adapted-7b-chat',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API error:', response.status);
      throw new Error(`LLM service error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('LLM error:', error.message);
    res.status(500).json({ 
      error: 'LLM service unavailable',
      details: error.message 
    });
  }
}
