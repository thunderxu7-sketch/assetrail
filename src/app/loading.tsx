export default function Loading() {
  return (
    <div className="container page-loading" aria-label="Loading route">
      <div className="skeleton skeleton--eyebrow" />
      <div className="skeleton skeleton--heading" />
      <div className="skeleton-grid">
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
      </div>
    </div>
  );
}
