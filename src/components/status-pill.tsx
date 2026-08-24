import type { NetworkStatus } from "@/lib/assets";
import { translate, type Locale } from "@/lib/i18n";
import type { TransferStatus } from "@/lib/transfers";

type Status = NetworkStatus | TransferStatus;

const labels: Record<Status, string> = {
  healthy: "Healthy",
  congested: "Congested",
  maintenance: "Maintenance",
  created: "Created",
  policy_review: "Policy review",
  broadcasting: "Broadcasting",
  confirming: "Confirming",
  completed: "Completed",
  held: "Held",
  failed: "Failed",
};

const zhLabels: Record<Status, string> = {
  healthy: "健康",
  congested: "拥堵",
  maintenance: "维护中",
  created: "已创建",
  policy_review: "策略审核",
  broadcasting: "广播中",
  confirming: "确认中",
  completed: "已完成",
  held: "已拦截",
  failed: "失败",
};

export function StatusPill({ status, locale = "en" }: { status: Status; locale?: Locale }) {
  return <span className={`status-pill status-pill--${status}`}>{locale === "zh" ? zhLabels[status] : labels[status]}</span>;
}

export function AvailabilityPills({ deposit, withdrawal, locale = "en" }: { deposit: boolean; withdrawal: boolean; locale?: Locale }) {
  return (
    <span className="availability-pills">
      <span className={deposit ? "available" : "paused"}>{translate(locale, `D ${deposit ? "on" : "off"}`)}</span>
      <span className={withdrawal ? "available" : "paused"}>{translate(locale, `W ${withdrawal ? "on" : "off"}`)}</span>
    </span>
  );
}
