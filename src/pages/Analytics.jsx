import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
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

  // Mock summary stats
  const summaryStats = [
    {
      label: 'Total Engagement',
      value: '24.5K',
      change: '+12.3%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Reach',
      value: '156K',
      change: '+8.1%',
      icon: Eye,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'New Followers',
      value: '1,234',
      change: '+5.4%',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Posts Published',
      value: '48',
      change: '+2',
      icon: BarChart3,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  // Mock platform data
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

  // Mock top posts
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
      {/* Header with date range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-500 mt-1">
            Track your social media performance and growth.
          </p>
        </div>
        <div className="relative">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={16} />
            <span>Last 7 days</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-3 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {/* Overview Panel */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Chart placeholder - would be replaced with Recharts or similar */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Engagement Overview</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-linear-to-t from-indigo-500 to-indigo-300 rounded-t-lg"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                    <span className="text-xs text-slate-500">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platformData.map((platform) => (
                <div
                  key={platform.platform}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                      <platform.icon size={16} />
                    </div>
                    <h4 className="font-semibold text-slate-800">{platform.platform}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Engagement</span>
                      <span className="font-medium text-slate-700">{platform.engagement}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Reach</span>
                      <span className="font-medium text-slate-700">{platform.reach}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Posts</span>
                      <span className="font-medium text-slate-700">{platform.posts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platforms Panel */}
        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Platform Comparison</h3>
              <div className="space-y-4">
                {platformData.map((platform) => (
                  <div key={platform.platform} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${platform.color}`}>
                      <platform.icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{platform.platform}</span>
                        <span className="text-sm text-slate-500">{platform.engagement} engagement</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${platform.color.replace('bg-', 'bg-')}`}
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

        {/* Top Posts Panel */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Platform</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Engagement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Shares</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">{post.content}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <post.icon size={16} className="text-slate-500" />
                          <span className="text-sm text-slate-600">{post.platform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{post.engagement.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{post.likes.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{post.comments.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{post.shares.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(post.date).toLocaleDateString()}</td>
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