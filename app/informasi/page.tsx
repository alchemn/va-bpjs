"use client";
import { FormEvent, useState, useEffect } from "react";
import { useInformasiData } from "@/hook/useInformasiData";
import { useSpeechRecognition } from "@/hook/speech";
import { InformasiHeader } from "@/components/informasi/InformasiHeader";
import { ChatSection } from "@/components/informasi/ChatSection";
import { AnswerDialog } from "@/components/informasi/AnswerDialog";
import { Loader2 } from "lucide-react";

export default function InformasiPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useInformasiData();
  const [inputValue, setInputValue] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");

  const handleTranscript = (transcript: string) => {
    setInputValue(transcript);
    submitQuestion(transcript);
  };

  const { isRecording, error: recordingError, start, stop } = useSpeechRecognition(handleTranscript);

  const submitQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setUserQuestion(trimmed);
    setAnswer("");
    setTypedAnswer("");

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      setAnswer(data.answer || "Maaf, belum ada jawaban.");
      setInputValue("");
    } catch {
      console.error("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitQuestion(inputValue);
  };

  const handleCategoryClick = (title: string, content: string) => {
    setDialogTitle(title);
    setDialogContent(content);
    setOpenDialog(true);
  };

  useEffect(() => {
    if (!answer) {
      setTypedAnswer("");
      return;
    }
    let i = 0;
    const typingTimer = setInterval(() => {
      setTypedAnswer(answer.slice(0, i));
      i++;
      if (i > answer.length) clearInterval(typingTimer);
    }, 25);

    return () => {
      clearInterval(typingTimer);
    };
  }, [answer]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 via-white to-white px-4 py-8">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        <InformasiHeader />

        {categoriesLoading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Memuat data...</span>
          </div>
        ) : categoriesError ? (
          <div className="text-red-600">{categoriesError}</div>
        ) : (
          <>
            <ChatSection
              userQuestion={userQuestion}
              loading={loading}
              typedAnswer={typedAnswer}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={handleSubmit}
              isRecording={isRecording}
              startRecording={start}
              stopRecording={stop}
              recordingError={recordingError}
              categories={categories}
              onCategoryClick={handleCategoryClick}
            />
          </>
        )}
      </div>

      <AnswerDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={dialogTitle}
        question={null}
        answer={dialogContent}
      />
    </div>
  );
}