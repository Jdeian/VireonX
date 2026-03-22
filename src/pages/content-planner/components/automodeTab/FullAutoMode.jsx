import React from 'react';

const FullAutoMode = ({ autoPostingEnabled, scheduledSuggestions, visible }) => {
  if (!visible) return null;

  if (autoPostingEnabled) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          Autopilot enabled
        </p>
        <p className="mt-1 text-sm text-emerald-700/90 dark:text-emerald-200">
          {scheduledSuggestions.filter(p => p.status === 'auto-managed').length} post(s) scheduled automatically.
          {scheduledSuggestions.filter(p => p.status === 'failed').length > 0 && (
            <span className="ml-1 text-red-600 dark:text-red-400">
              {scheduledSuggestions.filter(p => p.status === 'failed').length} failed — only Facebook is supported right now.
            </span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Autopilot is off
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Your settings are ready. Turn on Auto Posting to let AI generate and manage the queue automatically.
      </p>
    </div>
  );
};

export default FullAutoMode;