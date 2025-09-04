import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ICDashboard({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      axios.get(`/api/dashboard/ic?user_id=${userId}`)
        .then(response => setData(response.data))
        .catch(err => setError(err.message));
    }
  }, [userId]);

  if (error) return <div className="text-red-500 text-center text-lg font-medium">Error: {error}</div>;
  if (!data) return <div className="text-center text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Individual Contributor Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">My Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <h4 className="text-lg font-medium text-green-600 mb-3">Pending</h4>
            {data.my_tasks.pending.length > 0 ? (
              <ul className="space-y-2">
                {data.my_tasks.pending.map(task => (
                  <li key={task.id} className="text-gray-600 hover:text-gray-800 transition">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-gray-500"> (Due: {new Date(task.due_date).toLocaleDateString()})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No pending tasks</p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <h4 className="text-lg font-medium text-yellow-600 mb-3">Due Soon</h4>
            {data.my_tasks.due_soon.length > 0 ? (
              <ul className="space-y-2">
                {data.my_tasks.due_soon.map(task => (
                  <li key={task.id} className="text-gray-600 hover:text-gray-800 transition">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-gray-500"> (Due: {new Date(task.due_date).toLocaleDateString()})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No tasks due soon</p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <h4 className="text-lg font-medium text-red-600 mb-3">Overdue</h4>
            {data.my_tasks.overdue.length > 0 ? (
              <ul className="space-y-2">
                {data.my_tasks.overdue.map(task => (
                  <li key={task.id} className="text-red-500 hover:text-red-700 transition">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-red-400"> (Due: {new Date(task.due_date).toLocaleDateString()})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No overdue tasks</p>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">My Quick Docs</h3>
        {data.my_quick_docs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-gray-700 font-semibold">ID</th>
                  <th className="p-3 text-gray-700 font-semibold">Title</th>
                </tr>
              </thead>
              <tbody>
                {data.my_quick_docs.map(doc => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-600">{doc.id}</td>
                    <td className="p-3 text-gray-600">{doc.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No quick docs available</p>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
        {data.recent_activity.length > 0 ? (
          <div className="space-y-4">
            {data.recent_activity.map(activity => (
              <div key={activity.id} className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                <span className={`w-3 h-3 rounded-full mr-3 ${activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <div>
                  <p className="text-gray-600 font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">Status: {activity.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No recent activity</p>
        )}
      </div>
    </div>
  );
}

export default ICDashboard;