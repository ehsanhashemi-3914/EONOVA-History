/**
 * Shown instantly while a route's Server Component is still being prepared.
 * A "skeleton" (grey placeholder blocks) hints at the layout that is coming.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="border-b border-line graticule">
        <div className="shell py-10 md:py-14 space-y-4">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-9 w-72 max-w-full" />
          <div className="skeleton h-4 w-[32rem] max-w-full" />
        </div>
      </div>
      <div className="shell py-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton h-40" />
        ))}
      </div>
    </div>
  );
}
