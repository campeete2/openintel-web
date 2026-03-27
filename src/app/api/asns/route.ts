import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/storage";

export async function GET() {
  const entries = await prisma.asnEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const asn = formData.get("asn") as string;
  const organization = formData.get("organization") as string;
  const country = formData.get("country") as string | null;
  const ipRangesRaw = formData.get("ipRanges") as string;
  const description = formData.get("description") as string | null;
  const tagsRaw = formData.get("tags") as string;

  const ipRanges = ipRangesRaw ? ipRangesRaw.split(",").map((r) => r.trim()).filter(Boolean) : [];
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const files = formData.getAll("attachments") as File[];
  const attachmentKeys: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `asns/${Date.now()}-${file.name}`;
    await uploadFile(key, buffer, file.type);
    attachmentKeys.push(key);
  }

  const entry = await prisma.asnEntry.create({
    data: { asn, organization, country, ipRanges, description, tags, attachments: attachmentKeys },
  });

  return NextResponse.json(entry, { status: 201 });
}
