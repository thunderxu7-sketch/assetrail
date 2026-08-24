import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("overview explains the product and rendering strategy", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Move digital assets with visible guarantees/i })).toBeVisible();
  await expect(page.getByText("SSG + cache tag", { exact: true })).toBeVisible();
  await expect(page.getByText("ISR + PPR", { exact: true })).toBeVisible();
  await expect(page.getByText("SSR + polling", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("language switch preserves the current route and renders Chinese content", async ({ page }) => {
  await page.goto("/en/assets?view=table");
  const chinesePreference = page.waitForResponse((response) =>
    response.url().endsWith("/api/locale") && response.request().method() === "POST",
  );
  await page.getByRole("link", { name: "中文", exact: true }).click();
  expect((await chinesePreference).status()).toBe(204);
  await expect(page).toHaveURL(/\/zh\/assets\?view=table$/);
  await expect(page.getByRole("heading", { name: "资产通道一览" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");

  await page.goto("/");
  await expect(page).toHaveURL(/\/zh$/);
  await page.goto("/zh/assets");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/assets$/);
  await expect(page.getByRole("heading", { name: "Asset rails at a glance" })).toBeVisible();
});

test("asset policy exposes network-specific controls", async ({ page }) => {
  await page.goto("/assets/usdt");
  await expect(page.getByRole("heading", { name: /USDT Tether/i })).toBeVisible();
  await expect(page.getByText("TRON", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Withdrawal fee").first()).toBeVisible();
});

test("simulated transfer validates and reconciles without a wallet", async ({ page }) => {
  await page.goto("/transfer");
  await expect(page.getByText(/without connecting a wallet/i)).toBeVisible();
  const submit = page.getByRole("button", { name: "Simulate withdrawal" });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page).toHaveURL(/\/transfers\/wd_/);
  await expect(page.getByText("SIMULATION RECEIPT")).toBeVisible();
  await expect(page.getByText("No chain explorer link")).toBeVisible();
});

test("maintenance rail blocks withdrawal before submission", async ({ page }) => {
  await page.goto("/transfer");
  await page.getByRole("button", { name: /XRP/ }).click();
  await expect(page.getByText("Withdrawals are paused for this rail.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Simulate withdrawal" })).toBeDisabled();
});

test("core pages have no serious accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Run the full axe scan once.");
  for (const route of ["/", "/assets", "/transfer", "/architecture", "/performance"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), route).toEqual([]);
  }
});

test("mobile layout avoids viewport-level horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile-specific viewport check.");
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("transfer endpoint replays the same idempotent request", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "API contract only needs one browser project.");
  const headers = { origin: "http://127.0.0.1:3000", "idempotency-key": "playwright-idempotency-001" };
  const data = { direction: "withdrawal", asset: "USDT", network: "tron", amount: 2500, address: "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb" };
  const first = await request.post("/api/transfers", { headers, data });
  expect(first.status()).toBe(201);
  const firstBody = await first.json() as { transfer: { id: string } };
  const cookie = first.headersArray()
    .filter((header) => header.name.toLowerCase() === "set-cookie")
    .map((header) => header.value.split(";", 1)[0])
    .join("; ");
  const replay = await request.post("/api/transfers", { headers: { ...headers, cookie }, data });
  expect(replay.status()).toBe(200);
  expect(replay.headers()["x-idempotent-replay"]).toBe("true");
  expect((await replay.json()).transfer.id).toBe(firstBody.transfer.id);
});

test("cache revalidation is closed without an operator token", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "API contract only needs one browser project.");
  const response = await request.post("/api/cache/revalidate", { data: { tag: "asset-catalog" } });
  expect(response.status()).toBe(401);
});
