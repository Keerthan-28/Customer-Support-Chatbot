require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chat');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
app.use('/api', chatRoutes);
app.use('/api/ecommerce', orderRoutes);

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.warn('⚠️  MongoDB failed, using file storage:', error.message);
    }
  } else {
    console.log('📁 Using file-based storage (no MONGODB_URI set)');
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
