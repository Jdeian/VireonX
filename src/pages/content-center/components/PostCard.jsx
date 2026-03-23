import React from 'react';
import { Clock, Trash2, Copy, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const getPlatform = (platforms, id) => platforms.find((p) => p.id === id) || platforms[0];

const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(isoString));
};

const PostCard = ({ post, platforms, statusConfig, onDelete, onCopy, copiedId, onToggleExpand, expandedId }) => {
  const platform = getPlatform(platforms, post.platform);
  const statusCfg = statusConfig[post.status] || statusConfig.pending;
  const StatusIcon = statusCfg.icon;
  const isExpanded = expandedId === post.id;
  const isCopied = copiedId === post.id;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${platform.color}`}>
            <platform.icon size={15} />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {platform.name}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.color}`}>
          <StatusIcon size={11} className={post.status === 'processing' ? 'animate-spin' : ''} />
          {statusCfg.label}
        </span>
      </div>

      <p className={`flex-1 text-sm text-slate-700 dark:text-slate-300 ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
        {post.message}
      </p>

      {post.message?.length > 120 && (
        <button
          onClick={() => onToggleExpand(post.id)}
          className="mt-1 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400"
        >
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {isExpanded ? 'Show less' : 'View full caption'}
        </button>
      )}

      {post.status === 'failed' && post.error && (
        <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-500/10">
          <AlertTriangle size={12} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-xs text-red-600 dark:text-red-400">{post.error}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Clock size={11} />
          <span>
            {post.status === 'published' && post.publishedAt
              ? formatDate(post.publishedAt)
              : formatDate(post.scheduledAt)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopy(post.id, post.message)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title="Copy caption"
          >
            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            title="Delete post"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;