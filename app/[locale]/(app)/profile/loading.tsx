export default function ProfileLoading() {
  return (
    <div className="flex flex-col">
      <header className="bg-surface border-b border-bd px-4 pt-12 pb-3 sticky top-0 z-10 flex items-center justify-between">
        <div className="h-6 w-28 bg-surface-alt rounded-lg animate-pulse" />
        <div className="h-4 w-16 bg-surface-alt rounded animate-pulse" />
      </header>
      <div className="px-4 py-6">
        <div className="flex items-start gap-4 mb-5 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-surface-alt flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-surface-alt rounded" />
            <div className="h-4 w-24 bg-surface-alt rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl border border-bd p-3 text-center animate-pulse">
              <div className="h-6 w-8 bg-surface-alt rounded mx-auto mb-1" />
              <div className="h-3 w-12 bg-surface-alt rounded mx-auto" />
            </div>
          ))}
        </div>
        <div className="h-9 bg-surface-alt rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
