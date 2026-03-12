import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  BarChart3,
  FileText,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  TrendingUp,
  Sparkles,
  Clock,
} from 'lucide-react';

const Dashboard = () => {
  // Mock data – replace with real data from your backend
  const stats = [
    {
      label: 'Scheduled Posts',
      value: '24',
      change: '+12%',
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'AI Captions Generated',
      value: '142',
      change: '+28%',
      icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Engagement',
      value: '13.2k',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Posts Published',
      value: '89',
      change: '+15%',
      icon: CheckCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const upcomingPosts = [
    {
      platform: 'Instagram',
      icon: Instagram,
      content: 'Summer Sale Launch 🎉',
      time: 'Today, 2:00 PM',
      status: 'scheduled',
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      content: 'Behind the Scenes',
      time: 'Today, 4:30 PM',
      status: 'scheduled',
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      content: 'Product Hunt Launch',
      time: 'Tomorrow, 9:00 AM',
      status: 'draft',
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      content: 'User Spotlight',
      time: 'Tomorrow, 6:00 PM',
      status: 'scheduled',
    },
  ];

  const recentActivities = [
    {
      action: 'AI generated caption for Instagram post',
      time: '5 min ago',
      icon: FileText,
    },
    {
      action: 'Post "Summer Sale" optimized for best time',
      time: '1 hour ago',
      icon: Sparkles,
    },
    {
      action: 'Analytics report for last week ready',
      time: '3 hours ago',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, John!</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your social media today.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Calendar size={18} />
            <span>Schedule Post</span>
          </Link>
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Sparkles size={18} />
            <span>Generate Caption</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Posts - takes 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Upcoming Posts</h2>
              <Link to="/schedule" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingPosts.map((post, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <post.icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{post.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{post.time}</span>
                      {post.status === 'draft' && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Draft</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      {post.platform}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & AI Insights */}
        <div className="space-y-6">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Recent AI Activity</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{activity.action}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link to="/activity" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all activity
              </Link>
            </div>
          </div>

          {/* Quick Analytics Preview */}
          <div className="bg-linear-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Weekly Performance</h3>
              <BarChart3 className="w-5 h-5 opacity-80" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement</span>
                  <span>+24%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Impressions</span>
                  <span>+12%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>New Followers</span>
                  <span>+8%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
            <Link
              to="/analytics"
              className="mt-4 inline-block text-sm text-white/90 hover:text-white underline underline-offset-2"
            >
              View full report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;