"use client"
import { useState } from 'react';
import { PredictionRequest, PredictionResponse } from '../types';

export default function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [formData, setFormData] = useState<PredictionRequest>({
    gender: 'MALE',
    age: 33,
    bmi: 50,
    sys_bp: 70,
    dia_bp: 75,
    heart_rate: 70
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/predict-condition/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? value : Number(value)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Condition Prediction</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        {[
          { name: 'age', label: 'Age', min: 0, max: 120 },
          { name: 'bmi', label: 'BMI', min: 10, max: 50, step: 0.1 },
          { name: 'sys_bp', label: 'Systolic BP', min: 70, max: 200 },
          { name: 'dia_bp', label: 'Diastolic BP', min: 40, max: 130 },
          { name: 'heart_rate', label: 'Heart Rate', min: 40, max: 200 }
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name as keyof PredictionRequest]}
              onChange={handleInputChange}
              min={field.min}
              max={field.max}
              step={field.step}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Predicting...' : 'Predict Conditions'}
        </button>
      </form>

      {predictions && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Predicted Conditions</h3>
          <div className="space-y-2">
            {predictions.predictions.map((prediction, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
              >
                <span>{prediction.condition}</span>
                <span className="font-medium">
                  {(prediction.likelihood * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}