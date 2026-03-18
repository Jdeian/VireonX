import React from 'react';
import { Globe } from 'lucide-react';

const ConnectedAccounts = ({
  connectedAccounts,
  onToggleAccount,
  sectionCardClass,
  sectionHeaderClass,
}) => {
  return (
    <div className={sectionCardClass}>
      <div className={sectionHeaderClass}>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <Globe size={18} className="text-indigo-600" />
          Connected Accounts
        </h2>
      </div>

      <div className="space-y-3 p-4">
        {connectedAccounts.map((account, index) => (
          <div
            key={account.platform}
            className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                  account.platform === 'Instagram'
                    ? 'bg-linear-to-br from-pink-500 to-purple-600'
                    : account.platform === 'Facebook'
                    ? 'bg-blue-600'
                    : account.platform === 'Twitter'
                    ? 'bg-sky-500'
                    : 'bg-blue-700'
                }`}
              >
                <account.icon size={16} />
              </div>

              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">{account.platform}</p>
                {account.connected && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{account.username}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => onToggleAccount(index)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                account.connected
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {account.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedAccounts;