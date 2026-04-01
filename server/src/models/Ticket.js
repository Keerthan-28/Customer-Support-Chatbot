const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sessionId: { type: String, required: true },
  query: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
}, { timestamps: true });
module.exports = mongoose.model('Ticket', ticketSchema);
