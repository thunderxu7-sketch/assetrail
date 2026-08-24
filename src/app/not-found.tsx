import Link from "next/link";

export default function NotFound() {
  return (
    <section className="empty-state container">
      <span className="empty-state__code">404</span>
      <h1>That rail is not connected.</h1>
      <p>The requested asset policy or transfer record does not exist in this simulation.</p>
      <Link className="button button--primary" href="/">
        Return to overview
      </Link>
    </section>
  );
}
