import React, { useState } from 'react';
import { Globe, Loader2, ExternalLink } from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { auth } from '@common/services/config';
import { Button } from '@common/components/shadcn/button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const PLATFORMS = [
  { id: 'facebook',  label: 'Facebook',  icon: Facebook,  color: 'bg-blue-600' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-pink-500 to-purple-600' },
  { id: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'bg-sky-500' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: Linkedin,  color: 'bg-blue-700' },
];

const ConnectedAccounts = ({ profileData }) => {
  const [connecting, setConnecting] = useState(null);
  const [error, setError]           = useState('');

  const handleConnect = async (platformId) => {
    if (platformId !== 'facebook') return; // other platforms not built yet

    try {
      setConnecting(platformId);
      setError('');
      const user = auth.currentUser;
      if (!user) return;
      const idToken  = await user.getIdToken();
      const returnTo = `${window.location.origin}${window.location.pathname}`;
      const params   = new URLSearchParams({ token: idToken, returnTo });
      window.location.href = `${API_BASE_URL}/auth/facebook/start?${params.toString()}`;
    } catch (err) {
      setError('Failed to start connection. Please try again.');
      setConnecting(null);
    }
  };

  const handleDisconnect = (platformId) => {
    // Disconnect logic to be wired up when needed
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <Globe size={18} className="text-indigo-600" />
          Connected Accounts
        </h2>
      </div>

      <div className="space-y-2 p-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        {PLATFORMS.map((platform) => {
          const isConnected = !!profileData?.connectedAccounts?.[platform.id];
          const pageName    = platform.id === 'facebook' ? profileData?.facebookPageName : null;
          const isLoading   = connecting === platform.id;

          return (
            <div
              key={platform.id}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              {/* Left — icon + name + connected badge */}
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${platform.color}`}>
                  <platform.icon size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {platform.label}
                    </p>
                    {isConnected && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        Connected
                      </span>
                    )}
                  </div>
                  {isConnected && pageName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{pageName}</p>
                  )}
                </div>
              </div>

              {/* Right — connect or disconnect button */}
              {isConnected ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDisconnect(platform.id)}
                  className="text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleConnect(platform.id)}
                  className="gap-1.5 text-xs bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading
                    ? <Loader2 size={13} className="animate-spin" />
                    : <><ExternalLink size={13} />Connect</>
                  }
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectedAccounts;