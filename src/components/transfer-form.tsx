"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Info, LoaderCircle, ShieldCheck } from "lucide-react";

import { AssetIcon } from "@/components/asset-icon";
import { StatusPill } from "@/components/status-pill";
import { ASSETS, DEFAULT_ADDRESSES } from "@/lib/assets";
import { formatAmount, formatCurrency } from "@/lib/format";
import type { TransferDirection } from "@/lib/transfers";

type FieldErrors = Record<string, string[]>;

export function TransferForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get("asset")?.toUpperCase();
  const initialAsset = ASSETS.find((asset) => asset.symbol === initialSymbol) ?? ASSETS[0];
  const initialNetwork = initialAsset.networks.find((network) => network.id === searchParams.get("network")) ?? initialAsset.networks[0];

  const [direction, setDirection] = useState<TransferDirection>("withdrawal");
  const [assetSymbol, setAssetSymbol] = useState(initialAsset.symbol);
  const [networkId, setNetworkId] = useState(initialNetwork.id);
  const [amount, setAmount] = useState("2500");
  const [address, setAddress] = useState(DEFAULT_ADDRESSES[initialNetwork.id]);
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [pending, setPending] = useState(false);
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);

  const asset = useMemo(() => ASSETS.find((candidate) => candidate.symbol === assetSymbol) ?? ASSETS[0], [assetSymbol]);
  const network = useMemo(() => asset.networks.find((candidate) => candidate.id === networkId) ?? asset.networks[0], [asset, networkId]);
  const amountNumber = Number(amount) || 0;
  const estimatedReceive = Math.max(0, amountNumber - (direction === "withdrawal" ? network.withdrawalFee : 0));

  function selectAsset(symbol: string) {
    const nextAsset = ASSETS.find((candidate) => candidate.symbol === symbol) ?? ASSETS[0];
    const nextNetwork = nextAsset.networks[0];
    setAssetSymbol(nextAsset.symbol);
    setNetworkId(nextNetwork.id);
    setAddress(DEFAULT_ADDRESSES[nextNetwork.id]);
    setMemo("");
    setErrors({});
  }

  function selectNetwork(id: string) {
    setNetworkId(id);
    setAddress(DEFAULT_ADDRESSES[id]);
    setMemo("");
    setErrors({});
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setSubmitError("");

    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
        body: JSON.stringify({ direction, asset: asset.symbol, network: network.id, amount, address, memo: memo || undefined }),
      });
      const body = await response.json() as { transfer?: { id: string }; error?: string; fields?: FieldErrors };

      if (!response.ok || !body.transfer) {
        setErrors(body.fields ?? {});
        setSubmitError(body.error ?? "The request could not be validated.");
        return;
      }
      router.push(`/transfers/${body.transfer.id}`);
    } catch {
      setSubmitError("The simulation endpoint is unavailable. No transaction was sent.");
    } finally {
      setPending(false);
    }
  }

  const disabled = direction === "withdrawal" ? !network.withdrawalEnabled : !network.depositEnabled;

  return (
    <div className="transfer-layout">
      <form className="transfer-form" onSubmit={submit} noValidate>
        <div className="direction-toggle" aria-label="Transfer direction">
          <button className={direction === "deposit" ? "active" : ""} onClick={() => setDirection("deposit")} type="button">
            <ArrowDownToLine size={17} /> Deposit
          </button>
          <button className={direction === "withdrawal" ? "active" : ""} onClick={() => setDirection("withdrawal")} type="button">
            <ArrowUpFromLine size={17} /> Withdraw
          </button>
        </div>

        <div className="form-section">
          <div className="form-section__label"><span>01</span><div><strong>Select an asset</strong><small>Policy rules update with your selection</small></div></div>
          <div className="asset-picker">
            {ASSETS.map((candidate) => (
              <button className={candidate.symbol === asset.symbol ? "active" : ""} key={candidate.symbol} onClick={() => selectAsset(candidate.symbol)} type="button">
                <AssetIcon asset={candidate} size="sm" /><span><strong>{candidate.symbol}</strong><small>{candidate.name}</small></span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section__label"><span>02</span><div><strong>Choose a network</strong><small>Availability is evaluated before submission</small></div></div>
          <div className="network-picker">
            {asset.networks.map((candidate) => (
              <button className={candidate.id === network.id ? "active" : ""} key={candidate.id} onClick={() => selectNetwork(candidate.id)} type="button">
                <span><strong>{candidate.name}</strong><small>{candidate.chain}</small></span><StatusPill status={candidate.status} />
              </button>
            ))}
          </div>
          {disabled ? <div className="inline-alert inline-alert--warning"><AlertTriangle size={17} /><span>{direction === "withdrawal" ? "Withdrawals" : "Deposits"} are paused for this rail. Select another network or direction.</span></div> : null}
        </div>

        <div className="form-section">
          <div className="form-section__label"><span>03</span><div><strong>Enter transfer details</strong><small>Demo values only—never paste a private key</small></div></div>
          <div className="field-grid">
            <label className="field field--amount">
              <span>Amount</span>
              <span className="input-with-suffix"><input aria-invalid={Boolean(errors.amount)} inputMode="decimal" min="0" name="amount" onChange={(event) => setAmount(event.target.value)} value={amount} /><strong>{asset.symbol}</strong></span>
              {errors.amount ? <small className="field-error">{errors.amount[0]}</small> : <small>Minimum {formatAmount(network.minWithdrawal)} {asset.symbol}</small>}
            </label>
            <label className="field">
              <span>Destination address</span>
              <input aria-invalid={Boolean(errors.address)} autoComplete="off" name="address" onChange={(event) => setAddress(event.target.value)} spellCheck={false} value={address} />
              {errors.address ? <small className="field-error">{errors.address[0]}</small> : <small>Prefilled with a public demo address</small>}
            </label>
            {network.memoLabel ? (
              <label className="field">
                <span>{network.memoLabel}</span>
                <input aria-invalid={Boolean(errors.memo)} inputMode="numeric" name="memo" onChange={(event) => setMemo(event.target.value)} placeholder="Required by this network" value={memo} />
                {errors.memo ? <small className="field-error">{errors.memo[0]}</small> : null}
              </label>
            ) : null}
          </div>
        </div>

        {submitError ? <div className="inline-alert inline-alert--danger" role="alert"><AlertTriangle size={17} /><span>{submitError}</span></div> : null}

        <button className="button button--primary transfer-submit" disabled={pending || disabled || !hydrated} type="submit">
          {pending ? <><LoaderCircle className="spin" size={17} /> Validating request</> : <><ShieldCheck size={17} /> Simulate {direction}</>}
        </button>
        <p className="simulation-copy"><Info size={14} /> This creates an HttpOnly demo record. It cannot sign or broadcast a real transaction.</p>
      </form>

      <aside className="policy-summary">
        <div className="panel-header"><div><span className="panel-kicker">POLICY PREVIEW</span><h2>{asset.symbol} on {network.name}</h2></div><StatusPill status={network.status} /></div>
        <div className="policy-summary__route"><AssetIcon asset={asset} size="lg" /><span className="route-line" /><span className="network-node">{network.chain}</span></div>
        <dl>
          <div><dt>Direction</dt><dd>{direction}</dd></div>
          <div><dt>Network fee</dt><dd>{direction === "withdrawal" ? `${formatAmount(network.withdrawalFee)} ${asset.symbol}` : "—"}</dd></div>
          <div><dt>Estimated receive</dt><dd>{formatAmount(estimatedReceive)} {asset.symbol}</dd></div>
          <div><dt>USD reference</dt><dd>{formatCurrency(estimatedReceive * asset.price)}</dd></div>
          <div><dt>Confirmations</dt><dd>{network.confirmations}</dd></div>
          <div><dt>Expected rail time</dt><dd>{network.estimatedMinutes}</dd></div>
        </dl>
        <div className="policy-checks">
          <span><CheckCircle2 /> Address format validation</span>
          <span><CheckCircle2 /> Availability & minimum rules</span>
          <span><CheckCircle2 /> Duplicate request protection</span>
          <span><CheckCircle2 /> Manual hold above 100,000</span>
        </div>
      </aside>
    </div>
  );
}
