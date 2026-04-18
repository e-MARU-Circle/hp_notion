export default function MemberLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-4 bg-stone-200 rounded w-48 mb-8" />
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div className="w-40 h-40 rounded-full bg-stone-200 flex-shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="flex gap-2">
            <div className="h-6 bg-stone-200 rounded-full w-20" />
            <div className="h-6 bg-stone-200 rounded-full w-24" />
          </div>
          <div className="space-y-3 mt-6">
            <div className="h-4 bg-stone-200 rounded w-full" />
            <div className="h-4 bg-stone-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
