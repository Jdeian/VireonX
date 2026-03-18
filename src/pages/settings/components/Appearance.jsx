import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const Appearance = ({
  sectionCardClass,
  sectionHeaderClass,
  switchClass,
}) => {
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

    localStorage.setItem(
      'theme',
      JSON.stringify({ darkMode: checked })
    );

    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={sectionCardClass}>
      <div className={sectionHeaderClass}>
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
              <span className="block text-sm text-slate-700 dark:text-slate-200">
                Dark Mode
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Switch between light and dark theme
              </span>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeChange}
              className="peer sr-only"
            />
            <div className={switchClass} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Appearance;