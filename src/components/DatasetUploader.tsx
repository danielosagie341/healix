"use client"
import { useState } from 'react';
import Papa from 'papaparse';

type DatasetType = 'patients' | 'conditions' | 'observations';

interface UploadResponse {
  status: string;
}

interface DatasetUploaderProps {
  onUploadSuccess?: (type: DatasetType) => void;
}

interface ObservationRow {
  DATE: string;
  PATIENT: string;
  DESCRIPTION: string;
  VALUE: string;
}

export default function DatasetUploader({ onUploadSuccess }: DatasetUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValidDate = (dateStr: string): boolean => {
    // Check common date formats
    const dateFormats = [
      // ISO format
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?$/,
      // US format
      /^\d{2}\/\d{2}\/\d{4}$/,
      // European format
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{2}\.\d{2}\.\d{4}$/
    ];

    // Check if the string matches any of the formats
    const matchesFormat = dateFormats.some(format => format.test(dateStr));
    if (!matchesFormat) return false;

    // Try parsing the date
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const validateObservationsCSV = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Papa.parse<ObservationRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
            return;
          }

          // Validate required columns
          const requiredColumns = ['DATE', 'PATIENT', 'DESCRIPTION', 'VALUE'];
          const headers = results.meta.fields || [];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          
          if (missingColumns.length > 0) {
            reject(new Error(`Missing required columns: ${missingColumns.join(', ')}`));
            return;
          }

          // Validate date format for each row
          for (let i = 0; i < results.data.length; i++) {
            const row = results.data[i];
            if (!isValidDate(row.DATE)) {
              reject(new Error(
                `Invalid date format in row ${i + 1}: "${row.DATE}". ` +
                'Accepted formats: YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY, ' +
                'DD.MM.YYYY, or ISO datetime'
              ));
              return;
            }
          }

          resolve(true);
        },
        error: function(error) {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  };

  const handleUpload = async (type: DatasetType, file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate CSV if it's observations
      if (type === 'observations') {
        await validateObservationsCSV(file);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/datasets/upload/${type}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload ${type} dataset`);
      }

      const data: UploadResponse = await response.json();
      setSuccess(`Successfully uploaded ${type} dataset: ${data.status}`);
      
      if (onUploadSuccess) {
        onUploadSuccess(type);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to upload ${type} dataset`;
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dataset Upload</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {(['patients', 'conditions', 'observations'] as DatasetType[]).map((type) => (
        <div key={type} className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2 capitalize">{type} Dataset</h3>
          
          {type === 'observations' && (
            <div className="text-sm text-gray-600 mb-2">
              <div>Required columns: DATE, PATIENT, DESCRIPTION, VALUE</div>
              <div>Accepted date formats:</div>
              <ul className="list-disc ml-4">
                <li>YYYY-MM-DD (e.g., 2024-01-28)</li>
                <li>MM/DD/YYYY (e.g., 01/28/2024)</li>
                <li>DD-MM-YYYY (e.g., 28-01-2024)</li>
                <li>DD.MM.YYYY (e.g., 28.01.2024)</li>
                <li>ISO datetime (e.g., 2024-01-28T15:30:00Z)</li>
              </ul>
            </div>
          )}
          
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(type, file);
            }}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {uploading && (
            <div className="mt-2 text-sm text-gray-600">
              Uploading {type}...
            </div>
          )}
        </div>
      ))}
    </div>
  );
}