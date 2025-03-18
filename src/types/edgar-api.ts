
// EDGAR API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthTokens {
  filerApiToken: string;
  userApiToken: string;
}

export interface DraftSubmission {
  submissionID: string;
  formType: string;
  cik: string;
  submissionStatus: string;
  createdAt: string;
  modifiedAt: string;
}

export interface Filing {
  accessionNumber: string;
  filingDate: string;
  formType: string;
  primaryDocDescription: string;
  primaryDocUrl: string;
}

export interface Filer {
  cik: string;
  entityName: string;
  irsNumber?: string;
}

export interface FormTypeVersion {
  formType: string;
  version: string;
  descriptiveName: string;
  category: string;
  isActive: boolean;
}

export enum SubmissionStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  REJECTED = "REJECTED"
}

export interface UploadResult {
  uploadID: string;
  fileName: string;
  status: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  location?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  location?: string;
}

export interface EdgarCredentials {
  username: string;
  password: string;
  clientID: string;
  clientSecret: string;
}

// Add Badge variant types to fix the other error
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
