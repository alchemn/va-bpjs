"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QAItem {
  q: string;
  a: string[];
}

interface CategoryData {
  title: string;
  question: QAItem[];
}

interface CategoryListProps {
  categories: Array<{ key: string } & CategoryData>;
  onQuestionClick: (question: string, answer: string) => void;
}

export function CategoryList({ categories, onQuestionClick }: CategoryListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-green-100">
      <div className="space-y-6">
        <div className="flex gap-3">
          <Image
            src="/avatar/va.png"
            alt="Virtual Assistant"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full border border-green-100 bg-green-50 object-cover"
          />
          <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-lg ring-1 ring-green-100">
            Silahkan pilih pelayanan yang anda inginkan pada daftar di bawah ini.
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Menu Pertanyaan
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-start">
            {categories.map((cat) => {
              const isOpen = expanded === cat.key;
              return (
                <div
                  key={cat.key}
                  className={`transition-all duration-300 ${
                    isOpen ? "sm:col-span-2 md:col-span-3" : ""
                  }`}>
                  <div className="flex flex-col h-fit">
                    <button
                      onClick={() =>
                        setExpanded((prev) => (prev === cat.key ? null : cat.key))
                      }
                      className={`flex items-center justify-between w-full rounded-2xl px-4 py-3 text-xs font-semibold text-left transition-all ${
                        isOpen
                          ? "bg-green-600 text-white shadow"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}>
                      <span className="text-xs font-semibold whitespace-normal break-words leading-snug">
                        {cat.title}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 ml-2 transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-green-200 bg-slate-50 rounded-2xl p-4 mt-2 shadow-inner">
                          {cat.question.map((qa) => (
                            <button
                              key={qa.q}
                              onClick={() => onQuestionClick(qa.q, qa.a.join("<br />"))}
                              className="w-full text-left rounded-xl px-4 py-3 text-sm mb-2 bg-white text-slate-700 hover:bg-slate-100 transition">
                              {qa.q}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
