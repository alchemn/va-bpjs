"use client";
import Image from "next/image";
import { CircleUser } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  avatar?: string;
}

export function ChatBubble({ role, content, avatar }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex flex-col gap-3 ${isUser ? "items-end" : ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {isUser ? "Pertanyaan Anda" : "Jawaban Virtual Assistant"}
      </span>
      <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
        {!isUser && (
          <Image
            src={avatar || "/avatar/va.png"}
            alt="Virtual Assistant"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full border border-sky-100 bg-sky-50 object-cover"
          />
        )}
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-lg ${isUser
              ? "rounded-br-none bg-green-600 text-white"
              : "rounded-bl-none bg-white text-slate-700 ring-1 ring-sky-100"
            }`}
        >
          <p>{content}</p>
        </div>
        {isUser && (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-green-700">
            <CircleUser className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
