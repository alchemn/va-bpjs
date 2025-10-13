import { NextResponse } from "next/server";
import { findLocalMatch } from "@/lib/localEmbbed"

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text)
    return NextResponse.json({ error: "Input kosong" }, { status: 400 });

  const best = await findLocalMatch(text);

  if (!best.q || best.score < 0.3) {
    return NextResponse.json({
      answer: "Maaf, saya belum punya informasi soal itu.",
      confidence: best.score,
      matched: best.q,
    });
  }

  console.log(`🎯 "${text}" → ${best.q} (${best.score.toFixed(2)})`);

  return NextResponse.json({
    answer: best.a,
    confidence: best.score,
    matched: best.q,
  });
}
