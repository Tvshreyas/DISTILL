export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-soft-black/5 rounded-xl mb-2" />
          <div className="h-4 w-32 bg-soft-black/5 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-soft-black/5 rounded-xl" />
      </div>

      {/* Streak / stats row */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 h-24 bg-soft-black/5 rounded-2xl border-2 border-soft-black/5" />
        <div className="flex-1 h-24 bg-soft-black/5 rounded-2xl border-2 border-soft-black/5" />
        <div className="flex-1 h-24 bg-soft-black/5 rounded-2xl border-2 border-soft-black/5" />
      </div>

      {/* Quick distill skeleton */}
      <div className="h-20 bg-soft-black/5 rounded-2xl border-2 border-soft-black/5 mb-8" />

      {/* Recent reflections skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-40 bg-soft-black/5 rounded-lg" />
        <div className="h-28 bg-soft-black/5 rounded-2xl border-2 border-soft-black/5" />
        <div className="h-28 bg-soft-black/5 rounded-2xl border-2 border-soft-black/5" />
      </div>
    </div>
  );
}
