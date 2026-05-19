export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface ScanCondition {
  name: string;
  detected: boolean;
  confidence: number;
  severity?: "low" | "medium" | "high";
}

export interface ScanResult {
  id: string;
  userId: string;
  imageUrl?: string;
  overallScore: number; // 0-100 healthy gum percentage
  confidenceScore: number;
  conditions: ScanCondition[];
  summary: string;
  recommendation: string;
  urgency: "low" | "medium" | "high";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: number; // km
  rating: number;
  isOpen: boolean;
  hours: string;
  phone?: string;
  lat: number;
  lng: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
