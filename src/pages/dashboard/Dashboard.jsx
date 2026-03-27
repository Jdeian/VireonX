import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarRange,
  CheckCircle,
  Clock,
  PanelsTopLeft,
  Loader2,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Bot,
  ArrowRight,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { auth } from '@common/services/config';
import { getProfile } from '@common/services/profileService';
import { fetchPosts } from '@common/services/postService';

import DashboardSkeleton from './components/DashboardSkeleton';

const PLATFORMS = [
  { id: 'facebook',  name: 'Facebook',  icon: Facebook,  color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-pink-500 to-purple-600' },
  { id: 'twitter',   name: 'Twitter',   icon: Twitter,   color: 'bg-sky-500' },
  { id: 'linkedin',  name: 'LinkedIn',  icon: Linkedin,  color: 'bg-blue-700' },
];

const getPlatform = (id) => PLATFORMS.find((p) => p.id === id) || PLATFORMS[0];

const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(isoString));
};

const Dashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async (user) => {
    try {
      setLoading(true);
      const [profile, userPosts] = await Promise.all([
        getProfile(user.uid),
        fetchPosts(),
      ]);
      setProfileData(profile);
      setPosts(userPosts || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data.');
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

  const total = posts.length;
  const published = posts.filter((p) => p.status === 'published').length;
  const upcoming = posts.filter((p) => p.status === 'pending' || p.status === 'processing').length;
  const failed = posts.filter((p) => p.status === 'failed').length;
  const successRate = total > 0 ? Math.round((published / total) * 100) : 0;

  const stats = [
    { label: 'Total Posts',  value: total,             icon: CalendarRange,      color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Published',    value: published,         icon: CheckCircle,   color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Upcoming',     value: upcoming,          icon: CalendarClock, color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp,    color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ];

  const upcomingPosts = [...posts]
    .filter((p) => p.status === 'pending' || p.status === 'processing')
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, 5);

  const recentActivities = [...posts]
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
    .slice(0, 5)
    .map((p) => {
      const platform = getPlatform(p.platform);
      const diff = Date.now() - new Date(p.scheduledAt).getTime();
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      const timeAgo = mins < 60 ? `${mins}m ago` : hrs < 24 ? `${hrs}h ago` : `${days}d ago`;

      const statusLabel =
        p.status === 'published'  ? 'Published' :
        p.status === 'failed'     ? 'Failed to publish' :
        p.status === 'processing' ? 'Processing' : 'Scheduled';

      const Icon =
        p.status === 'published'  ? CheckCircle2 :
        p.status === 'failed'     ? XCircle :
        p.status === 'processing' ? Loader2 : CalendarDays;

      return {
        id: p.id,
        action: `${statusLabel} post on ${platform.name}`,
        preview: p.message?.slice(0, 60) + (p.message?.length > 60 ? '...' : ''),
        time: timeAgo,
        icon: Icon,
        status: p.status,
      };
    });

  const autopilotEnabled = localStorage.getItem('autopilot_enabled') === 'true';

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Social Operations Hub
          </h1>
          <p className="md:w-xl mt-1 text-slate-500 dark:text-slate-400">
            Your central command for scheduling and reviewing AI-generated social media posts across all platforms.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/content-planner"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
          >
            <CalendarRange size={18} />
            <span>Schedule Post</span>
          </Link>
          <Link
            to="/content-center"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <PanelsTopLeft size={18} />
            <span>Content Center</span>
          </Link>
        </div>
      </div>

      {/* Error / failed warnings */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle size={14} /> {error}
        </div>
      )}
      {failed > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle size={14} className="shrink-0" />
          {failed} post{failed !== 1 ? 's' : ''} failed to publish.{' '}
          <Link to="/content-center" className="underline underline-offset-2 hover:text-red-700">
            View in Content Center
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Upcoming Posts + Recent Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming posts - styled to match Recent Activity */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Upcoming Posts
              </h2>
              <Link
                to="/content-center"
                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4"/>
              </Link>
            </div>

            {upcomingPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <CalendarClock size={28} className="text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">No upcoming posts.</p>
                <Link
                  to="/content-planner"
                  className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center"
                >
                  Schedule one in Content Planner
                  <ChevronRight className="w-4 h-4"/>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcomingPosts.map((post) => {
                  const platform = getPlatform(post.platform);
                  return (
                    <div key={post.id} className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${platform.color}`}>
                        <platform.icon size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {post.message}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(post.scheduledAt)}
                          </span>
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10">
                            Scheduled
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10">
                          {platform.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Activity</h3>
            </div>
            {recentActivities.length === 0 ? (
              <div className="py-10 text-center">
                <Clock size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">No recent activity yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentActivities.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-6 py-4">
                    <div className={`mt-0.5 rounded-full p-1.5 ${
                      item.status === 'published'  ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                      item.status === 'failed'     ? 'bg-red-50 dark:bg-red-500/10' :
                      item.status === 'processing' ? 'bg-amber-50 dark:bg-amber-500/10' :
                                                     'bg-indigo-50 dark:bg-indigo-500/10'
                    }`}>
                      <item.icon size={13} className={
                        item.status === 'published'  ? 'text-emerald-600 dark:text-emerald-400' :
                        item.status === 'failed'     ? 'text-red-500 dark:text-red-400' :
                        item.status === 'processing' ? 'text-amber-600 dark:text-amber-400' :
                                                       'text-indigo-600 dark:text-indigo-400'
                      } />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-200">{item.action}</p>
                      {item.preview && (
                        <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">{item.preview}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <Link
                to="/content-center"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all activity
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: Autopilot + Connected Accounts */}
        <div className="space-y-6">
          {/* Autopilot status */}
          <div className={`rounded-xl border p-5 shadow-sm ${
            autopilotEnabled
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10'
              : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={17} className={autopilotEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">AI Autopilot</h3>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                autopilotEnabled
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {autopilotEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {autopilotEnabled
                ? 'AI is automatically generating and scheduling your posts.'
                : 'Turn on AI Autopilot in the Content Planner to automate posting.'}
            </p>
            <Link
              to="/content-planner"
              className="mt-2 flex items-center text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Go to Content Planner <ChevronRight className="w-4 h-4"/>
            </Link>
          </div>

          {/* Connected accounts */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Connected Accounts</h3>
                <Link
                  to="/settings"
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Manage
                </Link>
              </div>
            </div>
            <div className="space-y-1 p-4">
              {PLATFORMS.map((platform) => {
                const isConnected = !!profileData?.connectedAccounts?.[platform.id];
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${platform.color}`}>
                        <platform.icon size={13} />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-200">{platform.name}</span>
                    </div>
                    {isConnected ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        Connected
                      </span>
                    ) : (
                      <Link
                        to="/settings"
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                      >
                        Connect
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;