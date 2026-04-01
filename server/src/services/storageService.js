const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data');
const MSG_FILE = path.join(DATA_DIR, 'messages.json');
const TKT_FILE = path.join(DATA_DIR, 'tickets.json');

const isConnected = () => mongoose.connection.readyState === 1;

async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  for (const f of [MSG_FILE, TKT_FILE]) {
    try { await fs.access(f); } catch { await fs.writeFile(f, '[]'); }
  }
}
ensureFiles().catch(console.error);

async function readJSON(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf-8')); } catch { return []; }
}
async function writeJSON(file, data) { await fs.writeFile(file, JSON.stringify(data, null, 2)); }

exports.saveMessage = async (msg) => {
  const doc = { id: uuidv4(), ...msg };
  if (isConnected()) {
    const Message = require('../models/Message');
    return await Message.create(doc);
  }
  const all = await readJSON(MSG_FILE);
  all.push(doc);
  await writeJSON(MSG_FILE, all);
  return doc;
};

exports.getMessages = async (sessionId) => {
  if (isConnected()) {
    const Message = require('../models/Message');
    return await Message.find({ sessionId }).sort({ createdAt: 1 });
  }
  const all = await readJSON(MSG_FILE);
  return all.filter(m => m.sessionId === sessionId);
};

exports.saveTicket = async (tkt) => {
  const doc = { id: uuidv4(), ...tkt };
  if (isConnected()) {
    const Ticket = require('../models/Ticket');
    return await Ticket.create(doc);
  }
  const all = await readJSON(TKT_FILE);
  all.push(doc);
  await writeJSON(TKT_FILE, all);
  return doc;
};

exports.getTickets = async () => {
  if (isConnected()) {
    const Ticket = require('../models/Ticket');
    return await Ticket.find().sort({ createdAt: -1 });
  }
  const all = await readJSON(TKT_FILE);
  return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};
