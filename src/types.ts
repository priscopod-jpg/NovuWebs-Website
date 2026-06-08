/**
 * Types for the NovuWebs AI Application
 */

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isStreaming?: boolean;
}

export interface ProblemCard {
  id: string;
  num: string;
  title: string;
  description: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  features: string[];
  details: string;
}

export interface ProcessStep {
  id: string;
  num: string;
  title: string;
  description: string;
  timeframe: string;
}

export interface CalculatorState {
  visitors: number;
  jobValue: number;
  conversionRate: number;
  unansweredRate: number;
}

export interface CalculatorOutputs {
  currentRevenue: number;
  potentialRevenue: number;
  leakage: number;
  totalLoss: number;
  annualLoss: number;
}
