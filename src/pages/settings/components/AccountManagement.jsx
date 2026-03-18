import React from 'react';
import { Lock, Key, AlertCircle } from 'lucide-react';

const AccountManagement = ({
  account,
  onAccountChange,
  onPasswordChange,
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
          <Lock size={18} className="text-indigo-600" />
          Account Management
        </h2>
      </div>

      <div className={`${compactView ? 'space-y-3 p-4' : 'space-y-4 p-6'}`}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              value={account.email}
              onChange={onAccountChange}
              className={inputClass}
            />
          </div>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            This email is used for login and notifications.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <button
            onClick={onPasswordChange}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Key size={16} />
            Change password
          </button>
        </div>

        <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">
                Two-factor authentication
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add an extra layer of security
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="twoFactor"
                checked={false}
                onChange={() => {}}
                className="peer sr-only"
                disabled
              />
              <div className={`${switchClass} cursor-not-allowed opacity-50`} />
            </label>
          </div>

          <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
            <AlertCircle size={12} />
            Coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;