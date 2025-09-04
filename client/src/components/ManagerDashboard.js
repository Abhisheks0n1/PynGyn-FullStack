import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagerDashboard({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      axios.get(`/api/dashboard/manager?user_id=${userId}`)
        .then(response => setData(response.data))
        .catch(err => setError(err.message));
    }
  }, [userId]);

  if (error) return <div className="text-red-500 text-center text-lg font-medium">Error: {error}</div>;
  if (!data) return <div className="text-center text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manager Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Project Overviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.project_overviews.map(project => (
            <div key={project.project_id} className="bg-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{project.project_name}</h4>
              <p className="text-gray-600">Completion: {project.completion_rate}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: project.completion_rate }}
                ></div>
              </div>
              <p className="text-gray-600">Pending Tasks: {project.pending_tasks}</p>
              <p className={project.blockers > 0 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                Blockers: {project.blockers}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Shared Quick Docs</h3>
        {data.shared_quick_docs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-gray-700 font-semibold">ID</th>
                  <th className="p-3 text-gray-700 font-semibold">Title</th>
                </tr>
              </thead>
              <tbody>
                {data.shared_quick_docs.map(doc => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-600">{doc.id}</td>
                    <td className="p-3 text-gray-600">{doc.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No shared quick docs</p>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Weekly Summary</h3>
        <div className="bg-blue-50 p-5 rounded-lg shadow-sm">
          <p className="text-gray-700 leading-relaxed">{data.weekly_summary}</p>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;