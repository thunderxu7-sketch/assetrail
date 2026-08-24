"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="empty-state container">
      <span className="empty-state__code">RECOVERABLE</span>
      <h1>The view hit an unexpected state.</h1>
      <p>No real transaction was sent. Retry the isolated render without losing your input.</p>
      <button className="button button--primary" onClick={reset} type="button">
        Retry render
      </button>
    </section>
  );
}
