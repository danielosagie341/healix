"use client"
import { useState, useEffect } from 'react';
import { Patient, PaginatedResponse } from '../types';
import { api } from '@/api';

export default function PatientsTable() {
  const [patients, setPatients] = useState<PaginatedResponse<Patient> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await api.getPatients(page);
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!patients) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
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
          {patients.results && patients.results.map((patient) => (
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
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!patients.next}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}