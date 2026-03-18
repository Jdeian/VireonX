import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit2,
  Save,
  X,
  Camera,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CalendarDays,
  Sparkles,
  Heart,
  MessageCircle,
  Clock,
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Jedric Belita',
    email: 'john@vireonx.com',
    bio: 'Social media strategist and AI enthusiast. Helping brands grow with smart automation.',
    location: 'San Francisco, CA',
    website: 'https://vireonx.com/john',
    avatar: null,
    joinDate: 'January 2025',
  });

  const stats = [
    {
      label: 'Posts Scheduled',
      value: '48',
      icon: CalendarDays,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'AI Captions',
      value: '142',
      icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Engagement',
      value: '24.5K',
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Comments',
      value: '3.2K',
      icon: MessageCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  const connectedAccounts = [
    { platform: 'Instagram', icon: Instagram, connected: true, username: '@john_ai' },
    { platform: 'Facebook', icon: Facebook, connected: true, username: 'John Jedric' },
    { platform: 'Twitter', icon: Twitter, connected: false, username: '' },
    { platform: 'LinkedIn', icon: Linkedin, connected: false, username: '' },
  ];

  const recentActivity = [
    { action: 'Scheduled "Summer Sale" post on Instagram', time: '2 hours ago', icon: CalendarDays },
    { action: 'AI generated caption for Facebook post', time: '5 hours ago', icon: Sparkles },
    { action: 'Published Twitter thread about AI trends', time: '1 day ago', icon: Twitter },
    { action: 'Analytics report for last week generated', time: '2 days ago', icon: Heart },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Personal Profile
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Update your personal information, manage preferences, and link your accounts.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-900"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-emerald-700 dark:bg-emerald-800 dark:hover:bg-emerald-900"
            >
              <Save size={16} />
              Save
            </button>
            <button onClick={handleCancel} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="h-24 bg-linear-to-r from-indigo-500 to-indigo-600 dark:from-indigo-800 dark:to-indigo-900" />
            <div className="-mt-12 px-6 pb-6">
              <div className="relative inline-block">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-md dark:border-slate-900 dark:bg-slate-800">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-2xl font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {profile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button className="absolute bottom-0 right-0 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
                    <Camera size={16} className="text-slate-600 dark:text-slate-300" />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="text-xl font-bold text-slate-800 dark:text-slate-100 w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {profile.name}
                  </h2>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Mail size={14} />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <User size={16} className="mt-0.5 text-slate-400 dark:text-slate-500" />
                  {isEditing ? (
                    <textarea
                      name="bio"
                      rows="3"
                      value={profile.bio}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-300 flex-1">{profile.bio}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span className="text-slate-600 dark:text-slate-300">{profile.location}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <LinkIcon size={16} className="text-slate-400 dark:text-slate-500" />
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                    >
                      {profile.website}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  <Calendar size={16} />
                  <span className="text-xs">Joined {profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                <div className={`mb-2 w-fit rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Connected Accounts</h3>
            </div>
            <div className="p-4 space-y-2">
              {connectedAccounts.map((account) => (
                <div
                  key={account.platform}
                  className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${account.platform === 'Instagram'
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
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {account.platform}
                      </p>
                      {account.connected && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {account.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${account.connected
                      ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {account.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;