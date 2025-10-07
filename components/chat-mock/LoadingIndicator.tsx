import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Virtual Assistant sedang mengetik...</span>
    </div>
  );
}
