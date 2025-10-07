import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white px-4 py-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-sky-100">
            <div className="flex flex-col items-center gap-4 text-center text-slate-600">
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="h-6 w-64 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-80 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ChatClient />
    </Suspense>
  );
}