import { Skeleton } from '@common/components/shadcn/skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — Profile Card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Banner */}
            <Skeleton className="h-24 w-full rounded-none" />
            <div className="-mt-12 px-6 pb-6">
              {/* Avatar */}
              <Skeleton className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900" />
              <div className="mt-4 space-y-4">
                {/* Name */}
                <Skeleton className="h-6 w-40" />
                {/* Email */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-3.5 w-48" />
                </div>
                {/* Bio */}
                <div className="flex items-start gap-2">
                  <Skeleton className="mt-0.5 h-3.5 w-3.5 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-4/5" />
                  </div>
                </div>
                {/* Role */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
                {/* Join date */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <Skeleton className="mb-2 h-8 w-8 rounded-lg" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="mt-1 h-3 w-20" />
              </div>
            ))}
          </div>

          {/* Connected Accounts */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="space-y-1 p-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg p-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;