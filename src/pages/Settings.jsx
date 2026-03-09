import React, { useState } from 'react';

const Settings = () => {
  const [userPreferences, setUserPreferences] = useState({
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setUserPreferences({ ...userPreferences, [name]: checked });
  };

  return (
    <div className="bg-linear-to-r from-purple-600 via-blue-600 to-indigo-800 min-h-screen text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-center">Settings</h1>
        <div className="mt-8 max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block text-lg">Enable Notifications</label>
            <input
              type="checkbox"
              name="notifications"
              checked={userPreferences.notifications}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg">Enable Dark Mode</label>
            <input
              type="checkbox"
              name="darkMode"
              checked={userPreferences.darkMode}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <button className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;