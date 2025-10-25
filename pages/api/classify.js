export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing API key' });

  try {
    const prompt = `
    هل السؤال التالي يتعلق بالإسعافات الأولية؟
    أجب فقط بعبارة واحدة: "نعم" أو "لا".
    السؤال: ${query}
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || '';
    const isFirstAid = answer.includes('نعم');

    res.status(200).json({ isFirstAid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Classification failed', details: error.message });
  }
}
