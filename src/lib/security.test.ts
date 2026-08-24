import { describe, expect, it } from "vitest";

import { hasSafeJsonBody, isSameOriginRequest } from "@/lib/security";

describe("request boundary checks", () => {
  it("accepts a matching origin and host", () => {
    const request = new Request("https://assetrail.example/api/transfers", {
      headers: { origin: "https://assetrail.example", host: "assetrail.example" },
    });
    expect(isSameOriginRequest(request)).toBe(true);
  });

  it("rejects a foreign origin", () => {
    const request = new Request("https://assetrail.example/api/transfers", {
      headers: { origin: "https://attacker.example", host: "assetrail.example" },
    });
    expect(isSameOriginRequest(request)).toBe(false);
  });

  it("requires bounded JSON input", () => {
    expect(hasSafeJsonBody(new Request("https://assetrail.example", { headers: { "content-type": "text/plain", "content-length": "8" } }))).toBe(false);
    expect(hasSafeJsonBody(new Request("https://assetrail.example", { headers: { "content-type": "application/json", "content-length": "5000" } }))).toBe(false);
    expect(hasSafeJsonBody(new Request("https://assetrail.example", { headers: { "content-type": "application/json", "content-length": "128" } }))).toBe(true);
  });
});
