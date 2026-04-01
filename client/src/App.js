import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { useChat } from './hooks/useChat';

function App() {
  const [view, setView] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const chat = useChat();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar
          messages={chat.messages}
          sessionId={chat.sessionId}
          onNewChat={chat.startNewChat}
          view={view}
          setView={setView}
          theme={theme}
          setTheme={setTheme}
        />
      </div>

      {/* Main content */}
      <div className="main-wrapper">
        {/* Mobile toggle */}
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
          <span>{sidebarOpen ? '◀' : '▶'}</span>
        </button>

        <ChatWindow chat={chat} />
      </div>
    </div>
  );
}

export default App;
