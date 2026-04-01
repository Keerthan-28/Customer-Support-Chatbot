import React from 'react';
import './MessageBubble.css';

// Very simple markdown renderer (bold, lists, line breaks)
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Headers (##)
    .replace(/^#{1,3}\s+(.+)$/gm, '<strong>$1</strong>')
    // Numbered list
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Bullet list
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br />');

  // Wrap consecutive <li> with <ul>
  html = html.replace(/(<li>.*?<\/li>(<br \/>)?)+/gs, (match) =>
    '<ul>' + match.replace(/<br \/>/g, '') + '</ul>'
  );
  return html;
}

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const SOURCE_LABEL = { faq: '📋 FAQ', llm: '🤖 AI', escalation: '🎫 Escalated', system: '', error: '⚠️' };

export default function MessageBubble({ message }) {
  const { role, content, timestamp, source, escalated } = message;
  const isUser = role === 'user';

  return (
    <div className={`bubble-row ${isUser ? 'user-row' : 'bot-row'}`}>
      {!isUser && (
        <div className="bubble-avatar">🛒</div>
      )}

      <div className={`bubble-wrapper ${isUser ? 'user-wrapper' : 'bot-wrapper'}`}>
        <div className={`bubble ${isUser ? 'user-bubble' : 'bot-bubble'} ${escalated ? 'escalated-bubble' : ''}`}>
          <div
            className="bubble-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </div>

        <div className={`bubble-meta ${isUser ? 'meta-right' : 'meta-left'}`}>
          {source && SOURCE_LABEL[source] && (
            <span className="source-tag">{SOURCE_LABEL[source]}</span>
          )}
          <span className="timestamp">{formatTime(timestamp)}</span>
          {isUser && <span className="sent-tick">✓✓</span>}
        </div>
      </div>

      {isUser && <div className="bubble-avatar user-avatar">👤</div>}
    </div>
  );
}
