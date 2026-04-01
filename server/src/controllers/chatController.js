const faqService = require('../services/faqService');
const openaiService = require('../services/openaiService');
const storageService = require('../services/storageService');
const { detectLanguage } = require('../services/languageService');

const ESCALATION_KEYWORDS = [
  'speak to agent','human support','real person','talk to human',
  'live agent','human agent','escalate','manager','supervisor',
  'lawsuit','fraud','scam','legal action'
];

const ESCALATION_MSGS = {
  en: "I've created a priority support ticket 🎫 Our team will contact you within 2-4 business hours. Ticket reference has been sent to your email. Is there anything else I can help with in the meantime?",
  es: "He creado un ticket de soporte prioritario. Nuestro equipo se comunicará con usted en 2-4 horas hábiles.",
  fr: "J'ai créé un ticket de support prioritaire. Notre équipe vous contactera dans 2-4 heures ouvrables.",
  hi: "मैंने एक प्राथमिकता समर्थन टिकट बनाया है। हमारी टीम 2-4 घंटे में आपसे संपर्क करेगी।",
  ar: "لقد أنشأت تذكرة دعم ذات أولوية. سيتصل بك فريقنا خلال 2-4 ساعات عمل.",
  zh: "我已创建优先支持工单。我们的团队将在2-4个工作小时内联系您。",
  de: "Ich habe ein Prioritäts-Support-Ticket erstellt. Unser Team wird Sie innerhalb von 2-4 Stunden kontaktieren.",
};

exports.handleChat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const language = detectLanguage(message);

    await storageService.saveMessage({ sessionId, role: 'user', content: message, language, timestamp: new Date() });

    // 1. Check escalation triggers
    const lower = message.toLowerCase();
    if (ESCALATION_KEYWORDS.some(kw => lower.includes(kw))) {
      await storageService.saveTicket({ sessionId, query: message, reason: 'User requested human support', status: 'open', timestamp: new Date() });
      const reply = ESCALATION_MSGS[language] || ESCALATION_MSGS.en;
      await storageService.saveMessage({ sessionId, role: 'assistant', content: reply, language, timestamp: new Date() });
      return res.json({ success: true, response: reply, source: 'escalation', language, escalated: true });
    }

    // 1.5 E-Commerce Mock API Integration Intercepts
    const orderMatch = lower.match(/(?:where is my order|order status)[^#0-9A-Z]*#?([0-9A-Z-]+)?/i);
    const refundMatch = lower.match(/(?:refund status)[^#0-9A-Z]*#?([0-9A-Z-]+)?/i);
    const isReturn = lower.includes('return product') || lower.includes('want to return');

    if (orderMatch && !refundMatch) {
      const id = orderMatch[1] || 'ORD-' + Math.floor(Math.random() * 90000 + 10000);
      const reply = `According to our system, your order **#${id}** is currently **Shipped and In-Transit**. Estimated arrival is within 2-3 business days.`;
      await storageService.saveMessage({ sessionId, role: 'assistant', content: reply, language, timestamp: new Date() });
      return res.json({ success: true, response: reply, source: 'api_order', language, escalated: false });
    }

    if (isReturn) {
      const reply = `I have successfully submitted a return request. Your Return Authorization (RMA) code is **RMA-${Math.floor(Math.random()*90000)+10000}**. Please check your email for the prepaid shipping label.`;
      await storageService.saveMessage({ sessionId, role: 'assistant', content: reply, language, timestamp: new Date() });
      return res.json({ success: true, response: reply, source: 'api_return', language, escalated: false });
    }

    if (refundMatch) {
      const id = refundMatch[1] || 'REF-' + Math.floor(Math.random() * 90000 + 10000);
      const reply = `Your refund request **#${id}** is currently **Processing**. The funds should reflect in your original payment method within 3-5 business days.`;
      await storageService.saveMessage({ sessionId, role: 'assistant', content: reply, language, timestamp: new Date() });
      return res.json({ success: true, response: reply, source: 'api_refund', language, escalated: false });
    }

    // 2. FAQ matching
    const faq = faqService.findMatch(message, language);
    if (faq) {
      await storageService.saveMessage({ sessionId, role: 'assistant', content: faq.answer, language, timestamp: new Date() });
      return res.json({ success: true, response: faq.answer, source: 'faq', language, escalated: false });
    }

    // 3. LLM call
    const history = await storageService.getMessages(sessionId);
    let llmResponse = await openaiService.generateResponse(message, history.slice(-10), language);
    
    // 4. Intelligent Escalation Check
    const lowerQuery = message.toLowerCase();
    const lowerResp = llmResponse.toLowerCase();
    const isUncertain = /not sure|cannot|don't know|unable to|escalated?/i.test(lowerResp) || llmResponse.includes('[ESCALATE]');
    const isAngry = /complaint|angry|refund issue|manager|human/i.test(lowerQuery);

    if (isUncertain || isAngry) {
      const cleanResponse = llmResponse.replace('[ESCALATE]', '').trim();
      const fallbackMsg = "Your query has been forwarded to a human support agent.";
      const reply = cleanResponse ? `${cleanResponse}\n\n*${fallbackMsg}*` : fallbackMsg;
      
      await storageService.saveTicket({ sessionId, query: message, reason: isAngry ? 'User Complaint/Frustration' : 'LLM Low Confidence', status: 'open', timestamp: new Date() });
      await storageService.saveMessage({ sessionId, role: 'assistant', content: reply, language, timestamp: new Date() });
      return res.json({ success: true, response: reply, source: 'escalation', language, escalated: true });
    }

    await storageService.saveMessage({ sessionId, role: 'assistant', content: llmResponse, language, timestamp: new Date() });
    return res.json({ success: true, response: llmResponse, source: 'llm', language, escalated: false });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Failed to process your message. Please try again.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ success: false, message: 'sessionId required' });
    const messages = await storageService.getMessages(sessionId);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve history' });
  }
};

exports.escalateTicket = async (req, res) => {
  try {
    const ticket = await storageService.saveTicket({ ...req.body, status: 'open', timestamp: new Date() });
    res.json({ success: true, message: 'Ticket created', ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create ticket' });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await storageService.getTickets();
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve tickets' });
  }
};
