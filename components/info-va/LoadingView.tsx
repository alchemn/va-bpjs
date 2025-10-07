export default function LoadingView() {
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-200/60" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 animate-pulse rounded-2xl bg-slate-200/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
