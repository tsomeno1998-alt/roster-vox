export default function NotificationsLoading() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10">
        <div className="h-6 w-16 bg-surface-alt rounded-lg animate-pulse" />
      </header>
      <div className="divide-y divide-bd">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-surface-alt flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-3/4 bg-surface-alt rounded" />
              <div className="h-3 w-1/2 bg-surface-alt rounded" />
            </div>
            <div className="h-3 w-10 bg-surface-alt rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
