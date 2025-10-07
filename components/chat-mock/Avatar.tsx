interface AvatarProps {
  isTalking: boolean;
}

export default function Avatar({ isTalking }: AvatarProps) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <video
        key={isTalking ? "talk" : "idle"}
        src={isTalking ? "/avatar/talk.webm" : "/avatar/idle.webm"}
        autoPlay
        loop
        muted
        playsInline
        className="w-52 h-auto rounded-3xl shadow-lg transition-all duration-500"
      />
    </div>
  );
}
