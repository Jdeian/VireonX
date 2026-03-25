import { useState } from 'react';
import {
  Bell, CalendarDays, CheckCircle, Captions,
  AlertTriangle, CheckCheck, Loader2,
} from 'lucide-react';
import { Button } from '@common/components/shadcn/button';
import { auth } from '@common/services/config';
import { fetchPosts } from '@common/services/postService';
import { useEffect, useCallback } from 'react';

import NotificationsSkeleton from './components/NotificationsSkeleton';

const TYPE_CONFIG = {
  scheduled:  { icon: CalendarDays, bg: 'bg-indigo-50 dark:bg-indigo-500/10',  color: 'text-indigo-600 dark:text-indigo-400' },
  completed:  { icon: CheckCircle,  bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400' },
  published:  { icon: Captions,     bg: 'bg-blue-50 dark:bg-blue-500/10',     color: 'text-blue-600 dark:text-blue-400' },
  alert:      { icon: AlertTriangle, bg: 'bg-red-50 dark:bg-red-500/10',        color: 'text-red-500 dark:text-red-400' },
  default:    { icon: Bell,         bg: 'bg-slate-100 dark:bg-slate-800',       color: 'text-slate-500 dark:text-slate-400' },
};

// Build real notifications from Firestore posts
const buildNotificationsFromPosts = (posts) => {
  return [...posts]
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))
    .slice(0, 10)
    .map((p) => {
      const date  = new Date(p.scheduledAt);
      const diff  = Date.now() - date.getTime();
      const mins  = Math.floor(diff / 60000);
      const hrs   = Math.floor(diff / 3600000);
      const days  = Math.floor(diff / 86400000);
      const timeAgo = mins < 60 ? `${mins}m ago` : hrs < 24 ? `${hrs}h ago` : `${days}d ago`;

      const platform = p.platform?.charAt(0).toUpperCase() + p.platform?.slice(1);
      const preview  = p.message?.slice(0, 40) + (p.message?.length > 40 ? '...' : '');

      let type, message;
      if (p.status === 'published') {
        type    = 'published';
        message = `${platform} post published successfully - "${preview}"`;
      } else if (p.status === 'failed') {
        type    = 'alert';
        message = `${platform} post failed to publish - "${preview}"`;
      } else if (p.status === 'processing') {
        type    = 'completed';
        message = `${platform} post is being processed - "${preview}"`;
      } else {
        type    = 'scheduled';
        message = `${platform} post scheduled for ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} — "${preview}"`;
      }

      return { id: p.id, type, message, time: timeAgo, read: p.status === 'published' };
    });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const posts = await fetchPosts();
      setNotifications(buildNotificationsFromPosts(posts));
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) loadNotifications();
    });
    return () => unsubscribe();
  }, [loadNotifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Notifications
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Stay updated on your social media activity and AI insights.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="mt-1 gap-2 border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            <CheckCheck size={15} />
            Mark all as read
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              All Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <NotificationsSkeleton />
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell size={32} className="text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((notification) => {
              const cfg  = TYPE_CONFIG[notification.type] || TYPE_CONFIG.default;
              const Icon = cfg.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !notification.read ? 'bg-indigo-50/40 dark:bg-indigo-500/5' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {notification.time}
                    </p>
                  </div>

                  {/* Unread dot + mark read */}
                  <div className="flex shrink-0 items-center gap-2">
                    {!notification.read && (
                      <>
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          <CheckCheck size={13} />
                          Mark read
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-slate-100 px-6 py-3 dark:border-slate-800">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Showing last {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;