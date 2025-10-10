import { NextResponse } from "next/server";
import fs from 'fs';
import OpenAI from "openai";

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

export async function POST(req: Request){
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    const buffer = Buffer.from(await audio.arrayBuffer());
    fs.writeFileSync("/tmp/audio.wemb", buffer);

    const result = await client.audio.transcriptions.create({
        file: fs.createReadStream("/tmp/audio.webm"),
        model: "whisper-1",
        language: "id"
    })
    return NextResponse.json({text: result.text})
}