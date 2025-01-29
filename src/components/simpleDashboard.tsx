import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { api } from '@/api';

const ITEMS_PER_PAGE = 10;

const SimpleDashboard = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [patients, setPatients] = useState({
    results: [],
    count: 0
  });
  const [conditions, setConditions] = useState({ results: [], count: 0 });
  const [observations, setObservations] = useState({ results: [], count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Insights data
  const [bmiData, setBmiData] = useState([]);
  const [bpData, setBpData] = useState([]);
  const [prevalenceData, setPrevalenceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'patients') {
          const data = await api.getPatients(currentPage);
          // Transform and paginate the data
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginatedData = Array.isArray(data) 
            ? data.slice(startIndex, startIndex + ITEMS_PER_PAGE)
            : [];
          
          setPatients({
            results: paginatedData,
            count: Array.isArray(data) ? data.length : 0
          });
        } else if (activeTab === 'conditions') {
          const data = await api.getConditions(currentPage);
          // Transform conditions data if it's an array
          const transformedData = {
            results: Array.isArray(data) ? data.slice(0, ITEMS_PER_PAGE) : [],
            count: Array.isArray(data) ? data.length : 0
          };
          setConditions(transformedData);
        } else if (activeTab === 'observations') {
          const data = await api.getObservations(currentPage);
          // Transform observations data if it's an array
          const transformedData = {
            results: Array.isArray(data) ? data.slice(0, ITEMS_PER_PAGE) : [],
            count: Array.isArray(data) ? data.length : 0
          };
          setObservations(transformedData);
        } else if (activeTab === 'insights') {
          const [bmi, bp, prevalence] = await Promise.all([
            api.getBMIByLocation(),
            api.getBPDistribution(),
            api.getConditionPrevalence('diabetes')
          ]);
          
          // Transform BMI data if needed
          const transformedBMI = Array.isArray(bmi) ? bmi : [];
          setBmiData(transformedBMI);
          console.log(transformedBMI);

          // Transform BP data if needed
          const transformedBP = Array.isArray(bp) ? bp.map(item => ({
            range: item.range || `${item.systolic}/${item.diastolic}`,
            count: item.count || 1
          })) : [];
          setBpData(transformedBP);
          console.log(transformedBP);

          // Transform prevalence data if needed
          setPrevalenceData(Array.isArray(prevalence) ? prevalence : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage]);

  const renderPagination = (totalCount) => (
    <div className="mt-4 flex justify-center gap-4">
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Previous
      </button>
      <span className="py-2">
        Page {currentPage} of {Math.ceil(totalCount / ITEMS_PER_PAGE)}
      </span>
      <button
        onClick={() => setCurrentPage(prev => prev + 1)}
        disabled={totalCount <= currentPage * ITEMS_PER_PAGE}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );

  const renderPatientTable = () => (
    <>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Birth Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(patients.results) && patients.results.map((patient, index) => (
            <tr key={patient.id || index}>
              <td className="border p-2">{patient.id}</td>
              <td className="border p-2">{patient.age}</td>
              <td className="border p-2">{patient.gender}</td>
              <td className="border p-2">{patient.birthdate}</td>
            </tr>
          ))}
          {(!Array.isArray(patients.results) || patients.results.length === 0) && (
            <tr>
              <td colSpan={4} className="border p-2 text-center">No patients found</td>
            </tr>
          )}
        </tbody>
      </table>
      {renderPagination(patients.count)}
    </>
  );

  const renderConditionsTable = () => (
    <>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Patient ID</th>
            <th className="border p-2">Condition</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(conditions.results) && conditions.results.map((condition, index) => (
            <tr key={index}>
              <td className="border p-2">{condition.patient}</td>
              <td className="border p-2">{condition. description}</td>
              <td className="border p-2">{condition.start_date
}</td>
            </tr>
          ))}
          {(!Array.isArray(conditions.results) || conditions.results.length === 0) && (
            <tr>
              <td colSpan={3} className="border p-2 text-center">No conditions found</td>
            </tr>
          )}
        </tbody>
      </table>
      {renderPagination(conditions.count)}
    </>
  );

  const renderObservationsTable = () => (
    <>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Patient ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(observations.results) && observations.results.map((observation, index) => (
            <tr key={index}>
              <td className="border p-2">{observation.patient_id}</td>
              <td className="border p-2">{observation.description}</td>
              <td className="border p-2">{observation.value}</td>
              <td className="border p-2">{observation.date}</td>
            </tr>
          ))}
          {(!Array.isArray(observations.results) || observations.results.length === 0) && (
            <tr>
              <td colSpan={4} className="border p-2 text-center">No observations found</td>
            </tr>
          )}
        </tbody>
      </table>
      {renderPagination(observations.count)}
    </>
  );

  const renderInsights = () => (
    <div className="space-y-8">
      {bmiData.length > 0 && (
        <div>
          <h3 className="font-bold mb-4">Average BMI by Location</h3>
          <BarChart width={600} height={300} data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avg_bmi" fill="#82ca9d" />
          </BarChart>
        </div>
      )}
      
      {bpData.length > 0 && (
        <div>
          <h3 className="font-bold mb-4">Blood Pressure Distribution</h3>
          <LineChart width={600} height={300} data={bpData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    switch (activeTab) {
      case 'patients':
        return renderPatientTable();
      case 'conditions':
        return renderConditionsTable();
      case 'observations':
        return renderObservationsTable();
      case 'insights':
        return renderInsights();
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Healthcare Data Dashboard</h1>
      
      <div className="mb-6">
        <div className="border-b">
          {['patients', 'conditions', 'observations', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // Reset page when changing tabs
              }}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SimpleDashboard;