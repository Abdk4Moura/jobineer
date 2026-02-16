export enum ActionType {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  LINK = 'LINK',
  MIXED = 'MIXED'
}

export enum JobStatus {
  INBOX = 'INBOX',
  APPLIED = 'APPLIED',
  INTERVIEWING = 'INTERVIEWING',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED'
}

export interface JobApplication {
  id: string;
  companyName: string;
  roleTitle: string;
  actionType: ActionType;
  contactTarget: string; // Email, Phone, or URL
  summary: string;
  rawContent: string;
  status: JobStatus;
  createdAt: number;
}

export interface JobStats {
  total: number;
  inbox: number;
  applied: number;
  interviewing: number;
  offers: number;
}
