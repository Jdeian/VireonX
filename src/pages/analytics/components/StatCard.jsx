import React from 'react';

const StatCard = ({ label, value, icon: Icon, bg, color }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className={`inline-flex rounded-lg p-3 ${bg}`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

export default StatCard;