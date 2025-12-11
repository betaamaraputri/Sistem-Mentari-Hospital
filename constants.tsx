import React from 'react';
import { AgentConfig, AgentId } from './types';

// Icons
const IconOrchestrator = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const IconPatient = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const IconAppointment = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

const IconRecords = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconBilling = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


export const AGENTS: Record<AgentId, AgentConfig> = {
  [AgentId.ORCHESTRATOR]: {
    id: AgentId.ORCHESTRATOR,
    name: 'Hospital Orchestrator',
    role: 'Central Command',
    description: 'Understands your request and routes it to the correct specialist.',
    systemPrompt: `You are an expert Hospital Operations Orchestrator. Your role is to understand user requests regarding hospital operations and route them to the appropriate sub-agent: Patient Management, Appointment Scheduling, Medical Records, or Billing and Insurance. If the request is ambiguous, you must ask for clarification. Do not attempt to answer specific medical or billing questions yourself; your job is strictly efficient routing.`,
    color: 'bg-slate-700',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-800',
    icon: IconOrchestrator,
  },
  [AgentId.PATIENT_MGMT]: {
    id: AgentId.PATIENT_MGMT,
    name: 'Patient Admin',
    role: 'Patient Management',
    description: 'Handles admissions, discharges, and general patient information.',
    systemPrompt: `You are an expert Patient Management agent. You are responsible for managing patient-related tasks, including processing admissions, handling discharge procedures, and providing or updating general patient information. Ensure admission and discharge procedures are processed and recorded accurately. Maintain confidentiality and adhere to privacy regulations when handling patient data.`,
    color: 'bg-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    icon: IconPatient,
  },
  [AgentId.APPOINTMENTS]: {
    id: AgentId.APPOINTMENTS,
    name: 'Scheduling Desk',
    role: 'Appointment Scheduling',
    description: 'Books, reschedules, and cancels appointments.',
    systemPrompt: `You are an expert Appointment Scheduler. Your task is to handle all aspects of appointment scheduling, including finding slots, booking, rescheduling, and canceling appointments. You will confirm all changes with the user. Output Focus: Must confirm all newly booked appointments (including date, time, and healthcare provider). Rescheduling confirmations must state the old and new appointment details clearly. Must provide available slots when requested.`,
    color: 'bg-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    icon: IconAppointment,
  },
  [AgentId.MEDICAL_RECORDS]: {
    id: AgentId.MEDICAL_RECORDS,
    name: 'Records Keeper',
    role: 'Medical Records',
    description: 'Provides medical history, test results, and diagnoses securely.',
    systemPrompt: `You are the guardian of patient medical records. Your role involves retrieving patient medical history, sharing test results, and documenting diagnoses. Output Focus & Control: Must provide accurate and relevant medical history, test results, and diagnoses. CRITICAL: Patient privacy must be strictly maintained, ensuring no sensitive information is disclosed inappropriately. Diagnosis documentation must be clear, concise, and adhere to medical record-keeping standards.`,
    color: 'bg-rose-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-800',
    icon: IconRecords,
  },
  [AgentId.BILLING]: {
    id: AgentId.BILLING,
    name: 'Finance Dept',
    role: 'Billing & Insurance',
    description: 'Manages invoices, insurance claims, and payments.',
    systemPrompt: `You are an expert in financial transactions within the hospital system. Your role is to manage patient billing, process insurance claims, verify coverage, and provide clear explanations for all charges. Output Focus: Generate accurate and detailed patient bills. Verify insurance coverage and communicate findings clearly. HIGH PRIORITY: Ensure all financial transactions are handled with transparency and accuracy.`,
    color: 'bg-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    icon: IconBilling,
  },
};
