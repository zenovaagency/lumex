export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="skeleton h-12 w-96 rounded-2xl" />
          <div className="skeleton h-6 w-64 rounded-xl" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="skeleton aspect-[4/5] rounded-2xl" />
              <div className="skeleton h-4 w-3/4 rounded-xl" />
              <div className="skeleton h-4 w-1/2 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
