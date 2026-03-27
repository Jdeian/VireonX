import React from 'react';
import { Clock, Trash2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const getPlatform = (platforms, id) => platforms.find((p) => p.id === id) || platforms[0];

const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(isoString));
};

const PostRow = ({ post, platforms, statusConfig, onDelete, onCopy, copiedId, onToggleExpand, expandedId }) => {
  const platform = getPlatform(platforms, post.platform);
  const statusCfg = statusConfig[post.status] || statusConfig.pending;
  const StatusIcon = statusCfg.icon;
  const isExpanded = expandedId === post.id;
  const isCopied = copiedId === post.id;

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${platform.color}`}>
          <platform.icon size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <p className={`text-sm text-slate-700 dark:text-slate-300 ${isExpanded ? 'whitespace-pre-wrap' : 'truncate'}`}>
            {post.message}
          </p>
          {post.imageUrl && isExpanded && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
              alt="Post media"
              className="mt-2 h-40 w-full rounded-lg object-cover border border-slate-100 dark:border-slate-800"
            />
          )}
          {post.status === 'failed' && post.error && (
            <p className="mt-0.5 truncate text-xs text-red-500 dark:text-red-400">{post.error}</p>
          )}
        </div>

        <span className={`hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex ${statusCfg.color}`}>
          <StatusIcon size={11} className={post.status === 'processing' ? 'animate-spin' : ''} />
          {statusCfg.label}
        </span>

        <div className="hidden shrink-0 items-center gap-1 text-xs text-slate-400 dark:text-slate-500 md:flex">
          <Clock size={11} />
          <span>
            {post.status === 'published' && post.publishedAt
              ? formatDate(post.publishedAt)
              : formatDate(post.scheduledAt)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {post.message?.length > 80 && (
            <button
              onClick={() => onToggleExpand(post.id)}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              title={isExpanded ? 'Collapse' : 'View full caption'}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          <button
            onClick={() => onCopy(post.id, post.message)}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title="Copy caption"
          >
            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            title="Delete post"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostRow;