import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, CheckCircle2, XCircle, CalendarClock, BarChart3 } from 'lucide-react';

export const platformList = [
  { id: 'facebook',  name: 'Facebook',  icon: Facebook,  color: 'bg-blue-600',  bar: 'bg-blue-500',  mockEngagement: '8.2K',  mockReach: '45K', mockFollowers: '5.1K' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-pink-500 to-purple-600', bar: 'bg-pink-500', mockEngagement: '12.4K', mockReach: '89K', mockFollowers: '9.3K' },
  { id: 'twitter',   name: 'Twitter',   icon: Twitter,   color: 'bg-sky-500',   bar: 'bg-sky-400',   mockEngagement: '3.9K',  mockReach: '22K', mockFollowers: '2.8K' },
  { id: 'linkedin',  name: 'LinkedIn',  icon: Linkedin,  color: 'bg-blue-700',  bar: 'bg-blue-700',  mockEngagement: '5.1K',  mockReach: '31K', mockFollowers: '3.2K' },
];

const PlatformBreakdown = ({ posts, selectedPlatformId, onSelectPlatform }) => {
  const platform = platformList.find((p) => p.id === selectedPlatformId) || platformList[0];
  const platformPosts = posts.filter((p) => p.platform === selectedPlatformId);

  const total     = platformPosts.length;
  const published = platformPosts.filter((p) => p.status === 'published').length;
  const failed    = platformPosts.filter((p) => p.status === 'failed').length;
  const upcoming  = platformPosts.filter((p) => p.status === 'pending' || p.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Platform selector */}
      <div className="flex flex-wrap gap-3">
        {platformList.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPlatform(p.id)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              selectedPlatformId === p.id
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Posts',  value: total,             icon: BarChart3,     bg: 'bg-indigo-50 dark:bg-indigo-500/10',   color: 'text-indigo-600' },
          { label: 'Published',    value: published,         icon: CheckCircle2,  bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600' },
          { label: 'Upcoming',     value: upcoming,          icon: CalendarClock, bg: 'bg-amber-50 dark:bg-amber-500/10',     color: 'text-amber-600' },
          { label: 'Failed',       value: failed,            icon: XCircle,       bg: 'bg-red-50 dark:bg-red-500/10',         color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`inline-flex rounded-lg p-2.5 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mock engagement/reach for this platform */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { label: 'Engagement', value: platform.mockEngagement },
          { label: 'Reach',      value: platform.mockReach },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Published posts for this platform */}
      {published > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Published Posts</h4>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {platformPosts
              .filter((p) => p.status === 'published')
              .map((post) => (
                <div key={post.id} className="flex items-center gap-3 px-5 py-3">
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                  <p className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">{post.message}</p>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    {post.publishedAt
                      ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(post.publishedAt))
                      : '—'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-400 dark:text-slate-500">No published posts for {platform.name} yet.</p>
        </div>
      )}
    </div>
  );
};

export default PlatformBreakdown;