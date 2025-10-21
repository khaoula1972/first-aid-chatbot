// API endpoint for chat interactions
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, category } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // First aid guidance based on category
    const responses = {
      bleeding: {
        response: "For bleeding wounds:\n1. Apply direct pressure with a clean cloth\n2. Elevate the injured area above the heart if possible\n3. Maintain pressure for at least 10 minutes\n4. If bleeding is severe, call emergency services (911)\n5. Do not remove the cloth if it becomes soaked; add more on top\n\n⚠️ Seek immediate medical attention if bleeding doesn't stop or is severe.",
        severity: 'high'
      },
      burn: {
        response: "For burns:\n1. Cool the burn under running water for 10-20 minutes\n2. Remove jewelry or tight clothing before swelling starts\n3. Cover with a sterile, non-stick bandage\n4. Do NOT use ice, butter, or ointments\n5. For severe burns (large area, deep, or on face/hands), seek immediate medical attention\n\n⚠️ Call 911 for third-degree burns or burns larger than 3 inches.",
        severity: 'medium'
      },
      choking: {
        response: "For choking:\n1. Encourage coughing if the person can cough\n2. If unable to cough, perform Heimlich maneuver:\n   - Stand behind the person\n   - Make a fist above their navel\n   - Grasp with other hand and thrust inward/upward\n3. Repeat until object is expelled\n4. Call 911 if unsuccessful or person becomes unconscious\n\n⚠️ This is a life-threatening emergency. Act quickly!",
        severity: 'critical'
      },
      cardiac: {
        response: "For suspected heart attack:\n1. Call 911 immediately\n2. Have person sit down and rest\n3. If conscious, give aspirin (if not allergic)\n4. Loosen tight clothing\n5. If unconscious and not breathing, begin CPR:\n   - 30 chest compressions\n   - 2 rescue breaths\n   - Repeat until help arrives\n\n⚠️ CALL 911 IMMEDIATELY! Time is critical.",
        severity: 'critical'
      },
      fracture: {
        response: "For fractures or sprains:\n1. Don't move the injured area\n2. Apply ice pack (wrapped in cloth) for 15-20 minutes\n3. Immobilize the area with a splint if possible\n4. Elevate above heart level to reduce swelling\n5. Seek medical attention for proper diagnosis\n\n⚠️ Do not try to realign or push back any bone.",
        severity: 'medium'
      },
      poisoning: {
        response: "For poisoning:\n1. Call Poison Control (1-800-222-1222) immediately\n2. Do NOT induce vomiting unless instructed\n3. If on skin/eyes, rinse with water for 15-20 minutes\n4. Have poison container/information ready for responders\n5. Monitor breathing and consciousness\n\n⚠️ Call 911 if person is unconscious or having trouble breathing.",
        severity: 'critical'
      },
      general: {
        response: "I'm here to help with first aid guidance. Please describe your emergency or situation, and I'll provide appropriate first aid instructions.\n\nI can help with:\n- Bleeding and wounds\n- Burns\n- Choking\n- Cardiac emergencies\n- Fractures and sprains\n- Poisoning\n\n⚠️ For life-threatening emergencies, always call 911 first!",
        severity: 'low'
      }
    };

    const responseData = responses[category] || responses.general;

    res.status(200).json({
      response: responseData.response,
      severity: responseData.severity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
