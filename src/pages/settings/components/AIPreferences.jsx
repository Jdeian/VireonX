import React from 'react';
import { Sparkles } from 'lucide-react';

const AIPreferences = ({
  aiPreferences,
  onAiChange,
  sectionCardClass,
  sectionHeaderClass,
  inputClass,
  switchClass,
  compactView,
}) => {
  return (
    <div className={sectionCardClass}>
      <div className={sectionHeaderClass}>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <Sparkles size={18} className="text-indigo-600" />
          AI Preferences
        </h2>
      </div>

      <div className={`${compactView ? 'space-y-3 p-4' : 'space-y-4 p-6'}`}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Default Tone
          </label>
          <select
            name="defaultTone"
            value={aiPreferences.defaultTone}
            onChange={onAiChange}
            className={inputClass}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Caption Length
          </label>
          <select
            name="captionLength"
            value={aiPreferences.captionLength}
            onChange={onAiChange}
            className={inputClass}
          >
            <option value="short">Short (under 100 chars)</option>
            <option value="medium">Medium (100-200 chars)</option>
            <option value="long">Long (200-280 chars)</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Auto-optimize posting time</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI suggests best times to post</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="autoOptimizeTime"
              checked={aiPreferences.autoOptimizeTime}
              onChange={onAiChange}
              className="peer sr-only"
            />
            <div className={switchClass} />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Include hashtags</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI adds relevant hashtags</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="includeHashtags"
              checked={aiPreferences.includeHashtags}
              onChange={onAiChange}
              className="peer sr-only"
            />
            <div className={switchClass} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default AIPreferences;