import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Speech-to-text melalui server dinonaktifkan. Gunakan fitur mikrofon langsung di browser.",
    },
    { status: 501 }
  );
}
