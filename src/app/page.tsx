import DatasetUploader from '@/components/DatasetUploader';
import PatientsTable from '../components/PatientsTable';
import PredictionForm from '@/components/PredictionForm';
import ObservationsPage from '@/components/observationPage';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="space-y-8">
        <PatientsTable />
        <DatasetUploader />
        <PredictionForm />
      </div>
    </main>
  );
}