export interface Patient {
  id: number;
  gender: string;
  birthdate: string;
  age: number;
  bmi: number;
  sys_bp: number;
  dia_bp: number;
  heart_rate: number;
  bp_category: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  next: string | null;
  previous: string | null;
  count: number;
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

export interface ConditionPrevalence {
  location: string;
  prevalence_count: number;
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}
// BMI Data
interface BMIData {
  location: string;
  avg_bmi: number;
}

// BP Data
interface BPData {
  range: string;
  count: number;
}

// Or alternatively for BP
interface BPData {
  systolic: number;
  diastolic: number;
  count: number;
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
