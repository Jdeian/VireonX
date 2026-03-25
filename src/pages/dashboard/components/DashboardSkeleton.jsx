import { Skeleton } from "@common/components/shadcn/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Posts */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-6 py-4">
                  <Skeleton className="mt-0.5 h-7 w-7 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-3 w-12 shrink-0" />
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Autopilot */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
            <div className="mt-3 space-y-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
            <Skeleton className="mt-3 h-3.5 w-36" />
          </div>

          {/* Connected Accounts */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="space-y-1 p-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
