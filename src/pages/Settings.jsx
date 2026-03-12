import React, { useState } from 'react';
import {
  User,
  Bell,
  Mail,
  Globe,
  Sun,
  Moon,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Save,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Lock,
  Key,
  AlertCircle,
} from 'lucide-react';

const Settings = () => {
  // Account management
  const [account, setAccount] = useState({
    email: 'john@vireonx.com',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    digestFrequency: 'daily',
    postScheduled: true,
    aiCaptionGenerated: true,
    analyticsReport: false,
  });

  // Connected accounts
  const [connectedAccounts, setConnectedAccounts] = useState([
    { platform: 'Instagram', icon: Instagram, connected: true, username: '@john_ai' },
    { platform: 'Facebook', icon: Facebook, connected: true, username: 'John Jedric' },
    { platform: 'Twitter', icon: Twitter, connected: false, username: '' },
    { platform: 'LinkedIn', icon: Linkedin, connected: false, username: '' },
  ]);

  // Appearance settings
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
  });

  // AI preferences
  const [aiPreferences, setAiPreferences] = useState({
    defaultTone: 'professional',
    captionLength: 'medium',
    autoOptimizeTime: true,
    includeHashtags: true,
  });

  // Password change modal state (simplified – could be expanded)
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

  const handleAppearanceChange = (e) => {
    const { name, checked } = e.target;
    setAppearance((prev) => ({ ...prev, [name]: checked }));
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
    // Here you would send all settings to your backend
    alert('Settings saved successfully!');
  };

  const handlePasswordChange = () => {
    // Placeholder – open a modal or navigate to password reset flow
    alert('Password change functionality – would open a modal or form.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your account, preferences, and integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Management Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Lock size={18} className="text-indigo-600" />
                Account Management
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={account.email}
                    onChange={handleAccountChange}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  This email is used for login and notifications.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <button
                  onClick={handlePasswordChange}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Key size={16} />
                  Change password
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700">Two-factor authentication</p>
                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="twoFactor"
                      checked={false}
                      onChange={() => {}}
                      className="sr-only peer"
                      disabled
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all opacity-50 cursor-not-allowed"></div>
                  </label>
                </div>
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Bell size={18} className="text-indigo-600" />
                Notification Preferences
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* ... (unchanged) */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={notifications.emailNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Push Notifications</p>
                  <p className="text-sm text-slate-500">Browser push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={notifications.pushNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Digest Frequency</label>
                <select
                  name="digestFrequency"
                  value={notifications.digestFrequency}
                  onChange={handleNotificationChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="font-medium text-slate-700 mb-2">Notify me when:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="postScheduled"
                      checked={notifications.postScheduled}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600">A post is scheduled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="aiCaptionGenerated"
                      checked={notifications.aiCaptionGenerated}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600">AI caption generation completes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="analyticsReport"
                      checked={notifications.analyticsReport}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600">Weekly analytics report is ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Preferences */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                AI Preferences
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* ... (unchanged) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Tone</label>
                <select
                  name="defaultTone"
                  value={aiPreferences.defaultTone}
                  onChange={handleAiChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Caption Length</label>
                <select
                  name="captionLength"
                  value={aiPreferences.captionLength}
                  onChange={handleAiChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="short">Short (under 100 chars)</option>
                  <option value="medium">Medium (100-200 chars)</option>
                  <option value="long">Long (200-280 chars)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Auto-optimize posting time</p>
                  <p className="text-sm text-slate-500">AI suggests best times to post</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoOptimizeTime"
                    checked={aiPreferences.autoOptimizeTime}
                    onChange={handleAiChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700">Include hashtags</p>
                  <p className="text-sm text-slate-500">AI adds relevant hashtags</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="includeHashtags"
                    checked={aiPreferences.includeHashtags}
                    onChange={handleAiChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Connected Accounts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Globe size={18} className="text-indigo-600" />
                Connected Accounts
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {connectedAccounts.map((account, index) => (
                <div
                  key={account.platform}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      account.platform === 'Instagram' ? 'bg-linear-to-br from-pink-500 to-purple-600' :
                      account.platform === 'Facebook' ? 'bg-blue-600' :
                      account.platform === 'Twitter' ? 'bg-sky-500' : 'bg-blue-700'
                    }`}>
                      <account.icon size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{account.platform}</p>
                      {account.connected && (
                        <p className="text-xs text-slate-500">{account.username}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAccount(index)}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      account.connected
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {account.connected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Sun size={18} className="text-indigo-600" />
                Appearance
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-700">Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={appearance.darkMode}
                    onChange={handleAppearanceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700">Compact View</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="compactView"
                    checked={appearance.compactView}
                    onChange={handleAppearanceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
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