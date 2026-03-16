export default function ReflectionLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="h-4 w-20 bg-soft-black/5 animate-pulse rounded" />
      <div className="space-y-4">
        <div className="h-6 w-32 bg-soft-black/5 animate-pulse rounded" />
        <div className="h-10 w-3/4 bg-soft-black/5 animate-pulse rounded" />
        <div className="h-4 w-48 bg-soft-black/5 animate-pulse rounded" />
      </div>
      <div className="h-px bg-soft-black/10" />
      <div className="space-y-4">
        <div className="h-8 w-full bg-soft-black/5 animate-pulse rounded-2xl" />
        <div className="h-8 w-5/6 bg-soft-black/5 animate-pulse rounded-2xl" />
        <div className="h-8 w-4/6 bg-soft-black/5 animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}
