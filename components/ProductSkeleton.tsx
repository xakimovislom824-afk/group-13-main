type ProductSkeletonProps = { count?: number };

export default function ProductSkeleton({ count = 4 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4" aria-label="Mahsulotlar yuklanmoqda" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_4px_16px_rgba(11,37,69,0.08)]">
          <div className="aspect-square animate-pulse rounded-lg bg-[var(--border)]" />
          <div className="mt-4 h-4 animate-pulse rounded bg-[var(--border)]" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[var(--border)]" />
          <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-[var(--border)]" />
          <div className="mt-3 h-10 animate-pulse rounded-lg bg-[var(--border)]" />
        </div>
      ))}
    </div>
  );
}
