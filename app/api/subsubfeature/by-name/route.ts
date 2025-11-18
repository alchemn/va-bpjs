import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ message: "Nama diperlukan" }, { status: 400 });
    }

    const sub = await prisma.subSubFeature.findFirst({
      where: { name },
    });

    if (!sub) {
      return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(sub);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
