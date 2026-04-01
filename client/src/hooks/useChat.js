import { useState, useEffect, useCallback, useRef } from 'react';
import { sendMessage as apiSend, getHistory, escalate as apiEscalate } from '../services/api';

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function getSessionId() {
  let id = localStorage.getItem('chatSessionId');
  if (!id) { id = generateId(); localStorage.setItem('chatSessionId', id); }
  return id;
}

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: "👋 Hello! I'm **ShopAssist**, your 24/7 AI support agent.\n\nI can help you with:\n- 📦 Order tracking & status\n- 🔄 Returns & refunds\n- 💳 Payment issues\n- 🚚 Shipping information\n- 🔐 Account help\n\nHow can I assist you today?",
  timestamp: new Date().toISOString(),
  source: 'system',
};

export function useChat() {
  const [sessionId] = useState(getSessionId);
  const [messages, setMessages] = useState([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    getHistory(sessionId).then(data => {
      if (data.messages && data.messages.length > 0) {
        setMessages([WELCOME, ...data.messages]);
      }
    }).catch(() => {}); // silently ignore; welcome stays
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMsg = { id: generateId(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await apiSend(text.trim(), sessionId);
      const botMsg = {
        id: generateId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        source: data.source,
        language: data.language,
        escalated: data.escalated,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError('Failed to send message. Please check your connection.');
      const errMsg = {
        id: generateId(),
        role: 'assistant',
        content: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        source: 'error',
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading]);

  const escalate = useCallback(async (query, reason) => {
    try {
      await apiEscalate(sessionId, query, reason);
    } catch (err) {
      console.error('Escalation failed:', err);
    }
  }, [sessionId]);

  const startNewChat = useCallback(() => {
    const newId = generateId();
    localStorage.setItem('chatSessionId', newId);
    window.location.reload();
  }, []);

  return { messages, isLoading, error, sessionId, bottomRef, sendMessage, escalate, startNewChat };
}
