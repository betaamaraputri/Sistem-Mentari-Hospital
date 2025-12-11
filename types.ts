import React from 'react';

export enum AgentId {
  ORCHESTRATOR = 'ORCHESTRATOR',
  PATIENT_MGMT = 'PATIENT_MGMT',
  APPOINTMENTS = 'APPOINTMENTS',
  MEDICAL_RECORDS = 'MEDICAL_RECORDS',
  BILLING = 'BILLING'
}

export interface AgentConfig {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sender: AgentId | 'USER'; // If model, which agent sent it
  timestamp: Date;
  isRouting?: boolean; // If true, this is a system message about routing
}

export interface RoutingResult {
  targetAgentId: AgentId;
  reasoning: string;
}