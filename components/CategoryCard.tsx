import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function CategoryCard({
  icon: Icon,
  title,
  description,
  badge,
  onClick,
  disabled,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      className={`group relative w-full overflow-hidden rounded-2xl border transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
          : "border-transparent bg-white shadow-md hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      }`}
      disabled={disabled}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/0 via-sky-50/60 to-sky-100/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col gap-4 px-5 py-6 text-left">
        <div className="flex items-center justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              disabled ? "bg-slate-200 text-slate-400" : "bg-sky-100 text-sky-600"
            }`}
          >
            <Icon className="h-6 w-6" />
          </span>
          {badge && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                disabled ? "bg-slate-200 text-slate-500" : "bg-sky-100 text-sky-700"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-900">{title}</p>
          {description && (
            <p className="text-sm leading-relaxed text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
}
