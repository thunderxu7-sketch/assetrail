type RouteModeBadgeProps = {
  mode: string;
  tone?: "mint" | "cyan" | "orange" | "violet";
};

export function RouteModeBadge({ mode, tone = "mint" }: RouteModeBadgeProps) {
  return (
    <span className={`route-mode route-mode--${tone}`}>
      <span aria-hidden="true" />
      {mode}
    </span>
  );
}
