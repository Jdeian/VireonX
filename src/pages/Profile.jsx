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

  // Mock stats
  const stats = [
    { label: 'Posts Scheduled', value: '48', icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'AI Captions', value: '142', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Engagement', value: '24.5K', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Comments', value: '3.2K', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Mock connected accounts
  const connectedAccounts = [
    { platform: 'Instagram', icon: Instagram, connected: true, username: '@john_ai' },
    { platform: 'Facebook', icon: Facebook, connected: true, username: 'John Jedric' },
    { platform: 'Twitter', icon: Twitter, connected: false, username: '' },
    { platform: 'LinkedIn', icon: Linkedin, connected: false, username: '' },
  ];

  // Mock recent activity
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
    // Here you would send updated profile to backend
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally reset to original values (not implemented here)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information and connected accounts.</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-indigo-500 to-indigo-600 h-24"></div>
            <div className="px-6 pb-6 -mt-12">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50">
                    <Camera size={16} className="text-slate-600" />
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
                    className="text-xl font-bold text-slate-800 w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                )}
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Mail size={14} />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <User size={16} className="text-slate-400 mt-0.5" />
                  {isEditing ? (
                    <textarea
                      name="bio"
                      rows="3"
                      value={profile.bio}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  ) : (
                    <p className="text-slate-600 flex-1">{profile.bio}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <span className="text-slate-600">{profile.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon size={16} className="text-slate-400" />
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleInputChange}
                      className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline truncate"
                    >
                      {profile.website}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2 text-slate-400 border-t border-slate-100">
                  <Calendar size={16} />
                  <span className="text-xs">Joined {profile.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-2`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Connected Accounts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Connected Accounts</h3>
            </div>
            <div className="p-4 space-y-2">
              {connectedAccounts.map((account) => (
                <div key={account.platform} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      account.platform === 'Instagram' ? 'bg-linear-to-br from-pink-500 to-purple-600' :
                      account.platform === 'Facebook' ? 'bg-blue-600' :
                      account.platform === 'Twitter' ? 'bg-sky-500' : 'bg-blue-700'
                    }`}>
                      <account.icon size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-700">{account.platform}</p>
                      {account.connected && (
                        <p className="text-xs text-slate-500">{account.username}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    account.connected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {account.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{activity.action}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {activity.time}
                      </p>
                    </div>
                  </div>
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