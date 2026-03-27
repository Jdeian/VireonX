import React, { useState, useEffect, useCallback } from 'react';
import {
  Edit2, Save, X, Instagram, Facebook, Twitter, Linkedin,
  CalendarDays, Users, BarChart3, CheckCircle2, Loader2,
} from 'lucide-react';
import { auth } from '@common/services/config';
import { getProfile, updateProfile } from '@common/services/profileService';
import { fetchPosts } from '@common/services/postService';
import { Button } from '@common/components/shadcn/button';
import ProfileCard from './components/ProfileCard';
import ActivityFeed from './components/ActivityFeed';
import ProfileSkeleton from './components/ProfileSkeleton';

import { uploadImage } from '@common/services/postService';

const CONNECTED_PLATFORMS = [
  { id: 'facebook',  label: 'Facebook',  icon: Facebook,  color: 'bg-blue-600' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-pink-500 to-purple-600' },
  { id: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'bg-sky-500' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: Linkedin,  color: 'bg-blue-700' },
];

const Profile = () => {
  const [isEditing, setIsEditing]     = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData]       = useState({});
  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const [successMsg, setSuccessMsg]   = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const loadData = useCallback(async (user) => {
    try {
      setLoading(true);
      const [profile, userPosts] = await Promise.all([
        getProfile(user.uid),
        fetchPosts(),
      ]);
      setProfileData(profile);
      setFormData({
        fullName:    profile?.fullName    || '',
        bio:         profile?.bio         || '',
        accountRole: profile?.accountRole || '',
      });
      setPosts(userPosts || []);
      setAvatarUrl(profile?.avatarUrl || null);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) loadData(user);
    });
    return () => unsubscribe();
  }, [loadData]);

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    try {
      setAvatarUploading(true);
      const url = await uploadImage(file);
      setAvatarUrl(url);
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setError('Failed to upload profile picture.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const user = auth.currentUser;
      if (!user) return;
      await updateProfile(user.uid, {
        fullName:    formData.fullName.trim(),
        bio:         formData.bio.trim(),
        accountRole: formData.accountRole.trim(),
        avatarUrl:   avatarUrl || null,
      });
      setProfileData((prev) => ({ ...prev, ...formData, avatarUrl }));
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName:    profileData?.fullName    || '',
      bio:         profileData?.bio         || '',
      accountRole: profileData?.accountRole || '',
    });
    setAvatarUrl(profileData?.avatarUrl || null);
    setIsEditing(false);
    setError('');
  };

  const published = posts.filter((p) => p.status === 'published').length;
  const upcoming  = posts.filter((p) => p.status === 'pending' || p.status === 'processing').length;
  const total     = posts.length;

  const stats = [
    { label: 'Total Posts', value: total,     icon: BarChart3,    color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Published',   value: published, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Upcoming',    value: upcoming,  icon: CalendarDays, color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Followers',   value: '200',   icon: Users,        color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ];

  const joinDate = profileData?.createdAt?.toDate
    ? profileData.createdAt.toDate().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Unknown';

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Profile</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage your personal information and connected accounts.
          </p>
        </div>
        {!isEditing ? (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Edit2 size={15} />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="gap-2 border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              <X size={15} />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — profile card */}
        <div className="lg:col-span-1">
          <ProfileCard
            profileData={profileData}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            joinDate={joinDate}
            avatarUrl={avatarUrl} 
            onAvatarUpload={handleAvatarUpload}
            avatarUploading={avatarUploading}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className={`mb-2 inline-flex rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Connected accounts */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Connected Accounts</h3>
            </div>
            <div className="space-y-1 p-4">
              {CONNECTED_PLATFORMS.map((platform) => {
                const isConnected = !!profileData?.connectedAccounts?.[platform.id];
                const pageName = platform.id === 'facebook' ? profileData?.facebookPageName : null;
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${platform.color}`}>
                        <platform.icon size={15} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{platform.label}</p>
                        {isConnected && pageName && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{pageName}</p>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {isConnected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <ActivityFeed posts={posts} platforms={CONNECTED_PLATFORMS} />
        </div>
      </div>
    </div>
  );
};

export default Profile;