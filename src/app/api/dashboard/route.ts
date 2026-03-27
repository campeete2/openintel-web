import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [osint, asns, openSource] = await Promise.all([
    prisma.osintEntry.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.asnEntry.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.openSourceEntry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({ osint, asns, openSource });
}
