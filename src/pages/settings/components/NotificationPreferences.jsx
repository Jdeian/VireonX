import React from 'react';
import { Bell } from 'lucide-react';

const NotificationPreferences = ({
  notifications,
  onNotificationChange,
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
          <Bell size={18} className="text-indigo-600" />
          Notification Preferences
        </h2>
      </div>

      <div className={`${compactView ? 'space-y-3 p-4' : 'space-y-4 p-6'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Email Notifications</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates via email</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={notifications.emailNotifications}
              onChange={onNotificationChange}
              className="peer sr-only"
            />
            <div className={switchClass} />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Push Notifications</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Browser push notifications</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="pushNotifications"
              checked={notifications.pushNotifications}
              onChange={onNotificationChange}
              className="peer sr-only"
            />
            <div className={switchClass} />
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Digest Frequency
          </label>
          <select
            name="digestFrequency"
            value={notifications.digestFrequency}
            onChange={onNotificationChange}
            className={`${inputClass} appearance-none`}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
          <p className="mb-2 font-medium text-slate-700 dark:text-slate-200">Notify me when:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="postScheduled"
                checked={notifications.postScheduled}
                onChange={onNotificationChange}
                className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">A post is scheduled</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="aiCaptionGenerated"
                checked={notifications.aiCaptionGenerated}
                onChange={onNotificationChange}
                className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">AI caption generation completes</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="analyticsReport"
                checked={notifications.analyticsReport}
                onChange={onNotificationChange}
                className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">Weekly analytics report is ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;