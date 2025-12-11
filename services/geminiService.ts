import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { AGENTS } from "../constants";
import { AgentId } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Tool Definitions for the Orchestrator ---

const routeToPatientMgmtFunc: FunctionDeclaration = {
  name: 'routeToPatientMgmt',
  description: 'Route request to Patient Management for admissions, discharge, or general info.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      reason: { type: Type.STRING, description: 'Reason for routing to this agent' }
    },
  },
};

const routeToAppointmentsFunc: FunctionDeclaration = {
  name: 'routeToAppointments',
  description: 'Route request to Appointment Scheduling for booking, rescheduling, or canceling.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      reason: { type: Type.STRING, description: 'Reason for routing to this agent' }
    },
  },
};

const routeToMedicalRecordsFunc: FunctionDeclaration = {
  name: 'routeToMedicalRecords',
  description: 'Route request to Medical Records for history, test results, or diagnosis.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      reason: { type: Type.STRING, description: 'Reason for routing to this agent' }
    },
  },
};

const routeToBillingFunc: FunctionDeclaration = {
  name: 'routeToBilling',
  description: 'Route request to Billing and Insurance for invoices, claims, or payments.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      reason: { type: Type.STRING, description: 'Reason for routing to this agent' }
    },
  },
};

const orchestratorTools: Tool[] = [{
  functionDeclarations: [
    routeToPatientMgmtFunc,
    routeToAppointmentsFunc,
    routeToMedicalRecordsFunc,
    routeToBillingFunc
  ]
}];

/**
 * Step 1: The Orchestrator determines which agent should handle the request.
 */
export const routeRequest = async (userMessage: string): Promise<{ targetAgentId: AgentId; reply?: string }> => {
  if (!process.env.API_KEY) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: AGENTS[AgentId.ORCHESTRATOR].systemPrompt,
        tools: orchestratorTools,
        temperature: 0, // Deterministic for routing
      }
    });

    // Check for Function Call
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const fnName = call.name;
      console.log(`Orchestrator routed to function: ${fnName}`);
      
      switch (fnName) {
        case 'routeToPatientMgmt': return { targetAgentId: AgentId.PATIENT_MGMT };
        case 'routeToAppointments': return { targetAgentId: AgentId.APPOINTMENTS };
        case 'routeToMedicalRecords': return { targetAgentId: AgentId.MEDICAL_RECORDS };
        case 'routeToBilling': return { targetAgentId: AgentId.BILLING };
        default: return { targetAgentId: AgentId.ORCHESTRATOR, reply: "I'm not sure where to send that request." };
      }
    }

    // If no function call, the Orchestrator replied directly (likely asking for clarification)
    return { 
      targetAgentId: AgentId.ORCHESTRATOR, 
      reply: response.text || "Could you please clarify your request?"
    };

  } catch (error) {
    console.error("Routing error:", error);
    return { targetAgentId: AgentId.ORCHESTRATOR, reply: "System error during routing." };
  }
};

/**
 * Step 2: The Specific Agent generates a response.
 */
export const generateAgentResponse = async (
  agentId: AgentId, 
  userMessage: string,
  history: string[] // Simplified history context
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key not found");

  const agent = AGENTS[agentId];

  try {
    // Construct a simple chat history context string
    const context = history.length > 0 ? `Conversation History:\n${history.join('\n')}\n\nCurrent Request: ` : '';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${context}${userMessage}`,
      config: {
        systemInstruction: agent.systemPrompt,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I cannot process that request right now.";
  } catch (error) {
    console.error(`Error generating response for ${agent.name}:`, error);
    return "Service temporarily unavailable.";
  }
};