export default function PaperLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-4 bg-stone-200 rounded w-48 mb-8" />
      <div className="mb-8">
        <div className="h-6 bg-stone-200 rounded w-3/4 mb-2" />
        <div className="h-8 bg-stone-200 rounded w-full mb-4" />
        <div className="flex gap-2 pb-4 border-b border-stone-200">
          <div className="h-6 bg-stone-200 rounded-full w-20" />
          <div className="h-6 bg-stone-200 rounded-full w-24" />
          <div className="h-6 bg-stone-200 rounded-full w-16" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="h-4 bg-stone-200 rounded w-5/6" />
        <div className="h-4 bg-stone-200 rounded w-4/5" />
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
      </div>
    </div>
  );
}
