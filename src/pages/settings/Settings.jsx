import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@common/services/config';
import { getProfile, updateProfile } from '@common/services/profileService';
import AccountManagement from './components/AccountManagement';
import NotificationPreferences from './components/NotificationPreferences';
import AIPreferences from './components/AIPreferences';
import ConnectedAccounts from './components/ConnectedAccounts';
import Appearance from './components/Appearance';
import SettingsSkeleton from './components/SettingsSkeleton';

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    digestFrequency: 'daily',
    postScheduled: true,
    aiCaptionGenerated: true,
    analyticsReport: false,
  });

  const loadProfile = useCallback(async (user) => {
    try {
      setLoading(true);
      const profile = await getProfile(user.uid);
      setProfileData(profile);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) loadProfile(user);
    });
    return () => unsubscribe();
  }, [loadProfile]);

  // Notifications stay in localStorage — no backend yet
  useEffect(() => {
    const saved = localStorage.getItem('vireonx-notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  const handleNotificationChange = (e) => {
    const { name, type, checked, value } = e.target;
    const updated = { ...notifications, [name]: type === 'checkbox' ? checked : value };
    setNotifications(updated);
    localStorage.setItem('vireonx-notifications', JSON.stringify(updated));
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Account & Preferences
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Customize your account settings, manage preferences, and configure integrations.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AccountManagement />

          <AIPreferences
            profileData={profileData}
            onSave={async (updates) => {
              const user = auth.currentUser;
              if (!user) return;
              await updateProfile(user.uid, updates);
              setProfileData((prev) => ({ ...prev, ...updates }));
            }}
          />

          <NotificationPreferences
            notifications={notifications}
            onNotificationChange={handleNotificationChange}
          />
        </div>

        <div className="space-y-6">
          <ConnectedAccounts profileData={profileData} />
          <Appearance />
        </div>
      </div>
    </div>
  );
};

export default Settings;