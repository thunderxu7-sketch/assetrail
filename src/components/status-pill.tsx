import type { NetworkStatus } from "@/lib/assets";
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

export function StatusPill({ status }: { status: Status }) {
  return <span className={`status-pill status-pill--${status}`}>{labels[status]}</span>;
}

export function AvailabilityPills({ deposit, withdrawal }: { deposit: boolean; withdrawal: boolean }) {
  return (
    <span className="availability-pills">
      <span className={deposit ? "available" : "paused"}>D {deposit ? "on" : "off"}</span>
      <span className={withdrawal ? "available" : "paused"}>W {withdrawal ? "on" : "off"}</span>
    </span>
  );
}
