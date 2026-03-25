import { Skeleton } from '@common/components/shadcn/skeleton';

const ContentCenterSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="mt-1 h-8 w-24 rounded-lg" />
      </div>

      {/* Tabs + view toggle */}
      <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-6 pb-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <div className="mb-3 flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </div>

      {/* List rows */}
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="hidden h-5 w-24 shrink-0 rounded-full sm:block" />
              <div className="hidden items-center gap-1 md:flex">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentCenterSkeleton;