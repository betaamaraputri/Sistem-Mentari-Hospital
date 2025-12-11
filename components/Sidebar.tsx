import React from 'react';
import { AgentId } from '../types';
import { AGENTS } from '../constants';

interface SidebarProps {
  activeAgentId: AgentId;
}

const Sidebar: React.FC<SidebarProps> = ({ activeAgentId }) => {
  return (
    <div className="hidden md:flex flex-col w-80 h-full bg-white border-r border-slate-200 shadow-sm z-10">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediSim</h1>
            <p className="text-xs text-slate-500 font-medium">Hospital Ops AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">Active Agents</h2>
        
        {Object.values(AGENTS).map((agent) => {
          const isActive = activeAgentId === agent.id;
          return (
            <div 
              key={agent.id}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-800 text-white shadow-md transform scale-[1.02]' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className={`mt-1 p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : `${agent.bgColor} ${agent.textColor}`}`}>
                {agent.icon}
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>
                  {agent.name}
                </h3>
                <p className={`text-xs mt-1 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {agent.role}
                </p>
                {isActive && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-green-300">Online</span>
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
      </div>
    </div>
  );
};

export default Sidebar;
