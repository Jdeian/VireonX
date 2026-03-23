import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, TrendingUp, Users,
  Instagram, Facebook, Twitter, Linkedin,
  Loader2, RefreshCw, AlertTriangle, CalendarClock,
} from 'lucide-react';
import { Button } from '@common/components/shadcn/button';
import { fetchPosts } from '@common/services/postService';
import { auth } from '@common/services/config';
import StatCard from './components/StatCard';
import PostsChart from './components/PostsChart';
import { platformList } from './components/PlatformBreakdown';

const MOCK_TOP_POSTS = [
  { id: 1, platform: 'Instagram', icon: Instagram, content: 'Summer Sale is here! 🎉 Get 20% off...', engagement: 2345, likes: 1890, comments: 342, shares: 113, date: '2026-03-08' },
  { id: 2, platform: 'Facebook',  icon: Facebook,  content: 'Behind the scenes of our latest photoshoot...', engagement: 1876, likes: 1456, comments: 298, shares: 122, date: '2026-03-07' },
  { id: 3, platform: 'Twitter',   icon: Twitter,   content: 'We just hit 10K followers! Thank you all 🙏', engagement: 1543, likes: 1321, comments: 156, shares: 66,  date: '2026-03-06' },
  { id: 4, platform: 'Linkedin', icon: Linkedin, content: 'New product teaser – can you guess what it is?', engagement: 1234, likes: 987,  comments: 201, shares: 46,  date: '2026-03-05' },
];

const parseEngagement = (str) => {
  if (!str) return 0;
  if (str.includes('K')) return parseFloat(str) * 1000;
  return parseFloat(str) || 0;
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) loadPosts();
    });
    return () => unsubscribe();
  }, [loadPosts]);

  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'platforms', label: 'By Platform' },
    { id: 'posts',     label: 'Top Posts' },
  ];

  // Overview stats — all platforms combined
  const overviewStats = () => {
    const published = posts.filter((p) => p.status === 'published').length;
    const upcoming  = posts.filter((p) => p.status === 'pending' || p.status === 'processing').length;
    return [
      { label: 'Total Engagement', value: '24.5K',    icon: TrendingUp,    color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
      { label: 'Followers',        value: '12.3K',    icon: Users,         color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-500/10' },
      { label: 'Posts Published',  value: published,  icon: BarChart3,     color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
      { label: 'Upcoming Posts',   value: upcoming,   icon: CalendarClock, color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    ];
  };

  // By Platform stats — filtered to selected platform
  const platformStats = () => {
    const p = platformList.find((pl) => pl.id === selectedPlatform) || platformList[0];
    const platformPosts    = posts.filter((post) => post.platform === selectedPlatform);
    const published        = platformPosts.filter((post) => post.status === 'published').length;
    const upcoming         = platformPosts.filter((post) => post.status === 'pending' || post.status === 'processing').length;
    return [
      { label: 'Engagement',      value: p.mockEngagement, icon: TrendingUp,    color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
      { label: 'Followers',       value: p.mockFollowers,  icon: Users,         color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-500/10' },
      { label: 'Posts Published', value: published,        icon: BarChart3,     color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
      { label: 'Upcoming Posts',  value: upcoming,         icon: CalendarClock, color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    ];
  };

  const failed = posts.filter((p) => p.status === 'failed').length;

  const overviewPlatformData = platformList.map((p) => ({
    ...p,
    posts: posts.filter((post) => post.platform === p.id).length,
  }));

  const maxEngagement = Math.max(...overviewPlatformData.map((p) => parseEngagement(p.mockEngagement)), 1);

  // Posts filtered by selected platform for the chart in By Platform tab
  const platformFilteredPosts = posts.filter((p) => p.platform === selectedPlatform);

  const topPosts = posts.filter((p) => p.status === 'published').length > 0
    ? posts
        .filter((p) => p.status === 'published')
        .slice(0, 5)
        .map((p, i) => {
          const meta = platformList.find((m) => m.id === p.platform) || platformList[0];
          return {
            id: p.id,
            platform: meta.name,
            icon: meta.icon,
            content: p.message,
            engagement: 800 + i * 120,
            likes: 600 + i * 90,
            comments: 120 + i * 20,
            shares: 80 + i * 10,
            date: p.publishedAt || p.scheduledAt,
          };
        })
    : MOCK_TOP_POSTS;

  // Stat cards change based on active tab
  const activeStats = activeTab === 'platforms' ? platformStats() : overviewStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Social Media Analytics
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gain insights into your social media performance, track growth, and optimize strategies.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadPosts}
          disabled={loading}
          className="mt-1 shrink-0 gap-2 border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Loading analytics...</span>
        </div>
      ) : (
        <>
          {/* Stat cards — update based on active tab / selected platform */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {activeStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {failed > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <AlertTriangle size={14} className="shrink-0" />
              {failed} post{failed !== 1 ? 's' : ''} failed to publish. Check the Content Center for details.
            </div>
          )}

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

          <div>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Line chart — all posts */}
                <PostsChart posts={posts} />

                {/* Platform cards — clickable to switch to By Platform tab */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {overviewPlatformData.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => { setSelectedPlatform(platform.id); setActiveTab('platforms'); }}
                      className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${platform.color}`}>
                          <platform.icon size={15} />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{platform.name}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Engagement</span>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{platform.mockEngagement}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Reach</span>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{platform.mockReach}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Posts</span>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{platform.posts}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-indigo-500 dark:text-indigo-400">View details →</p>
                    </button>
                  ))}
                </div>

                {/* Platform engagement comparison */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-5 text-base font-semibold text-slate-800 dark:text-slate-100">
                    Platform Comparison
                  </h3>
                  <div className="space-y-4">
                    {overviewPlatformData.map((platform) => {
                      const engagementValue = parseEngagement(platform.mockEngagement);
                      const barWidth = (engagementValue / maxEngagement) * 100;
                      return (
                        <div key={platform.id} className="flex items-center gap-4">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${platform.color}`}>
                            <platform.icon size={15} />
                          </div>
                          <div className="flex-1">
                            <div className="mb-1.5 flex justify-between text-sm">
                              <span className="font-medium text-slate-700 dark:text-slate-200">{platform.name}</span>
                              <span className="text-slate-500 dark:text-slate-400">
                                {platform.mockEngagement} engagement · {platform.posts} post{platform.posts !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className={`h-2 rounded-full transition-all ${platform.bar}`}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'platforms' && (
              <div className="space-y-6">
                {/* Platform selector */}
                <div className="flex flex-wrap gap-3">
                  {platformList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        selectedPlatform === p.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${p.color}`}>
                        <p.icon size={11} />
                      </div>
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Chart filtered to selected platform */}
                <PostsChart posts={platformFilteredPosts} />
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                      <tr>
                        {['Post', 'Platform', 'Engagement', 'Likes', 'Comments', 'Shares', 'Date'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {topPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                            {post.content}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <post.icon size={16} className="text-slate-500 dark:text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-300">{post.platform}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{post.engagement.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{post.likes.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{post.comments.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{post.shares.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {post.date ? new Date(post.date).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;