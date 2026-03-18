import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  CheckCircle,
  FileText,
  AlertTriangle,
  CheckCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@common/components/shadcn/button';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'scheduled',
      message: "Your post 'Summer Sale' is scheduled for tomorrow at 10 AM",
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'completed',
      message: 'AI caption generation completed for Instagram post',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'published',
      message: 'Facebook post published successfully',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      type: 'scheduled',
      message: 'Your post "Behind the Scenes" is scheduled for today at 4:30 PM',
      time: '1 day ago',
      read: true,
    },
    {
      id: 5,
      type: 'alert',
      message: 'Analytics report for last week is ready',
      time: '2 days ago',
      read: false,
    },
    {
      id: 6,
      type: 'completed',
      message: 'AI suggested optimal posting times for 3 posts',
      time: '3 days ago',
      read: true,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'scheduled':
        return <CalendarDays className="h-5 w-5 text-indigo-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'published':
        return <FileText className="h-5 w-5 text-amber-600" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-rose-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            className="gap-2"
          >
            <CheckCheck size={16} />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-6 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            All Notifications
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                No notifications yet.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  !notification.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CheckCheck size={14} />
                    Mark read
                  </Button>
                )}
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            End of notifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;