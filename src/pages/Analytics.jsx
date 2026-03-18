import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  ChevronDown,
} from 'lucide-react';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'platforms', label: 'By Platform' },
    { id: 'posts', label: 'Top Posts' },
  ];

  const summaryStats = [
    {
      label: 'Total Engagement',
      value: '24.5K',
      change: '+12.3%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Total Reach',
      value: '156K',
      change: '+8.1%',
      icon: Eye,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'New Followers',
      value: '1,234',
      change: '+5.4%',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
    {
      label: 'Posts Published',
      value: '48',
      change: '+2',
      icon: BarChart3,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
  ];

  const platformData = [
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-pink-500 to-purple-600',
      engagement: '12.4K',
      reach: '89K',
      posts: 24,
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      engagement: '8.2K',
      reach: '45K',
      posts: 15,
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      engagement: '3.9K',
      reach: '22K',
      posts: 9,
    },
  ];

  const topPosts = [
    {
      id: 1,
      platform: 'Instagram',
      icon: Instagram,
      content: 'Summer Sale is here! 🎉 Get 20% off...',
      engagement: 2345,
      likes: 1890,
      comments: 342,
      shares: 113,
      date: '2026-03-08',
    },
    {
      id: 2,
      platform: 'Facebook',
      icon: Facebook,
      content: 'Behind the scenes of our latest photoshoot...',
      engagement: 1876,
      likes: 1456,
      comments: 298,
      shares: 122,
      date: '2026-03-07',
    },
    {
      id: 3,
      platform: 'Twitter',
      icon: Twitter,
      content: 'We just hit 10K followers! Thank you all 🙏',
      engagement: 1543,
      likes: 1321,
      comments: 156,
      shares: 66,
      date: '2026-03-06',
    },
    {
      id: 4,
      platform: 'Instagram',
      icon: Instagram,
      content: 'New product teaser – can you guess what it is?',
      engagement: 1234,
      likes: 987,
      comments: 201,
      shares: 46,
      date: '2026-03-05',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Social Media Analytics
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gain insights into your social media performance, track growth, and optimize strategies.
          </p>
        </div>

        <div className="relative">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <Calendar size={16} />
            <span>Last 7 days</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10">
                {stat.change}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Chart placeholder */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
                Engagement Overview
              </h3>

              <div className="flex h-64 items-end justify-between gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-linear-to-t from-indigo-500 to-indigo-300"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {platformData.map((platform) => (
                <div
                  key={platform.platform}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${platform.color}`}
                    >
                      <platform.icon size={16} />
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                      {platform.platform}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Engagement
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {platform.engagement}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Reach
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {platform.reach}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Posts
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {platform.posts}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
                Platform Comparison
              </h3>

              <div className="space-y-4">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${platform.color}`}
                    >
                      <platform.icon size={16} />
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {platform.platform}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {platform.engagement} engagement
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-2 rounded-full ${platform.color}`}
                          style={{ width: `${(parseInt(platform.engagement) / 15000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Likes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {topPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                        {post.content}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <post.icon size={16} className="text-slate-500 dark:text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {post.platform}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {post.engagement.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {post.likes.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {post.comments.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {post.shares.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;