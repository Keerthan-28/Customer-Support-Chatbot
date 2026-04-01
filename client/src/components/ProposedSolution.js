import React from 'react';
import './ProposedSolution.css';

export default function ProposedSolution() {
  return (
    <div className="solution-page">
      <div className="solution-header">
        <h2 className="solution-title">LLM-Based Customer Support Chatbot</h2>
        <p className="solution-subtitle">
          Instead of relying on predefined responses, the chatbot uses a Large Language Model (LLM) to understand user intent and generate accurate, human-like responses in real time.
        </p>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3 className="feature-title">1. Automated FAQ Handling</h3>
          <ul className="feature-list">
            <li>Uses LLM to understand variations in user queries</li>
            <li>Handles order tracking, returns, payments</li>
            <li>Not keyword-based — context-aware responses</li>
          </ul>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3 className="feature-title">2. Intelligent Escalation</h3>
          <ul className="feature-list">
            <li>Detects complex or sensitive queries</li>
            <li>Uses confidence/intent analysis</li>
            <li>Escalates to human with full chat history</li>
          </ul>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌍</div>
          <h3 className="feature-title">3. Multi-language Support</h3>
          <ul className="feature-list">
            <li>Understands multiple languages</li>
            <li>Responds in user's preferred language</li>
            <li>No external translation required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
