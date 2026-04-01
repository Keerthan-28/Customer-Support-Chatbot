import React, { useState } from 'react';
import './ChatWindow.css';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import InputBar from './InputBar';

const SUGGESTED = [
  'Where is my order?',
  'How do I return an item?',
  'When will I get my refund?',
  'My payment failed',
];

export default function ChatWindow({ chat }) {
  const { messages, isLoading, error, bottomRef, sendMessage } = chat;
  const [inputValue, setInputValue] = useState('');

  const handleSend = (text) => {
    const msg = text || inputValue;
    if (!msg.trim()) return;
    sendMessage(msg.trim());
    setInputValue('');
  };

  const hasOnlyWelcome = messages.length === 1 && messages[0].id === 'welcome';

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left" style={{ marginLeft: '44px' }}>
          <div className="bot-avatar">🛒</div>
          <div>
            <h2 className="bot-name">ShopAssist AI</h2>
            <p className="bot-status"><span className="online-dot" />Online · Ready to help</p>
          </div>
        </div>
        <div className="chat-header-right">
          <div className="header-badge">24/7 Support</div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Suggestions after welcome */}
        {hasOnlyWelcome && (
          <div className="suggestions-wrap">
            <p className="suggestions-label">Popular topics</p>
            <div className="suggestions">
              {SUGGESTED.map(s => (
                <button key={s} className="suggestion-chip" onClick={() => handleSend(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && <TypingIndicator />}

        {error && <div className="error-banner">{error}</div>}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <InputBar value={inputValue} onChange={setInputValue} onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
