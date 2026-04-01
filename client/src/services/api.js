const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const sendMessage = (message, sessionId) =>
  request('/chat', { method: 'POST', body: JSON.stringify({ message, sessionId }) });

export const getHistory = (sessionId) =>
  request(`/history?sessionId=${encodeURIComponent(sessionId)}`);

export const escalate = (sessionId, query, reason) =>
  request('/escalate', { method: 'POST', body: JSON.stringify({ sessionId, query, reason }) });

export const getTickets = () => request('/tickets');
