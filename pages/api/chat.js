export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OpenRouter API key not configured');
    return res.status(500).json({ error: 'Service configuration error' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'أنت مساعد طبي متخصص في الإسعافات الأولية. قدم إجابات دقيقة ومختصرة باللغة العربية.',
          },
          { role: 'user', content: query },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return res.status(500).json({ error: 'LLM API request failed' });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || 'لم يتم الحصول على إجابة.';

    res.status(200).json({ answer });
  } catch (error) {
    console.error('LLM error:', error.message);
    res.status(500).json({
      error: 'LLM service unavailable',
      details: error.message,
    });
  }
}
