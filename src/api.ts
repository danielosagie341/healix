import { BPDistribution, Condition, ConditionPrevalence, LocationBMI, Observation, PaginatedResponse, Patient, PredictionRequest, PredictionResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  async getPatients(page = 1, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    const response = await fetch(`${API_BASE_URL}/datasets/patients/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json() as Promise<PaginatedResponse<Patient>>;
  },

  async getConditions(page = 1, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    const response = await fetch(`${API_BASE_URL}/datasets/conditions/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch conditions');
    return response.json() as Promise<PaginatedResponse<Condition>>;
  },

  async getObservations(page = 1, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    const response = await fetch(`${API_BASE_URL}/datasets/observations/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch observations');
    return response.json() as Promise<PaginatedResponse<Observation>>;
  },

  async uploadDataset(type: 'patients' | 'conditions' | 'observations', file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/datasets/upload/${type}/`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to upload ${type} dataset`);
    }
    
    return response.json();
  },

  async getConditionPrevalence(conditionName: string) {
    const response = await fetch(`${API_BASE_URL}/insights/condition-prevalence/?condition_name=${encodeURIComponent(conditionName)}`);
    if (!response.ok) throw new Error('Failed to fetch condition prevalence');
    return response.json() as Promise<ConditionPrevalence[]>;
  },

  async getBMIByLocation() {
    const response = await fetch(`${API_BASE_URL}/insights/avg-bmi-by-location/`);
    if (!response.ok) throw new Error('Failed to fetch BMI by location');
    return response.json() as Promise<LocationBMI[]>;
  },

  async getBPDistribution() {
    const response = await fetch(`${API_BASE_URL}/insights/bp-distribution/`);
    if (!response.ok) throw new Error('Failed to fetch BP distribution');
    return response.json() as Promise<BPDistribution[]>;
  },

  async predictCondition(patientData: PredictionRequest) {
    const response = await fetch(`${API_BASE_URL}/predictions/predict-condition/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    if (!response.ok) throw new Error('Failed to get prediction');
    return response.json() as Promise<PredictionResponse>;
  },
};