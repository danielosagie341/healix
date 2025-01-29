"use client"
import { useState, useEffect } from 'react';
import DatasetUploader from './DatasetUploader';
import { Observation } from '@/types';
import { api } from '@/api';

export default function ObservationsPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchObservations = async () => {
    try {
      setLoading(true);
      const response = await api.getObservations();
      setObservations(response.results);
      setError(null);
    } catch (err) {
      setError('Failed to fetch observations');
      console.error('Error fetching observations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchObservations();
  }, []);

  // Handle successful upload
  const handleUploadSuccess = (type: 'patients' | 'conditions' | 'observations') => {
    if (type === 'observations') {
      fetchObservations(); // Refresh the observations data
    }
  };

  return (
    <div className="space-y-8">
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {loading ? (
        <div>Loading observations...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {observations && observations.map((observation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{observation.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{observation.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{observation.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{observation.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}