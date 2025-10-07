interface Message {
  from: "user" | "bot";
  text: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-3xl p-6 shadow-md ring-1 ring-sky-100">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
              msg.from === "user"
                ? "bg-sky-600 text-white rounded-br-none"
                : "bg-white text-slate-700 ring-1 ring-sky-100 rounded-bl-none"
            } animate-[fadeIn_0.3s_ease]`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
