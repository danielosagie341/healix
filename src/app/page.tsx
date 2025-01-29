"use client"
import { useState } from 'react';
import DatasetUploader from '@/components/DatasetUploader';
import PatientsTable from '@/components/PatientsTable';
import PredictionForm from '@/components/PredictionForm';
import ObservationsPage from '@/components/ObservationPage';
import SimpleDashboard from '@/components/simpleDashboard';

export default function Home() {
  const [shouldRefreshTable, setShouldRefreshTable] = useState(false);

  // Callback to trigger table refresh after successful upload
  const handleDatasetUpload = () => {
    setShouldRefreshTable(true);
  };

  // Callback to reset refresh flag after table updates
  const handleTableRefresh = () => {
    setShouldRefreshTable(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">

        <SimpleDashboard />

        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Patient Data Management</h1>
          <DatasetUploader onUploadSuccess={handleDatasetUpload} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <PredictionForm />
        </div>
      </div>
    </div>
  );
}
