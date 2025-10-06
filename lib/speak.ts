export async function speakTTS(text: string) {
  if (!text) return;

  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("TTS request failed");
  }

  // Dapatkan audio blob dari response
  const blob = await response.blob();
  const audio = new Audio(URL.createObjectURL(blob));
  audio.volume = 1; 

  return audio; 
}
