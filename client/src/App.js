import React, { useState } from 'react';
import ICDashboard from './components/ICDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import DirectorDashboard from './components/DirectorDashboard';

function App() {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  const handleUserSelect = (e) => {
    const id = parseInt(e.target.value);
    setUserId(id);
    if (id === 1) setRole('IC');
    else if (id === 2) setRole('Manager');
    else if (id === 3) setRole('Director');
    else setRole('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center">Pyngyn Productivity Platform</h1>
      </header>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 max-w-md mx-auto">
          <label className="block text-lg font-medium text-gray-800 mb-2">Select User</label>
          <select
            value={userId}
            onChange={handleUserSelect}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select a user</option>
            <option value="1">Alice (Individual Contributor)</option>
            <option value="2">Bob (Manager)</option>
            <option value="3">Charlie (Director)</option>
          </select>
        </div>
        {role === 'IC' && <ICDashboard userId={userId} />}
        {role === 'Manager' && <ManagerDashboard userId={userId} />}
        {role === 'Director' && <DirectorDashboard userId={userId} />}
      </div>
    </div>
  );
}

export default App;