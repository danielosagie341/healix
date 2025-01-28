export interface Patient {
  id: string;
  gender: 'MALE' | 'FEMALE';
  birthdate: string;
  age: number;
  bmi: number;
  sys_bp: number;
  dia_bp: number;
  heart_rate: number;
  bp_category: string;
}

export interface Condition {
  id: number;
  patient: string;
  description: string;
  start_date: string;
}

export interface Observation {
  date: string;
  patient: string;
  description: string;
  value: string | number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ConditionPrevalence {
  location: string;
  prevalence_count: number;
}

export interface LocationBMI {
  location: string;
  average_bmi: number;
}

export interface BPDistribution {
  bp_category: string;
  count: number;
  percentage: string;
}

export interface PredictionRequest {
  gender: 'MALE' | 'FEMALE';
  age: number;
  bmi: number;
  sys_bp: number;
  dia_bp: number;
  heart_rate: number;
}

export interface PredictionResponse {
  predictions: {
    condition: string;
    likelihood: number;
  }[];
}