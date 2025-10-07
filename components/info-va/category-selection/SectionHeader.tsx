import { Sparkles, LifeBuoy } from "lucide-react";

interface SectionHeaderProps {
  tagline: string;
  title: string;
  description: string;
  tips: string[];
}

export default function SectionHeader({ tagline, title, description, tips }: SectionHeaderProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-sky-100">
      <div className="grid gap-6 px-8 py-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
            <Sparkles className="h-4 w-4" />
            {tagline}
          </span>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {title}
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            {description}
          </p>
        </div>
        <div className="relative rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-white shadow-inner">
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),rgba(255,255,255,0))] opacity-80" />
          <div className="relative space-y-3">
            <p className="text-lg font-semibold">Tips cepat</p>
            <ul className="space-y-2 text-sm text-sky-50">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <LifeBuoy className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
