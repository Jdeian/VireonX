import React from 'react';
import { Bell } from 'lucide-react';
import { Label } from '@common/components/shadcn/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@common/components/shadcn/select';

const NotificationPreferences = ({ notifications, onNotificationChange }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <Bell size={18} className="text-indigo-600" />
          Notification Preferences
        </h2>
      </div>

      <div className="space-y-5 p-6">
        {/* Email notifications toggle */}
        {[
          { name: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
          { name: 'pushNotifications',  label: 'Push Notifications',  desc: 'Browser push notifications' },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name={item.name}
                checked={notifications[item.name]}
                onChange={onNotificationChange}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full dark:bg-slate-700" />
            </label>
          </div>
        ))}

        {/* Digest frequency */}
        <div className="space-y-2">
          <Label>Digest Frequency</Label>
          <Select
            value={notifications.digestFrequency}
            onValueChange={(v) => onNotificationChange({ target: { name: 'digestFrequency', value: v, type: 'select' } })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notify when */}
        <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Notify me when:</p>
          {[
            { name: 'postScheduled',      label: 'A post is scheduled' },
            { name: 'aiCaptionGenerated', label: 'AI caption generation completes' },
            { name: 'analyticsReport',    label: 'Weekly analytics report is ready' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <input
                type="checkbox"
                name={item.name}
                checked={notifications[item.name]}
                onChange={onNotificationChange}
                className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;