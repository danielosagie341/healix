"use client"
import { useState, useEffect } from 'react';
import { Patient, PaginatedResponse } from '../types';
import { api } from '@/api';

interface PatientsTableProps {
  refresh?: boolean;
  onRefreshComplete?: () => void;
}

export default function PatientsTable({ refresh, onRefreshComplete }: PatientsTableProps) {
  const [patients, setPatients] = useState<PaginatedResponse<Patient> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await api.getPatients(page);
      // Ensure data has the expected structure
      if (data && Array.isArray(data.results)) {
        setPatients(data);
      } else {
        throw new Error('Invalid data format received');
      }
      if (onRefreshComplete) {
        onRefreshComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      setPatients(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  useEffect(() => {
    if (refresh) {
      fetchPatients();
    }
  }, [refresh]);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-600 p-4 text-center">
      {error}
    </div>
  );

  if (!patients || !patients.results || !Array.isArray(patients.results) || patients.results.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No patients data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP Category</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.results.map((patient) => (
            <tr key={patient.id}>
              <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
              <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
              <td className="px-6 py-4 whitespace-nowrap">{patient.bmi}</td>
              <td className="px-6 py-4 whitespace-nowrap">{patient.bp_category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={!patients.previous}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!patients.next}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}