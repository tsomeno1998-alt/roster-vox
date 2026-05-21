export default function TimelineLoading() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10">
        <div className="h-6 w-32 bg-surface-alt rounded-lg animate-pulse mb-3" />
        <div className="h-9 bg-surface-alt rounded-xl animate-pulse" />
      </header>
      <div className="flex-1 px-3 py-3 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-bd p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-surface-alt" />
              <div className="flex-1 space-y-1">
                <div className="h-3.5 w-24 bg-surface-alt rounded" />
                <div className="h-3 w-16 bg-surface-alt rounded" />
              </div>
              <div className="h-5 w-20 bg-surface-alt rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-surface-alt rounded mb-2" />
            <div className="h-3 w-full bg-surface-alt rounded mb-1" />
            <div className="h-3 w-2/3 bg-surface-alt rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
