import React from 'react';
import { Clock, Brain, Loader2, ThumbsUp, XCircle } from 'lucide-react';
import { Button } from '@common/components/shadcn/button';

const ApprovalMode = ({
  loading,
  hasGenerated,
  scheduleError,
  pendingSuggestions,
  schedulingId,
  approveSuggestion,
  rejectSuggestion,
  platforms,
  visible,
}) => {
  if (!visible) return null;
  if (!hasGenerated && !loading) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Pending Approval ({pendingSuggestions.length})
        </h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Approve to move posts into scheduled queue
        </span>
      </div>

      {scheduleError && (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {scheduleError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
            AI is generating your posts...
          </span>
        </div>
      ) : pendingSuggestions.length > 0 ? (
        <div className="space-y-3">
          {pendingSuggestions.map((suggestion) => {
            const platform =
              platforms.find((p) => p.id === suggestion.platform) || platforms[0];

            return (
              <div
                key={suggestion.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${platform.color}`}
                    >
                      <platform.icon size={16} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                          {platform.name}
                        </span>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                          {suggestion.niche}
                        </span>
                      </div>
                      <p className="max-w-full whitespace-pre-wrap wrap-break-word text-sm text-slate-800 dark:text-slate-100">
                        {suggestion.content}
                      </p>
                      {suggestion.imageUrl && (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${suggestion.imageUrl}`}
                          alt="AI generated"
                          className="mt-2 h-40 w-full rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock size={12} />
                        <span>{suggestion.suggestedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => approveSuggestion(suggestion.id)}
                      disabled={schedulingId === suggestion.id}
                      className="rounded-full bg-emerald-50 text-emerald-600 shadow-none hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 disabled:opacity-50"
                      title="Approve post"
                    >
                      {schedulingId === suggestion.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ThumbsUp size={14} />
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => rejectSuggestion(suggestion.id)}
                      className="rounded-full bg-red-50 text-red-600 shadow-none hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                      title="Reject post"
                    >
                      <XCircle size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <Brain size={28} className="mx-auto text-slate-300 dark:text-slate-600" />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            All posts approved or rejected. Click Regenerate to get new posts.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApprovalMode;