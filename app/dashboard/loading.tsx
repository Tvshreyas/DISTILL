export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
        </div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
