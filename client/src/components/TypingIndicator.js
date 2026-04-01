import React from 'react';
import './TypingIndicator.css';

export default function TypingIndicator() {
  return (
    <div className="bubble-row bot-row">
      <div className="bubble-avatar">🛒</div>
      <div className="typing-bubble">
        <span className="dot" /><span className="dot" /><span className="dot" />
      </div>
    </div>
  );
}
