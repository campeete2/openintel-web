import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Status } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, notes } = body as { status: Status; notes?: string };

  const entry = await prisma.openSourceEntry.update({
    where: { id },
    data: { status, notes },
  });

  return NextResponse.json(entry);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.openSourceEntry.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
