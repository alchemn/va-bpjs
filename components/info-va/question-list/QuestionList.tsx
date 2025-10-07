import { QuestionCard } from "../../QuestionCard";

interface QAItem {
  q: string;
  a: string;
}

interface QuestionListProps {
  category: string;
  section: "informasi" | "pengaduan" | "administrasi";
  questions: QAItem[];
}

export default function QuestionList({ category, section, questions }: QuestionListProps) {
  return (
    <div className="mt-6 space-y-3">
      {questions.map((item, index) => (
        <QuestionCard
          key={item.q}
          section={section}
          category={category}
          question={item.q}
          index={index + 1}
        />
      ))}
    </div>
  );
}
