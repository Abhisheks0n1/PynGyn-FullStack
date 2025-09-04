import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DirectorDashboard({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      axios.get(`/api/dashboard/director?user_id=${userId}`)
        .then(response => setData(response.data))
        .catch(err => setError(err.message));
    }
  }, [userId]);

  if (error) return <div className="text-red-500 text-center text-lg font-medium">Error: {error}</div>;
  if (!data) return <div className="text-center text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Director Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Task Completion</h4>
            <p className="text-2xl font-bold text-green-600">{data.kpis.completion_percent}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Overdue Trends</h4>
            {Object.keys(data.kpis.overdue_trends).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-gray-700 font-semibold">Project</th>
                      <th className="p-3 text-gray-700 font-semibold">Overdue Tasks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.kpis.overdue_trends).map(([project, count]) => (
                      <tr key={project} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-600">{project}</td>
                        <td className="p-3 text-red-500">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No overdue tasks</p>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Quick Doc Usage</h3>
        {Object.keys(data.quick_doc_usage).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(data.quick_doc_usage).map(([space, count]) => (
              <div key={space} className="flex items-center">
                <span className="w-40 text-gray-600 font-medium">{space}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-500 h-4 rounded-full"
                    style={{ width: `${Math.min(count * 20, 100)}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-gray-600">{count} docs</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No quick doc usage data</p>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Executive Summary</h3>
        <div className="bg-blue-50 p-5 rounded-lg shadow-sm">
          <p className="text-gray-700 leading-relaxed">{data.executive_summary}</p>
        </div>
      </div>
    </div>
  );
}

export default DirectorDashboard;