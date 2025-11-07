"use client";
import { useState } from "react";
import { useAdministrasiData } from "@/hook/useAdministrasiData";
import { formatAnswerText } from "@/lib/format";
import { AdministrasiHeader } from "@/components/administrasi/AdministrasiHeader";
import { CategoryList } from "@/components/administrasi/CategoryList";
import { AnswerDialog } from "@/components/administrasi/AnswerDialog";
import { Loader2 } from "lucide-react";

export default function AdministrasiChatPage() {
  const { categories, loading, error } = useAdministrasiData();
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleQuestionClick = (q: string, a: string) => {
    setQuestion(q);
    setAnswer(formatAnswerText(a.split("<br />")));
    setOpenDialog(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 via-white to-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <AdministrasiHeader />

        {loading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Memuat data...</span>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <CategoryList
            categories={categories}
            onQuestionClick={handleQuestionClick}
          />
        )}
      </div>

      <AnswerDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        question={question}
        answer={answer}
      />
    </div>
  );
}