export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TaxDeadline {
  id: string;
  title: string;
  dueDate: string;
  category: 'VAT' | 'PAYE' | 'Income Tax' | 'Statutory' | 'Annual';
  description: string;
  penaltyEstimate: string;
}

export interface ComplianceQuestion {
  id: string;
  question: string;
  category: 'registration' | 'bookkeeping' | 'employees' | 'filing';
  options: {
    text: string;
    points: number;
    tip: string;
  }[];
}

export interface ConsultationSlot {
  id: string;
  time: string;
  advisor: string;
  role: string;
  avatar: string;
}

export interface Booking {
  id: string;
  slotId: string;
  date: string;
  time: string;
  advisor: string;
  service: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface AnalyzedDocument {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  extractedData?: {
    merchantName?: string;
    invoiceDate?: string;
    totalAmount?: string;
    vatAmount?: string;
    category?: string;
    summary?: string;
    confidenceScore?: number;
    auditAdvice?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  employeeCount: number;
  isPremium: boolean;
  registrationStatus: {
    businessName: boolean;
    incorporation: boolean;
    kraPin: boolean;
    taxCompliance: boolean;
    statutoryReg: boolean;
    businessPermit: boolean;
  };
}
