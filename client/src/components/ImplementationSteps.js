import React from 'react';
import './ImplementationSteps.css';

export default function ImplementationSteps() {
  return (
    <div className="steps-page">
      <div className="steps-header">
        <h2 className="steps-title">System Implementation Steps</h2>
        <p className="steps-subtitle">
          How we built and integrated the intelligent customer support chatbot using advanced prompt engineering rather than rigid fine-tuning.
        </p>
      </div>

      <div className="steps-container">
        {/* Step 1 */}
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3 className="step-heading">Data Collection and Cleaning</h3>
            <p className="step-description">
              Clean and structured data is essential for chatbot performance. We collected ~5,000 customer support queries, categorized and cleaned them. This curated dataset is used to design precise FAQ responses and continuously improve our prompt quality.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3 className="step-heading">LLM Configuration and Prompt Engineering</h3>
            <p className="step-description">
              Instead of full fine-tuning, the chatbot uses a powerful pre-trained LLM (GPT-3.5) with carefully designed system prompts. The prompt natively defines tone, behavior, and response style to ensure accurate, polite, and context-aware replies dynamically.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3 className="step-heading">API Integration with Website</h3>
            <p className="step-description">
              Securely developed and integrated robust REST APIs between the front-end interface and the Node.js backend. This architecture maintains secure context state, handles simultaneous user sessions, and seamlessly parses LLM intelligence back to the user interface.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3 className="step-heading">Monitoring and Continuous Improvement</h3>
            <p className="step-description">
              Deployed a dedicated Admin Dashboard to review escalated support tickets visually. This allows human agents to immediately resolve complex edge cases while providing structured insight into conversation metrics, allowing us to continuously polish the underlying prompt logic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
