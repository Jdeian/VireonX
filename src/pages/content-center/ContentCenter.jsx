import React, { useState, useEffect, useCallback } from 'react';
import {
  Facebook, Instagram, Twitter, Linkedin,
  RefreshCw, Loader2, CalendarClock, Send,
  CheckCircle2, XCircle, LayoutList, LayoutGrid,
} from 'lucide-react';
import { Button } from '@common/components/shadcn/button';
import { fetchPosts, deletePost } from '@common/services/postService';
import PostCard from './components/PostCard';
import PostRow from './components/PostRow';
import ContentCenterSkeleton from './components/ContentCenterSkeleton';

const platforms = [
  { id: 'facebook',  name: 'Facebook',  icon: Facebook,  color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-pink-500 to-purple-600' },
  { id: 'twitter',   name: 'Twitter',   icon: Twitter,   color: 'bg-sky-500' },
  { id: 'linkedin',  name: 'Linkedin',  icon: Linkedin,  color: 'bg-blue-700' },
];

const STATUS_CONFIG = {
  pending:    { label: 'Scheduled',  color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300',  icon: CalendarClock, tab: 'upcoming' },
  processing: { label: 'Processing', color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',      icon: Loader2,       tab: 'upcoming' },
  published:  { label: 'Published',  color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300', icon: CheckCircle2, tab: 'published' },
  failed:     { label: 'Failed',     color: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300',              icon: XCircle,       tab: 'failed' },
};

const TABS = [
  { id: 'all',       label: 'All Posts' },
  { id: 'upcoming',  label: 'Upcoming' },
  { id: 'published', label: 'Published' },
  { id: 'failed',    label: 'Failed' },
];

// Shown when a tab has no posts
const EmptyState = ({ filter }) => {
  const messages = {
    all:       { icon: Send,          text: 'No posts yet. Head to Content Planner to create your first post.' },
    upcoming:  { icon: CalendarClock, text: 'No upcoming posts. Schedule one in the Content Planner.' },
    published: { icon: CheckCircle2,  text: 'No published posts yet.' },
    failed:    { icon: XCircle,       text: 'No failed posts. Everything looks good!' },
  };
  const { icon: Icon, text } = messages[filter] || messages.all;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 dark:border-slate-700 dark:bg-slate-900">
      <Icon size={32} className="text-slate-300 dark:text-slate-600" />
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
};

const ContentCenter = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');

  // Fetches all posts for the current user from Firestore via backend
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPosts();
      const sorted = [...data].sort((a, b) => {
        const order = { processing: 0, pending: 1, published: 2, failed: 3 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return new Date(b.scheduledAt) - new Date(a.scheduledAt);
      });
      setPosts(sorted);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter((p) => STATUS_CONFIG[p.status]?.tab === filter);

  const counts = {
    all:       posts.length,
    upcoming:  posts.filter((p) => STATUS_CONFIG[p.status]?.tab === 'upcoming').length,
    published: posts.filter((p) => p.status === 'published').length,
    failed:    posts.filter((p) => p.status === 'failed').length,
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleCopy = (id, message) => {
    if (!message) return;
    navigator.clipboard.writeText(message).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleToggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Shared props passed to both PostCard and PostRow
  const sharedPostProps = {
    platforms,
    statusConfig: STATUS_CONFIG,
    onDelete: handleDelete,
    onCopy: handleCopy,
    copiedId,
    onToggleExpand: handleToggleExpand,
    expandedId,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Content Center
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Track all your scheduled, published, and failed posts in one place.
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
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-6 overflow-x-auto pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setFilter(tab.id); setExpandedId(null); }}
              className={`flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  filter === tab.id
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List / Grid view toggle */}
        <div className="mb-3 flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="List view"
          >
            <LayoutList size={15} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <ContentCenterSkeleton />
      ) : filteredPosts.length === 0 ? (
        <EmptyState filter={filter} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} {...sharedPostProps} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPosts.map((post) => (
            <PostRow key={post.id} post={post} {...sharedPostProps} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentCenter;