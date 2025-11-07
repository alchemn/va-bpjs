"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface AnswerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string | null;
  answer: string | null;
  title: string;
}

export function AnswerDialog({ open, onOpenChange, question, answer, title }: AnswerDialogProps) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!answer || !open) return;
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      setTypedText(answer.slice(0, i));
      i++;
      if (i > answer.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [answer, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md md:max-w-3xl lg:max-w-5xl rounded-2xl [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="text-green-700 text-lg font-semibold">
            {title}
          </DialogTitle>

          <DialogClose asChild>
            <button
              className="absolute right-4 top-4 text-red-500 hover:text-red-600 transition-transform duration-200 hover:scale-110"
              aria-label="Tutup dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="mt-4 text-sm leading-relaxed">
          {question && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="font-semibold text-green-700">{question}</p>
            </div>
          )}

          <div className="flex gap-3 items-start">
            <Image
              src="/avatar/va.png"
              alt="Virtual Assistant"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full border border-green-100 bg-green-50 object-cover flex-shrink-0"
            />

            <div className="w-full md:max-w-[92%] rounded-2xl rounded-bl-none bg-white px-5 py-4 text-slate-700 shadow-lg ring-1 ring-green-100">
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: typedText || "Sedang menyiapkan jawaban...",
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
