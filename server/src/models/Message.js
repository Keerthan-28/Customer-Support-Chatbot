const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sessionId: { type: String, required: true, index: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  language: { type: String, default: 'en' },
  source: { type: String, enum: ['faq', 'llm', 'escalation', 'user'], default: 'user' },
}, { timestamps: true });
module.exports = mongoose.model('Message', messageSchema);
