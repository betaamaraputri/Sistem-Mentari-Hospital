import React, { useState, useRef, useEffect } from 'react';
import { Message, AgentId } from '../types';
import { AGENTS } from '../constants';

interface ChatInterfaceProps {
  messages: Message[];
  isProcessing: boolean;
  onSendMessage: (text: string) => void;
  activeAgentId: AgentId;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isProcessing, 
  onSendMessage,
  activeAgentId
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const activeAgent = AGENTS[activeAgentId];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header for Mobile */}
      <div className="md:hidden p-4 bg-white border-b border-slate-200 flex items-center gap-3">
         <div className={`p-2 rounded-lg ${activeAgent.bgColor} ${activeAgent.textColor}`}>
            {activeAgent.icon}
         </div>
         <div>
            <h2 className="font-bold text-slate-800">{activeAgent.name}</h2>
            <p className="text-xs text-slate-500">{activeAgent.role}</p>
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 opacity-60">
             <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
             </div>
             <p className="max-w-md text-lg font-medium">How can I help you today?</p>
             <p className="text-sm">Try asking about appointments, records, or billing.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSystemRouting = msg.isRouting;
          const agentInfo = msg.sender !== 'USER' ? AGENTS[msg.sender] : null;

          if (isSystemRouting) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-slate-200 text-slate-600 text-xs py-1 px-3 rounded-full flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h-4.5a.75.75 0 000 1.5h5.69l1.72 1.72a5.75 5.75 0 008.25-8.25l1.72-1.72v-5.69a.75.75 0 00-1.5 0v4.5l-.311.312a5.501 5.501 0 01-2.466 9.202zm-5.312-6.354a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm 
                  ${isUser ? 'bg-slate-900 text-white' : (agentInfo ? agentInfo.color : 'bg-gray-400')} text-white`}>
                  {isUser ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  ) : agentInfo?.icon}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    {!isUser && agentInfo && (
                        <span className="text-xs text-slate-400 mb-1 ml-1">{agentInfo.name}</span>
                    )}
                    <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap
                    ${isUser 
                        ? 'bg-slate-900 text-white rounded-br-none' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                    }`}>
                    {msg.text}
                    </div>
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex w-full justify-start">
            <div className="flex gap-3">
               <div className={`w-8 h-8 rounded-full ${activeAgent.color} flex items-center justify-center text-white animate-pulse`}>
                  {activeAgent.icon}
               </div>
               <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder={`Message ${activeAgent.role}...`}
            className="flex-1 bg-slate-100 border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-slate-400 focus:outline-none placeholder-slate-400 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                ${input.trim() ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">MediOrchestrator can make mistakes. Verify important medical info.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
