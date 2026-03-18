import React, { useEffect, useState } from 'react';
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Save,
} from 'lucide-react';
import AccountManagement from './components/AccountManagement';
import NotificationPreferences from './components/NotificationPreferences';
import AIPreferences from './components/AIPreferences';
import ConnectedAccounts from './components/ConnectedAccounts';
import Appearance from './components/Appearance';

const Settings = () => {
  const [account, setAccount] = useState({
    email: 'john@vireonx.com',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    digestFrequency: 'daily',
    postScheduled: true,
    aiCaptionGenerated: true,
    analyticsReport: false,
  });

  const [connectedAccounts, setConnectedAccounts] = useState([
    { platform: 'Instagram', icon: Instagram, connected: true, username: '@john_ai' },
    { platform: 'Facebook', icon: Facebook, connected: true, username: 'John Jedric' },
    { platform: 'Twitter', icon: Twitter, connected: false, username: '' },
    { platform: 'LinkedIn', icon: Linkedin, connected: false, username: '' },
  ]);

  const [aiPreferences, setAiPreferences] = useState({
    defaultTone: 'professional',
    captionLength: 'medium',
    autoOptimizeTime: true,
    includeHashtags: true,
  });

  useEffect(() => {
    const savedAccount = localStorage.getItem('vireonx-account');
    const savedNotifications = localStorage.getItem('vireonx-notifications');
    const savedAiPreferences = localStorage.getItem('vireonx-ai-preferences');
    const savedConnectedAccounts = localStorage.getItem('vireonx-connected-accounts');

    if (savedAccount) setAccount(JSON.parse(savedAccount));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedAiPreferences) setAiPreferences(JSON.parse(savedAiPreferences));
    if (savedConnectedAccounts) setConnectedAccounts(JSON.parse(savedConnectedAccounts));
  }, []);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAiChange = (e) => {
    const { name, type, checked, value } = e.target;
    setAiPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleAccount = (index) => {
    setConnectedAccounts((prev) =>
      prev.map((acc, i) =>
        i === index ? { ...acc, connected: !acc.connected } : acc
      )
    );
  };

  const handleSave = () => {
    localStorage.setItem('vireonx-account', JSON.stringify(account));
    localStorage.setItem('vireonx-notifications', JSON.stringify(notifications));
    localStorage.setItem('vireonx-ai-preferences', JSON.stringify(aiPreferences));
    localStorage.setItem('vireonx-connected-accounts', JSON.stringify(connectedAccounts));

    alert('Settings saved successfully!');
  };

  const handlePasswordChange = () => {
    alert('Password change functionality – would open a modal or form.');
  };

  const sectionCardClass = `
    bg-white dark:bg-slate-900
    rounded-xl border border-slate-200 dark:border-slate-800
    shadow-sm overflow-hidden transition-colors
  `;

  const sectionHeaderClass = `
    px-6 py-4 border-b border-slate-100 dark:border-slate-800
    bg-slate-50 dark:bg-slate-950/70
  `;

  const inputClass = `
    w-full px-3 py-2 border border-slate-200 dark:border-slate-700
    rounded-lg bg-white dark:bg-slate-800
    text-slate-800 dark:text-slate-100
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    transition-colors
  `;

  const switchClass = `
    w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full
    peer peer-checked:bg-indigo-600
    after:content-[''] after:absolute after:top-0.5 after:left-0.5
    after:bg-white after:border after:border-slate-300
    after:rounded-full after:h-5 after:w-5 after:transition-all
    peer-checked:after:translate-x-full
  `;

  return (
    <div className="min-h-screen space-y-6 transition-colors">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Account & Preferences
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Customize your account settings, manage preferences, and configure integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AccountManagement
            account={account}
            onAccountChange={handleAccountChange}
            onPasswordChange={handlePasswordChange}
            sectionCardClass={sectionCardClass}
            sectionHeaderClass={sectionHeaderClass}
            inputClass={inputClass}
            switchClass={switchClass}
          />

          <NotificationPreferences
            notifications={notifications}
            onNotificationChange={handleNotificationChange}
            sectionCardClass={sectionCardClass}
            sectionHeaderClass={sectionHeaderClass}
            inputClass={inputClass}
            switchClass={switchClass}
          />

          <AIPreferences
            aiPreferences={aiPreferences}
            onAiChange={handleAiChange}
            sectionCardClass={sectionCardClass}
            sectionHeaderClass={sectionHeaderClass}
            inputClass={inputClass}
            switchClass={switchClass}
          />
        </div>

        <div className="space-y-6">
          <ConnectedAccounts
            connectedAccounts={connectedAccounts}
            onToggleAccount={toggleAccount}
            sectionCardClass={sectionCardClass}
            sectionHeaderClass={sectionHeaderClass}
          />

          <Appearance
            sectionCardClass={sectionCardClass}
            sectionHeaderClass={sectionHeaderClass}
            switchClass={switchClass}
          />

          <button
            onClick={handleSave}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Save size={18} />
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;