// API endpoint for classifying emergency types
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Simple keyword-based classification for common first aid scenarios
    const messageLower = message.toLowerCase();
    let category = 'general';
    let confidence = 0.5;

    if (messageLower.includes('bleed') || messageLower.includes('cut') || messageLower.includes('wound')) {
      category = 'bleeding';
      confidence = 0.85;
    } else if (messageLower.includes('burn') || messageLower.includes('scald')) {
      category = 'burn';
      confidence = 0.85;
    } else if (messageLower.includes('chok') || messageLower.includes('heimlich')) {
      category = 'choking';
      confidence = 0.85;
    } else if (messageLower.includes('cpr') || messageLower.includes('cardiac') || messageLower.includes('heart attack')) {
      category = 'cardiac';
      confidence = 0.85;
    } else if (messageLower.includes('fracture') || messageLower.includes('broke') || messageLower.includes('sprain')) {
      category = 'fracture';
      confidence = 0.85;
    } else if (messageLower.includes('poison') || messageLower.includes('toxic')) {
      category = 'poisoning';
      confidence = 0.85;
    }

    res.status(200).json({
      category,
      confidence,
      message: `Classified as: ${category}`
    });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
