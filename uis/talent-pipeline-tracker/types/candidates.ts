export type CandidateStatus =
  | "pending"
  | "received"
  | "in_progress"
  | "selected"
  | "discarded"
  | string;

export interface CandidateRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage?: string | null;
  experience_years: number | null;
  notes_count?: number;
  applied_at: string;
  updated_at: string;
}

export interface CandidateNote {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface CandidateListResponse {
  total: number;
  page: number;
  limit: number;
  data: CandidateRecord[];
}

export interface CandidateNotesResponse {
  data: CandidateNote[];
  meta?: {
    total?: number;
  };
}

export interface CreateCandidatePayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  status: CandidateStatus;
  stage?: string;
  linkedin_url?: string;
  cv_url?: string;
  experience_years: number;
}

export interface UpdateCandidatePayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  status: CandidateStatus;
  stage?: string;
  linkedin_url?: string;
  cv_url?: string;
  experience_years: number;
}

export interface PatchCandidateStatusPayload {
  status?: CandidateStatus;
  stage?: string;
}
