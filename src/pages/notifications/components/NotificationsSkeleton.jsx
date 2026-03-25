import { Skeleton } from '@common/components/shadcn/skeleton';

const NotificationsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Notifications List Skeleton */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start gap-4 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Skeleton className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3.5 w-3/4 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsSkeleton;