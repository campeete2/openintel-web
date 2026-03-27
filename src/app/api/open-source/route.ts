import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/storage";

export async function GET() {
  const entries = await prisma.openSourceEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const dataType = formData.get("dataType") as string;
  const sourceUrl = formData.get("sourceUrl") as string | null;
  const description = formData.get("description") as string;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const files = formData.getAll("attachments") as File[];
  const attachmentKeys: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `open-source/${Date.now()}-${file.name}`;
    await uploadFile(key, buffer, file.type);
    attachmentKeys.push(key);
  }

  const entry = await prisma.openSourceEntry.create({
    data: { title, dataType, sourceUrl, description, tags, attachments: attachmentKeys },
  });

  return NextResponse.json(entry, { status: 201 });
}
