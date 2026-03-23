import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const Appearance = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedAppearance = localStorage.getItem('theme');
    if (savedAppearance) {
      const parsedAppearance = JSON.parse(savedAppearance);
      const isDark = parsedAppearance.darkMode ?? false;
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleDarkModeChange = (e) => {
    const checked = e.target.checked;
    setDarkMode(checked);
    localStorage.setItem('theme', JSON.stringify({ darkMode: checked }));
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          {darkMode ? (
            <Moon size={18} className="text-indigo-600" />
          ) : (
            <Sun size={18} className="text-indigo-600" />
          )}
          Appearance
        </h2>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {darkMode ? (
              <Moon size={16} className="text-slate-500 dark:text-slate-400" />
            ) : (
              <Sun size={16} className="text-slate-500 dark:text-slate-400" />
            )}
            <div>
              <span className="block text-sm text-slate-700 dark:text-slate-200">Dark Mode</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark theme</span>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeChange}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Appearance;