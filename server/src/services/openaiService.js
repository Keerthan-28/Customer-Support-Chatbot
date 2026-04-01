const OpenAI = require('openai');

let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('✅ OpenAI client initialized');
} else {
  console.log('⚠️  No OpenAI key – using mock responses');
}

const SYSTEM_PROMPT = `You are a professional e-commerce customer support assistant.
Understand user intent, context, and variations in queries.
Respond politely, accurately, and concisely.
If the query is complex or unclear, suggest escalation by including the exact string [ESCALATE] in your response.`;

const LANG_NAMES = { es:'Spanish', fr:'French', de:'German', ar:'Arabic', hi:'Hindi', zh:'Chinese', ja:'Japanese', pt:'Portuguese', ru:'Russian', ko:'Korean' };

const MOCK_RESPONSES = [
  "Thank you for reaching out! 😊 Could you share more details like your order number or describe the issue further? I want to make sure I give you the most accurate help.",
  "I'm here to help! To assist you better, could you provide your order ID or registered email? That'll help me look into this right away.",
  "I understand your concern. Let me help you resolve this! Please share your order number and I'll get back to you with the exact status.",
];

function getMockResponse(message) {
  const lower = message.toLowerCase();
  if (/\b(hi|hello|hey|good morning|good evening)\b/.test(lower))
    return "Hello! 👋 Welcome to customer support. I'm here to help with orders, returns, refunds, and more. How can I assist you today?";
  if (/thank/.test(lower))
    return "You're very welcome! 😊 Is there anything else I can help you with?";
  if (/bye|goodbye/.test(lower))
    return "Thank you for contacting us! Have a wonderful day. Feel free to return anytime. 🙏";
  if (/price|cost|discount|coupon|offer/.test(lower))
    return "For the latest deals and discounts, visit our **Offers** section on the app or website. You can also check your registered email for exclusive member coupons. 🎁";
  if (/contact|phone|email|call/.test(lower))
    return "📞 Our support channels:\n- **Email**: support@estore.com\n- **Phone**: 1-800-XXX-XXXX (Mon-Fri, 9AM-6PM)\n- **Live Chat**: 24/7 on website";
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

exports.generateResponse = async (message, history = [], language = 'en') => {
  let systemContent = SYSTEM_PROMPT;
  if (language !== 'en' && LANG_NAMES[language]) {
    systemContent += `\n\nIMPORTANT: The user is writing in ${LANG_NAMES[language]}. Respond in ${LANG_NAMES[language]}.`;
  }

  const messages = [
    { role: 'system', content: systemContent },
    ...history.slice(-8).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
    { role: 'user', content: message }
  ];

  try {
    if (client) {
      // Build a structured text prompt for the newer endpoint
      const promptString = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

      const resp = await client.responses.create({
        model: 'gpt-5-nano',
        input: promptString,
        store: true,
      });
      return resp.output_text.trim();
    }
    return getMockResponse(message);
  } catch (err) {
    console.error('OpenAI error:', err.message);
    return getMockResponse(message);
  }
};
