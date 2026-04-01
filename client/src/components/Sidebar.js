import React from 'react';
import './Sidebar.css';

const QUICK_REPLIES = [
  { icon: '📦', label: 'Track my order' },
  { icon: '🔄', label: 'Return an item' },
  { icon: '💰', label: 'Refund status' },
  { icon: '💳', label: 'Payment issue' },
  { icon: '🚚', label: 'Shipping info' },
  { icon: '🔐', label: 'Account help' },
];

export default function Sidebar({ messages, onNewChat, view, setView, theme, setTheme }) {
  const msgCount = messages.filter(m => m.role === 'user').length;
  const escalated = messages.some(m => m.escalated);

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <span>🛒</span>
        </div>
        <div className="brand-text">
          <h1 className="brand-name">ShopAssist</h1>
          <p className="brand-tagline">AI Support Agent</p>
        </div>
      </div>

      {/* Status pill */}
      <div className="status-badge">
        <span className="status-dot online" />
        <span>Online · Avg reply &lt;1s</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button className={`nav-item ${view === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>
          <span className="nav-icon">💬</span> Live Chat
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* Session info */}
      <div className="session-info">
        <p className="section-label">Current Session</p>
        <div className="session-stat">
          <span>Messages sent</span><strong>{msgCount}</strong>
        </div>
        <div className="session-stat">
          <span>Status</span>
          <strong className={escalated ? 'text-warning' : 'text-success'}>
            {escalated ? '🎫 Escalated' : '✅ Active'}
          </strong>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Quick topics */}
      <div className="quick-topics">
        <p className="section-label">Quick Topics</p>
        <div className="topics-grid">
          {QUICK_REPLIES.map(r => (
            <div key={r.label} className="topic-chip">
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New chat button */}
      <div className="sidebar-footer">
        <button className="new-chat-btn" onClick={onNewChat}>
          <span>＋</span> New Conversation
        </button>
        <button className="new-chat-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{marginTop:'12px', background:'var(--sidebar-hover)'}}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
