/** Shown while the Today page's server component resolves its DB queries -
 * every route here is force-dynamic (reads live state per request), so
 * without this Next.js just renders nothing until the round-trip finishes. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="mb-4 flex flex-col gap-2">
        <div className="h-9 rounded-full bg-panel-2" />
        <div className="mx-auto h-4 w-48 rounded bg-panel-2" />
        <div className="h-14 rounded-xl bg-panel-2" />
      </div>
      <div className="card mb-3 h-24 p-4" />
      <div className="card mb-3 h-28 p-4" />
      <div className="card mb-3 h-64 p-4" />
    </div>
  );
}
