export const LOCALES = ["en", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "assetrail_locale";

const zh: Record<string, string> = {
  // Shell and metadata
  "AssetRail home": "AssetRail 首页",
  "Primary navigation": "主导航",
  "Skip to content": "跳到主要内容",
  Overview: "概览",
  Assets: "资产",
  "Transfer lab": "充提实验室",
  Operations: "运行监控",
  Architecture: "架构",
  "Simulation only. No real keys, funds, signatures, or transactions.": "仅供模拟，不涉及真实密钥、资金、签名或交易。",
  "Deposit & withdrawal reliability lab": "充提可靠性实验室",
  "A production-minded Next.js 16 reference for reliable digital-asset deposit and withdrawal experiences.":
    "面向生产场景的 Next.js 16 数字资产充提可靠性参考实现。",
  "Deposit & withdrawal reliability lab built with Next.js 16.": "基于 Next.js 16 构建的充提可靠性实验室。",

  // Overview
  "System status": "系统状态",
  "All demo services operational": "所有演示服务运行正常",
  "Updated from cached policy data": "已根据缓存策略数据更新",
  "Next.js 16 reference architecture": "Next.js 16 参考架构",
  "Move digital assets": "让数字资产",
  with: "流转具备",
  visible: "可见的",
  "guarantees.": "可靠保障。",
  "Move digital assets with": "让数字资产流转具备",
  "visible guarantees.": "可见的可靠保障。",
  "A production-minded deposit and withdrawal lab that turns rendering strategy, policy validation, resilience, security, and Core Web Vitals into observable product behavior.":
    "一个面向生产场景的充提实验室，将渲染策略、规则校验、韧性、安全和 Core Web Vitals 转化为可观察的产品行为。",
  "Run a simulated transfer": "运行模拟充提",
  "Explore the architecture": "查看系统架构",
  "No wallet connection": "无需连接钱包",
  "No real funds": "不涉及真实资金",
  "Open-source test suite": "开源测试套件",
  "Transfer pipeline visualization": "充提流程可视化",
  WITHDRAWAL: "提现",
  Amount: "金额",
  "{count} confirmations required": "需要 {count} 次确认",
  Validated: "已校验",
  "Policy review": "策略审核",
  Confirming: "确认中",
  Reconciled: "已对账",
  pending: "等待中",
  "Idempotency protected": "幂等保护已启用",
  "Network availability": "网络可用性",
  "healthy rails right now": "条通道当前健康",
  "Policy coverage": "策略覆盖率",
  "server + client validation parity": "服务端与客户端校验一致",
  "Duplicate execution": "重复执行",
  "idempotent request contract": "幂等请求契约",
  "CWV budget": "CWV 预算",
  Good: "良好",
  "LCP · INP · CLS thresholds": "LCP · INP · CLS 阈值",
  "One product · deliberate rendering": "一个产品 · 精细化渲染",
  "Rendering is an architecture decision, not a checkbox.": "渲染方式是架构决策，而不是勾选项。",
  "See decision record": "查看决策记录",
  "Asset policy catalog": "资产策略目录",
  "Stable policy data is rendered ahead of demand and revalidated by an explicit server-side control plane.":
    "稳定的策略数据提前渲染，并通过明确的服务端控制面重新验证。",
  "Network-aware asset detail": "感知网络的资产详情",
  "Popular rails are prebuilt while uncached policy details stream into a reusable static shell.":
    "常用通道提前构建，未缓存的策略详情则流式进入可复用的静态外壳。",
  "Personal transfer status": "个人充提状态",
  "Request-scoped data stays server rendered; a small client island progressively reconciles status.":
    "请求级数据保持服务端渲染，并由小型客户端岛逐步完成状态对账。",
  "Operational command view": "运行指挥视图",
  "Independent boundaries reveal availability and incident signals without blocking the entire page.":
    "独立边界分别呈现可用性和事故信号，不阻塞整个页面。",
  "Operational by design": "将运行保障融入设计",
  "The unhappy path is part of the interface.": "异常路径也是界面的一部分。",
  "Maintenance windows, invalid destination tags, risky amounts, duplicate submissions, and delayed confirmations are first-class states—not generic error toasts.":
    "维护窗口、无效目标标签、高风险金额、重复提交和延迟确认都是一等状态，而不是笼统的错误提示。",
  "Layered input and origin controls": "分层输入与来源控制",
  "Deterministic risk and hold simulation": "确定性的风险与拦截模拟",
  "Reconciliation timeline with explicit states": "状态明确的对账时间线",
  "Open operations view": "打开运行监控",
  "LIVE POLICY FEED": "实时策略流",
  "Rail availability": "通道可用性",
  observing: "监测中",
  "Trace the whole delivery": "追踪完整交付链路",
  "From product constraint to production signal.": "从产品约束到生产信号。",
  "Inspect Web Vitals": "查看 Web Vitals",
  "Read the source": "查看源代码",

  // Asset catalog and detail
  "Asset policies": "资产策略",
  "Cached policy catalog": "已缓存的策略目录",
  "Asset rails at a glance": "资产通道一览",
  "Stable policy data is rendered ahead of demand, tagged for targeted revalidation, and shared across route boundaries.":
    "稳定的策略数据提前渲染，通过标签精确重新验证，并在路由边界之间共享。",
  "Explicit freshness:": "明确的新鲜度策略：",
  "catalog reads are cached indefinitely until the protected revalidation endpoint expires the asset-catalog tag.":
    "目录读取会持续缓存，直到受保护的重新验证端点使 asset-catalog 标签失效。",
  Asset: "资产",
  "Reference price": "参考价格",
  Networks: "网络",
  Availability: "可用性",
  Status: "状态",
  View: "查看",
  "View {asset} policy": "查看 {asset} 策略",
  "Reference prices and availability are deterministic demo fixtures—not market data.": "参考价格和可用性均为确定性的演示数据，并非市场数据。",
  "{asset} network policy": "{asset} 网络策略",
  "{asset} deposit and withdrawal rail policies.": "{asset} 充值和提现通道策略。",
  "All asset policies": "全部资产策略",
  "stablecoin asset": "稳定币资产",
  "native asset": "原生资产",
  "deterministic fixture": "确定性演示数据",
  "Connected rails": "已连接通道",
  "Policy rules": "策略规则",
  "Cache window": "缓存窗口",
  "15 min": "15 分钟",
  "Product mode": "产品模式",
  Simulated: "模拟",
  "NETWORK MATRIX": "网络矩阵",
  "Deposit & withdrawal rules": "充提规则",
  Minimum: "最低金额",
  "Withdrawal fee": "提现手续费",
  Confirmations: "确认数",
  "Estimated time": "预计时间",
  "Routing field": "路由字段",
  required: "必填",
  "Use this rail": "使用此通道",
  "WHY ISR HERE": "为何在此使用 ISR",
  "Network rules change less often than transaction state. A tagged cache gives global read performance while keeping incident-driven invalidation precise.":
    "网络规则的变化频率低于交易状态。标签缓存兼顾全局读取性能，并让事故触发的失效保持精确。",
  "Read the decision record": "阅读决策记录",

  // Operations
  "Streaming operations surface": "流式运行监控界面",
  "See degradation before users feel it": "在用户感知前发现性能退化",
  "Independent request-time panels stream into a cached shell, so one slow signal never blocks the entire control surface.":
    "独立的请求时面板流式进入缓存外壳，因此单个慢信号不会阻塞整个控制界面。",
  "7 rails observed": "监测 7 条通道",
  "5 healthy · 1 congested · 1 maintenance": "5 条健康 · 1 条拥堵 · 1 条维护中",
  "30d simulated availability": "30 天模拟可用性",
  "unreconciled critical batches": "个未对账的关键批次",
  "Streaming demonstration:": "流式渲染演示：",
  "each panel has an intentional 180–320 ms server delay. The page shell and resolved panels remain independently useful.":
    "每个面板都设置了 180–320 毫秒的服务端延迟；页面外壳和已完成面板仍可独立使用。",
  "RAIL HEALTH": "通道健康度",
  "Availability matrix": "可用性矩阵",
  sampled: "采样于",
  Rail: "通道",
  Deposit: "充值",
  Withdrawal: "提现",
  Latency: "延迟",
  Enabled: "已启用",
  Paused: "已暂停",
  RECONCILIATION: "对账",
  "Latest batches": "最新批次",
  matched: "已匹配",
  review: "待审核",
  "Runtime sample at {time} UTC · values are deterministic fixtures.": "UTC {time} 运行时采样 · 数值为确定性演示数据。",
  "RISK QUEUE": "风险队列",
  "Manual review": "人工审核",
  "active hold": "个活动拦截",
  "Threshold: 100,000 units": "阈值：100,000 单位",
  "USDT withdrawal": "USDT 提现",
  "Volume rule · new destination": "金额规则 · 新目标地址",
  "Auto-release": "自动放行",
  Disabled: "已禁用",
  "Streaming operational data": "正在流式加载运行数据",

  // Architecture
  "Interview-ready decision record": "面试级决策记录",
  "Architecture with explicit trade-offs": "权衡明确的系统架构",
  "The repository connects product requirements to rendering, trust boundaries, performance budgets, observability, tests, and delivery controls.":
    "该仓库将产品需求与渲染、信任边界、性能预算、可观测性、测试和交付控制完整关联。",
  "Static documentation": "静态文档",
  Browser: "浏览器",
  "Static shell": "静态外壳",
  "React client islands": "React 客户端岛",
  "RSC + Cache Components": "RSC + 缓存组件",
  "Route Handlers": "路由处理器",
  "Suspense streaming": "Suspense 流式渲染",
  "validated contracts · tagged reads": "已校验契约 · 标签化读取",
  "Domain boundary": "领域边界",
  "Zod policies": "Zod 策略",
  Idempotency: "幂等性",
  "Status machine": "状态机",
  "HMAC cookie": "HMAC Cookie",
  "simulated adapters": "模拟适配器",
  "Deterministic fixtures": "确定性演示数据",
  "Rail health": "通道健康度",
  "Reconciliation batches": "对账批次",
  "RENDERING ADR": "渲染 ADR",
  "Route-by-route strategy": "按路由制定渲染策略",
  Route: "路由",
  Mode: "模式",
  Freshness: "新鲜度",
  Why: "原因",
  "Risk → mitigation": "风险 → 缓解措施",
  "Explicit tag": "显式标签",
  "High-read, low-churn policy catalog": "高读取、低变更的策略目录",
  "Stale rail state": "通道状态过期",
  "Incident-triggered revalidation": "事故触发重新验证",
  "15 minutes": "15 分钟",
  "Reusable shell with evolving network rules": "复用外壳并支持持续演进的网络规则",
  "Partial cache drift": "局部缓存漂移",
  "Asset-scoped cache tags": "资产级缓存标签",
  "No store": "不缓存",
  "Personal, fast-changing transfer state": "个人化且快速变化的充提状态",
  "Server load": "服务器负载",
  "Small response + client reconciliation": "小响应体 + 客户端对账",
  "Request time": "请求时",
  "Independent operational signals": "相互独立的运行信号",
  "Slow dependency": "慢依赖",
  "Per-panel Suspense boundaries": "每个面板独立的 Suspense 边界",
  "TRUST BOUNDARIES": "信任边界",
  "Defense in layers": "分层防御",
  "Same-origin enforcement, bounded JSON, schema validation, policy checks, HttpOnly signed cookies, strict security headers, and no secret-bearing client code.":
    "同源校验、JSON 大小限制、Schema 校验、策略检查、HttpOnly 签名 Cookie、严格安全响应头，以及不携带密钥的客户端代码。",
  "Threat model": "威胁模型",
  PERFORMANCE: "性能",
  "Budgets over anecdotes": "以预算代替主观判断",
  "Good-threshold budgets for LCP, INP, and CLS; local field telemetry; route-aware bundle inspection; and stable skeleton geometry.":
    "为 LCP、INP、CLS 设置良好阈值预算，并提供本地真实用户遥测、路由级包体检查和稳定的骨架屏布局。",
  "Runtime telemetry": "运行时遥测",
  "AI DELIVERY": "AI 交付",
  "AI with quality gates": "由质量门禁约束的 AI 研发",
  "AI accelerates decomposition, test matrices, and implementation. Deterministic lint, type, unit, build, accessibility, and E2E checks own the acceptance decision.":
    "AI 加速任务拆解、测试矩阵和实现；确定性的 lint、类型、单元测试、构建、无障碍与 E2E 检查负责最终验收。",
  Workflow: "工作流",
  "Untrusted input": "不可信输入",
  "browser request": "浏览器请求",
  "Policy gate": "策略门禁",
  "origin + size + Zod": "来源 + 大小 + Zod",
  "Domain action": "领域操作",
  "deterministic simulation": "确定性模拟",
  "Private state": "私有状态",
  "signed HttpOnly cookie": "签名 HttpOnly Cookie",

  // Transfer form and tracker
  "Safe interaction lab": "安全交互实验室",
  "Exercise the transfer contract": "验证充提业务契约",
  "Validate network rules, error recovery, idempotency, and progress states without connecting a wallet or touching real funds.":
    "无需连接钱包或接触真实资金，即可验证网络规则、错误恢复、幂等性和流程状态。",
  "Transfer direction": "充提方向",
  Withdraw: "提现",
  "Select an asset": "选择资产",
  "Policy rules update with your selection": "策略规则会随选择更新",
  "Choose a network": "选择网络",
  "Availability is evaluated before submission": "提交前会校验可用性",
  "Withdrawals are paused for this rail. Select another network or direction.": "该通道已暂停提现，请选择其他网络或方向。",
  "Deposits are paused for this rail. Select another network or direction.": "该通道已暂停充值，请选择其他网络或方向。",
  "Enter transfer details": "填写充提详情",
  "Demo values only—never paste a private key": "仅填写演示数据，切勿粘贴私钥",
  "Minimum {amount} {asset}": "最低 {amount} {asset}",
  "Destination address": "目标地址",
  "Prefilled with a public demo address": "已预填公开演示地址",
  "Required by this network": "该网络要求填写",
  "Validating request": "正在校验请求",
  "Simulate {direction}": "模拟{direction}",
  "This creates an HttpOnly demo record. It cannot sign or broadcast a real transaction.": "这将创建 HttpOnly 演示记录，无法签名或广播真实交易。",
  "POLICY PREVIEW": "策略预览",
  "{asset} on {network}": "{asset} · {network}",
  Direction: "方向",
  "Network fee": "网络手续费",
  "Estimated receive": "预计到账",
  "USD reference": "美元参考价值",
  "Expected rail time": "预计通道耗时",
  "Address format validation": "地址格式校验",
  "Availability & minimum rules": "可用性和最低金额规则",
  "Duplicate request protection": "重复请求保护",
  "Manual hold above 100,000": "超过 100,000 时人工拦截",
  deposit: "充值",
  withdrawal: "提现",
  "The request could not be validated.": "请求未通过校验。",
  "The simulation endpoint is unavailable. No transaction was sent.": "模拟服务暂不可用，未发送任何交易。",
  "New simulation": "新建模拟",
  "Transfer status": "充提状态",
  "TRANSFER STATE": "充提状态",
  "Request created": "请求已创建",
  "Input accepted and protected by an idempotency key.": "输入已接受，并受到幂等键保护。",
  "Network availability, limits, address and risk rules are being evaluated.": "正在评估网络可用性、限额、地址和风险规则。",
  Broadcasting: "广播中",
  "A signed mock transaction is being submitted to the selected network.": "正在向所选网络提交已签名的模拟交易。",
  "The network has accepted the transaction; confirmations are accumulating.": "网络已接受该交易，确认数正在累积。",
  Completed: "已完成",
  "Required confirmations reached and the ledger view is reconciled.": "已达到所需确认数，账本视图已完成对账。",
  "Held for review": "已拦截待审核",
  "The amount crossed the demo risk threshold and needs manual approval.": "金额超过演示风险阈值，需要人工审批。",
  Failed: "失败",
  "The operation stopped without changing any real balance.": "操作已停止，未改变任何真实余额。",
  "Manual review boundary reached": "已进入人工审核边界",
  "This deterministic demo does not automatically advance held records.": "此确定性演示不会自动推进已拦截记录。",
  "Refresh state": "刷新状态",
  "Auto-reconciles every 1.5 seconds while active": "活动期间每 1.5 秒自动对账",
  "SIMULATION RECEIPT": "模拟回执",
  "Transfer ID": "充提 ID",
  "Copy transfer ID": "复制充提 ID",
  Network: "网络",
  Destination: "目标地址",
  "Risk score": "风险评分",
  Created: "创建时间",
  "No chain explorer link": "不提供区块浏览器链接",
  "This is deliberately not a real transaction. Explorer links are never fabricated.": "这并非真实交易，因此不会伪造区块浏览器链接。",
  "Review the trust boundaries": "查看信任边界",

  // Performance
  "Measure the user experience": "衡量用户体验",
  "Core Web Vitals are release criteria": "Core Web Vitals 是发布标准",
  "This local field dashboard captures LCP, INP, and CLS from the current browser. The same contract can feed a production analytics backend.":
    "此本地真实用户数据面板采集当前浏览器的 LCP、INP 和 CLS，同一契约可接入生产分析后端。",
  "Client telemetry island": "客户端遥测岛",
  "Browse the app to collect a local sample": "浏览应用以采集本地样本",
  "{rating} field rating": "真实用户评级：{rating}",
  good: "良好",
  "needs-improvement": "需要改进",
  poor: "较差",
  waiting: "等待采样",
  "Good threshold ≤ {value}{unit}": "良好阈值 ≤ {value}{unit}",
  "LOCAL FIELD TELEMETRY": "本地真实用户遥测",
  "Current browser session": "当前浏览器会话",
  Reset: "重置",
  "No local samples yet": "暂无本地样本",
  "Navigate through several routes, interact with the transfer form, then return. Web Vitals are captured through the framework reporter.":
    "浏览多个路由并操作充提表单后返回；框架报告器会自动采集 Web Vitals。",
  "Stable geometry": "稳定布局",
  "Explicit skeleton and card dimensions reduce layout shifts.": "明确的骨架屏和卡片尺寸可减少布局偏移。",
  "Small client boundary": "小型客户端边界",
  "Interactivity is isolated from cached server-rendered content.": "交互逻辑与缓存的服务端渲染内容相互隔离。",
  "Production feedback loop": "生产反馈闭环",
  "Field signals can be sent to the provided ingestion contract.": "真实用户信号可发送到项目提供的采集契约。",

  // Status, availability, and errors
  Healthy: "健康",
  Congested: "拥堵",
  Maintenance: "维护中",
  "D on": "充 开",
  "D off": "充 关",
  "W on": "提 开",
  "W off": "提 关",
  "Unsupported asset or network": "不支持该资产或网络",
  "Withdrawals are paused for this network": "该网络已暂停提现",
  "Deposits are paused for this network": "该网络已暂停充值",
  "Minimum amount is {value}": "最低金额为 {value}",
  "Address format does not match the selected network": "地址格式与所选网络不匹配",
  "{field} is required": "{field}为必填项",
  "Cross-origin transfer requests are rejected.": "已拒绝跨域充提请求。",
  "Expected an application/json body under 4 KB.": "请求体必须是小于 4 KB 的 application/json。",
  "A valid Idempotency-Key header is required.": "必须提供有效的 Idempotency-Key 请求头。",
  "Malformed JSON body.": "JSON 请求体格式错误。",
  "Review the highlighted policy violations.": "请检查已标出的策略违规项。",
  "Transfer record not found.": "未找到充提记录。",
  "Destination tag": "目标标签",
  "Loading route": "正在加载页面",
  RECOVERABLE: "可恢复",
  "The view hit an unexpected state.": "页面遇到了意外状态。",
  "No real transaction was sent. Retry the isolated render without losing your input.": "未发送任何真实交易；可重试当前渲染，输入不会丢失。",
  "Retry render": "重试渲染",
  "That rail is not connected.": "该通道尚未连接。",
  "The requested asset policy or transfer record does not exist in this simulation.": "请求的资产策略或充提记录不存在于此模拟环境中。",
  "Return to overview": "返回概览",
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const preferences = header
    .split(",")
    .map((entry, index) => {
      const [language = "", ...parameters] = entry.trim().toLowerCase().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter ? Number.parseFloat(qualityParameter.trim().slice(2)) : 1;
      return { language, quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(({ quality }) => quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index);

  for (const { language } of preferences) {
    const baseLanguage = language.split("-")[0];
    if (isLocale(baseLanguage)) return baseLanguage;
    if (language === "*") return DEFAULT_LOCALE;
  }

  return DEFAULT_LOCALE;
}

export function translate(
  locale: Locale,
  source: string,
  values: Record<string, string | number> = {},
) {
  let result = locale === "zh" ? (zh[source] ?? source) : source;
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}

export function localizedPath(locale: Locale, path = "/") {
  if (!path.startsWith("/")) return path;
  const normalized = path === "/" ? "" : path;
  return `/${locale}${normalized}`;
}

export function replacePathLocale(pathname: string, locale: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (isLocale(parts[0])) parts.shift();
  return `/${locale}${parts.length ? `/${parts.join("/")}` : ""}`;
}

export function translateRailTime(locale: Locale, value: string) {
  if (locale === "en") return value;
  return value
    .replace("~1 min", "约 1 分钟")
    .replace("<1 min", "少于 1 分钟")
    .replace(/(\d+)-(\d+) min/, "$1–$2 分钟")
    .replace(/(\d+)-(\d+) minutes/, "$1–$2 分钟");
}

export function translateValidationMessage(locale: Locale, message: string) {
  if (locale === "en") return message;
  const minimum = message.match(/^Minimum amount is (.+)$/);
  if (minimum) return translate(locale, "Minimum amount is {value}", { value: minimum[1] });
  const required = message.match(/^(.+) is required$/);
  if (required) return translate(locale, "{field} is required", { field: translate(locale, required[1]) });
  return translate(locale, message);
}
