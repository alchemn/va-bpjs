"use client";
import { useEffect, useState, useRef } from "react";

interface TypingEffectProps {
  text: string;
  onFinished?: () => void;
}

export function TypingEffect({ text, onFinished }: TypingEffectProps) {
  const [typedText, setTypedText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!text) return;

    const currentAudio = audioRef.current;
    let isCancelled = false;
    let typingTimer: NodeJS.Timeout | null = null;

    const startTyping = () => {
      setTypedText("");
      let index = 0;
      typingTimer = setInterval(() => {
        if (isCancelled || index >= text.length) {
          if (typingTimer) clearInterval(typingTimer);
          if (onFinished) onFinished();
          return;
        }
        setTypedText((prev) => prev + text.charAt(index));
        index++;
      }, 30);
    };

    const playAndType = async () => {
      try {
        if ("speechSynthesis" in window) {
          const synth = window.speechSynthesis;
          const voices = synth.getVoices();

          const indoVoice =
            voices.find((v) => v.lang.startsWith("id")) ||
            voices.find((v) => v.lang.startsWith("en")) ||
            null;

          const sentences = text.split(/([.!?])\s+/);
          let idx = 0;

          synth.cancel();

          const speakNext = () => {
            if (idx >= sentences.length) return;
            const part = sentences[idx];
            if (!part.trim()) {
              idx++;
              return speakNext();
            }

            const utter = new SpeechSynthesisUtterance(part);
            utter.lang = indoVoice?.lang || "id-ID";
            utter.voice = indoVoice;
            utter.rate = 0.9;
            utter.pitch = 1.05;
            utter.volume = 1;

            utter.onend = () => {
              idx++;
              setTimeout(speakNext, 600 + Math.random() * 300);
            };

            synth.speak(utter);
          };

          if (voices.length === 0) {
            await new Promise((resolve) => {
              window.speechSynthesis.onvoiceschanged = resolve;
            });
          }

          setTimeout(() => speakNext(), 400);

          setTimeout(() => {
            if (!isCancelled) startTyping();
          }, 1200);
        } else {
          console.warn("Speech synthesis tidak tersedia di browser ini");
          startTyping();
        }
      } catch (error) {
        console.error("Speech Error", error);
        if (!isCancelled) startTyping();
      }
    };

    playAndType();

    return () => {
      isCancelled = true;
      if (typingTimer) clearInterval(typingTimer);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, onFinished]);

  return <p>{typedText}</p>;
}
