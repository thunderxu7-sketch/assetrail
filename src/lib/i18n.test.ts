import { describe, expect, it } from "vitest";

import {
  isLocale,
  localeFromAcceptLanguage,
  localizedPath,
  replacePathLocale,
  translate,
  translateValidationMessage,
} from "@/lib/i18n";

describe("internationalized routing", () => {
  it("recognizes only supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("prefixes and switches routes without changing the route shape", () => {
    expect(localizedPath("zh", "/assets/usdt")).toBe("/zh/assets/usdt");
    expect(localizedPath("en")).toBe("/en");
    expect(replacePathLocale("/en/transfer", "zh")).toBe("/zh/transfer");
  });

  it("negotiates the highest-priority supported browser language", () => {
    expect(localeFromAcceptLanguage("en-US,en;q=0.9,zh-CN;q=0.8")).toBe("en");
    expect(localeFromAcceptLanguage("fr-FR,zh-CN;q=0.9,en;q=0.7")).toBe("zh");
    expect(localeFromAcceptLanguage("zh-CN;q=0,en-US;q=0.8")).toBe("en");
  });

  it("interpolates Chinese product and validation copy", () => {
    expect(translate("zh", "View {asset} policy", { asset: "USDT" })).toBe("查看 USDT 策略");
    expect(translateValidationMessage("zh", "Minimum amount is 10 USDT")).toBe("最低金额为 10 USDT");
  });
});
