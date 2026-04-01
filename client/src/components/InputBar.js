import React, { useRef } from 'react';
import './InputBar.css';

export default function InputBar({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  const handleInput = (e) => {
    onChange(e.target.value);
    // Auto-resize
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }
  };

  const handleSendClick = () => { onSend(value); if (textareaRef.current) textareaRef.current.style.height = 'auto'; };

  return (
    <div className="input-bar">
      <div className="input-inner">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <button
          className={`send-btn ${disabled || !value.trim() ? 'send-disabled' : ''}`}
          onClick={handleSendClick}
          disabled={disabled || !value.trim()}
          title="Send message"
        >
          {disabled
            ? <span className="send-spinner" />
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          }
        </button>
      </div>
      <p className="input-hint">🔒 Secure · Powered by AI · Available 24/7</p>
    </div>
  );
}
