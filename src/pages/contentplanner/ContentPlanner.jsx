import React, { useState } from 'react';
import AssistedPostTab from './AssistedPostTab';
import AutoModeTab from './AutoModeTab';

const ContentPlanner = () => {
  const [activeTab, setActiveTab] = useState('assisted');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Plan Your Content with AI-Powered Ease
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Create posts manually with AI help, or let AI manage recurring content
          generation, scheduling, and posting workflow for you.
        </p>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('assisted')}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'assisted'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            AI-Assisted Post
          </button>

          <button
            onClick={() => setActiveTab('auto')}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'auto'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            AI Auto Mode
          </button>
        </div>
      </div>

      {activeTab === 'assisted' ? <AssistedPostTab /> : <AutoModeTab />}
    </div>
  );
};

export default ContentPlanner;