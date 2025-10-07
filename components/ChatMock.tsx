"use client";
import { useState, useEffect } from "react";
import ChatHeader from "./chat-mock/ChatHeader";
import MessageList from "./chat-mock/MessageList";
import LoadingIndicator from "./chat-mock/LoadingIndicator";
import Avatar from "./chat-mock/Avatar";

interface Message {
  from: "user" | "bot";
  text: string;
}

export default function ChatMock() {
  const [isTalking, setIsTalking] = useState(false);
  const [messages] = useState<Message[]>([
    { from: "user", text: "Bagaimana cara mendaftar di bpsj?" },
    { from: "bot", text: "Untuk mendaftar BPJS, silahkan buka aplikasi Mobile JKN atau Datang ke kantor BPJS terdekat" },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setIsTalking(true);
      setTimeout(() => setIsTalking(false), 5000);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white px-6 py-10">
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-6">
        <ChatHeader />
        <div className="flex flex-col gap-5 bg-white rounded-3xl p-6 shadow-md ring-1 ring-sky-100">
          <MessageList messages={messages} />
          {loading && <LoadingIndicator />}
        </div>
      </div>
      <Avatar isTalking={isTalking} />
    </div>
  );
}