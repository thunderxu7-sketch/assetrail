import { NextResponse } from "next/server";
import { z } from "zod";

import { hasSafeJsonBody, isSameOriginRequest } from "@/lib/security";

const metricSchema = z.object({
  id: z.string().max(128),
  name: z.enum(["FCP", "LCP", "CLS", "TTFB", "INP"]),
  value: z.number().finite().nonnegative(),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  delta: z.number().finite(),
  timestamp: z.number().int().positive(),
});

export async function POST(request: Request) {
  if (!isSameOriginRequest(request) || !hasSafeJsonBody(request, 2_048)) return new NextResponse(null, { status: 400 });
  try {
    const metric = metricSchema.safeParse(await request.json());
    if (!metric.success) return new NextResponse(null, { status: 422 });
    // Production adapters would batch this validated contract into an analytics sink.
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
