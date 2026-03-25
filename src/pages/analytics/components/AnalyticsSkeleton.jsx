import { Skeleton } from '@common/components/shadcn/skeleton';

const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="mt-1 h-8 w-24 rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <Skeleton className="h-11 w-11 rounded-lg" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-6 pb-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {/* Metric tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-28 rounded-md" />
            ))}
          </div>
          {/* Range tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-10 rounded-md" />
            ))}
          </div>
        </div>
        <Skeleton className="h-52 w-full rounded-lg" />
      </div>

      {/* Platform cards grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="h-3.5 w-8" />
              </div>
            </div>
            <Skeleton className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Platform comparison bar chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="mb-5 h-5 w-44" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-40" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;