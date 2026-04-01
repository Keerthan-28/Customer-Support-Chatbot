const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const chatController = require('../controllers/chatController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// POST /api/chat
router.post('/chat',
  [body('message').trim().notEmpty().isLength({ max: 2000 }), body('sessionId').trim().notEmpty()],
  validate,
  chatController.handleChat
);

// GET /api/history?sessionId=xxx
router.get('/history', chatController.getHistory);

// POST /api/escalate
router.post('/escalate',
  [body('sessionId').trim().notEmpty(), body('query').trim().notEmpty(), body('reason').trim().notEmpty()],
  validate,
  chatController.escalateTicket
);

// GET /api/tickets  (admin dashboard)
router.get('/tickets', chatController.getTickets);

module.exports = router;
