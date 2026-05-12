// Generic skeleton block
export const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Info card skeleton (used on dashboard top row)
export const InfoCardSkeleton = () => (
  <div className="card flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-200" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

// Transaction row skeleton
export const TransactionRowSkeleton = () => (
  <div className="flex items-center gap-3 py-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-16" />
  </div>
);

// Chart area skeleton
export const ChartSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
    <div className="h-[300px] bg-gray-100 rounded" />
  </div>
);

// Full dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="my-5 mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InfoCardSkeleton />
      <InfoCardSkeleton />
      <InfoCardSkeleton />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
);

// Transaction list skeleton
export const TransactionListSkeleton = ({ rows = 5 }) => (
  <div className="card">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
    {Array.from({ length: rows }).map((_, i) => (
      <TransactionRowSkeleton key={i} />
    ))}
  </div>
);
