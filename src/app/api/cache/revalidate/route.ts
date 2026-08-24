import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({ tag: z.enum(["asset-catalog", "asset-policy:usdt", "asset-policy:btc", "asset-policy:eth", "asset-policy:xrp"]) });

export async function POST(request: Request) {
  const expected = process.env.REVALIDATION_TOKEN;
  const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || received !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Unsupported cache tag" }, { status: 422 });
  revalidateTag(parsed.data.tag, "max");
  return NextResponse.json({ revalidated: parsed.data.tag });
}
