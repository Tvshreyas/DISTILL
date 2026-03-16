export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-soft-black/5" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-peach animate-spin" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-text">fetching your insights...</p>
      </div>
    </div>
  );
}
