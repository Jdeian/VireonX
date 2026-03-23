import React from 'react';
import { Clock, CheckCircle2, XCircle, CalendarDays, Loader2 } from 'lucide-react';

const ActivityFeed = ({ posts, platforms }) => {
  const recentActivity = [...posts]
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
    .slice(0, 5)
    .map((p) => {
      const platform = platforms.find((pl) => pl.id === p.platform);
      const diff = Date.now() - new Date(p.scheduledAt).getTime();
      const mins = Math.floor(diff / 60000);
      const hrs  = Math.floor(diff / 3600000);
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
        action: `${statusLabel} post on ${platform?.label || p.platform}`,
        preview: p.message?.slice(0, 60) + (p.message?.length > 60 ? '...' : ''),
        time: timeAgo,
        icon: Icon,
        status: p.status,
      };
    });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Activity</h3>
      </div>
      {recentActivity.length === 0 ? (
        <div className="py-10 text-center">
          <Clock size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">No recent activity yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentActivity.map((item) => (
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
    </div>
  );
};

export default ActivityFeed;