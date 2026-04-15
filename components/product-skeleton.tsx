export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-full animate-pulse rounded bg-secondary" />
        <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
        <div className="h-6 w-20 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  )
}
