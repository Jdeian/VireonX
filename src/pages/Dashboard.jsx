import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  BarChart3,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  ThumbsUp,
  Brain,
  Eye,
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      label: 'Scheduled Posts',
      value: '31',
      change: '+6%',
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    },
    {
      label: 'AI-Created Posts',
      value: '18',
      change: '+12',
      icon: Brain,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
    {
      label: 'Pending Review',
      value: '7',
      change: '+3',
      icon: Eye,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      label: 'Published Posts',
      value: '112',
      change: '+22%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
  ];

  const upcomingPosts = [
    {
      platform: 'Instagram',
      icon: Instagram,
      content: 'Summer collection preview',
      scheduledTime: 'Today, 2:00 PM',
      source: 'user',
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      content: 'Behind-the-scenes video',
      scheduledTime: 'Today, 4:30 PM',
      source: 'user',
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      content: 'Industry insights thread',
      scheduledTime: 'Tomorrow, 9:00 AM',
      source: 'ai',
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      content: 'User spotlight campaign',
      scheduledTime: 'Tomorrow, 6:00 PM',
      source: 'ai',
    },
  ];

  const pendingPosts = [
    {
      platform: 'Twitter',
      icon: Twitter,
      content: 'AI-generated trend update',
      suggestedTime: 'Tomorrow, 9:00 AM',
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      content: 'Weekly product spotlight',
      suggestedTime: 'Tomorrow, 2:00 PM',
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      content: 'User testimonial reel',
      suggestedTime: 'Mar 20, 11:00 AM',
    },
  ];

  const recentActivities = [
    {
      action: 'User scheduled Instagram post - AI suggested caption and best time',
      time: '12 min ago',
      icon: Calendar,
    },
    {
      action: 'AI created a Facebook post - pending your review',
      time: '34 min ago',
      icon: Brain,
    },
    {
      action: 'You approved an AI-generated Twitter post',
      time: '2 hours ago',
      icon: ThumbsUp,
    },
  ];

  return (
    <div className="space-y-8">
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
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
          >
            <Calendar size={18} />
            <span>Schedule Post</span>
          </Link>

          <Link
            to="/content-center"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Eye size={18} />
            <span>Review AI Posts</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>

              <span
                className={`rounded-full px-2 py-1 text-sm font-medium ${
                  stat.change.startsWith('+')
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                }`}
              >
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Upcoming Posts
              </h2>
              <Link
                to="/schedule"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingPosts.map((post, idx) => (
                <div
                  key={idx}
                  className="p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <post.icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {post.content}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {post.scheduledTime}
                        </span>

                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10">
                          Scheduled
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            post.source === 'ai'
                              ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {post.source === 'ai' ? 'AI Approved' : 'User Scheduled'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10">
                        {post.platform}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Pending Review
              </h2>
              <Link
                to="/review"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Review all
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingPosts.map((post, idx) => (
                <div
                  key={idx}
                  className="p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <post.icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {post.content}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {post.suggestedTime}
                        </span>

                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/10">
                          Pending Review
                        </span>

                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-500/10">
                          AI Created
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10">
                        {post.platform}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Recent Activity
              </h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
                      <activity.icon className="h-4 w-4 text-indigo-600" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {activity.action}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <Link
                to="/activity"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all activity
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-linear-to-br from-indigo-600 to-indigo-800 p-6 text-white shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">AI Performance</h3>
              <BarChart3 className="h-5 w-5 opacity-80" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>AI Approval Rate</span>
                  <span>84%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-1.5 rounded-full bg-white" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Engagement from AI Posts</span>
                  <span>+23%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-1.5 rounded-full bg-white" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>AI Suggestions Used</span>
                  <span>67%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20">
                  <div className="h-1.5 rounded-full bg-white" style={{ width: '67%' }} />
                </div>
              </div>
            </div>

            <Link
              to="/analytics"
              className="mt-4 inline-block text-sm text-white/90 underline underline-offset-2 hover:text-white"
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