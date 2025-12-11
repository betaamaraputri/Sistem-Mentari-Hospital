import React, { useState } from 'react';
import { AgentId, Message } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { routeRequest, generateAgentResponse } from './services/geminiService';
import { AGENTS } from './constants';

const App: React.FC = () => {
  const [activeAgentId, setActiveAgentId] = useState<AgentId>(AgentId.ORCHESTRATOR);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to add message to state
  const addMessage = (text: string, role: 'user' | 'model', sender: AgentId | 'USER', isRouting = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        role,
        text,
        sender,
        timestamp: new Date(),
        isRouting,
      },
    ]);
  };

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message
    addMessage(text, 'user', 'USER');
    setIsProcessing(true);

    try {
      // 2. ORCHESTRATOR PHASE: Identify Intent
      // Even if we are already 'in' an agent context, let's re-evaluate routing 
      // to see if the user wants to switch context. 
      // In a strict state machine, we might stay in one agent, 
      // but the requirement implies the Orchestrator sits above.
      
      const routingResult = await routeRequest(text);
      
      let nextAgentId = routingResult.targetAgentId;
      
      // If the Orchestrator decided to keep the current agent (implied by returning Orchestrator but we want to stay sticky if valid),
      // check if it was a direct reply or a routing failure.
      if (nextAgentId === AgentId.ORCHESTRATOR && routingResult.reply) {
         // The orchestrator handled it directly (e.g. clarification)
         setIsProcessing(false);
         addMessage(routingResult.reply, 'model', AgentId.ORCHESTRATOR);
         setActiveAgentId(AgentId.ORCHESTRATOR);
         return;
      }

      // If routing changed, notify user via UI
      if (nextAgentId !== activeAgentId && nextAgentId !== AgentId.ORCHESTRATOR) {
         addMessage(`Routing to ${AGENTS[nextAgentId].name}...`, 'model', AgentId.ORCHESTRATOR, true);
         setActiveAgentId(nextAgentId);
      } else if (nextAgentId !== AgentId.ORCHESTRATOR) {
          // Stay on same agent
          setActiveAgentId(nextAgentId);
      } else {
          // If returned Orchestrator but no reply, fallback to previous or stay orchestrator
          // This case usually handled above, but safety net:
          nextAgentId = activeAgentId; 
      }

      // 3. AGENT PHASE: Generate Response
      // Get conversation history for context (basic implementation)
      // Filter history to last few turns to save tokens and confusion
      const historyStrings = messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`);
      
      const responseText = await generateAgentResponse(nextAgentId, text, historyStrings);
      
      addMessage(responseText, 'model', nextAgentId);

    } catch (error) {
      console.error(error);
      addMessage("An unexpected error occurred. Please try again.", 'model', AgentId.ORCHESTRATOR);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar activeAgentId={activeAgentId} />
      <div className="flex-1 h-full relative flex flex-col">
         {/* Top bar for mobile only is inside ChatInterface */}
        <ChatInterface 
          messages={messages} 
          isProcessing={isProcessing} 
          onSendMessage={handleSendMessage}
          activeAgentId={activeAgentId}
        />
      </div>
      
      {/* API Key Warning Overlay (for demo purposes if env var is missing) */}
      {!process.env.API_KEY && (
        <div className="absolute inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Missing API Key</h2>
            <p className="text-slate-600 mb-6">
              To run this simulation, you must provide a Google Gemini API key in the environment variables.
            </p>
            <p className="text-sm text-slate-400">
               Ensure <code>process.env.API_KEY</code> is set in your build configuration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
