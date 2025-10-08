export async function playSentenceFromWords(text:string){
    const ctx = new AudioContext();
    const words = text
        .toLowerCase()
    .replace(/[.,!?]/g, "") // buang tanda baca
    .split(" ");

    let currentTime = ctx.currentTime;

    for (const word of words){
        try {
            const res = await fetch(`/sound/${word}.mp3`);
            const buf = await res.arrayBuffer();
            const audio = await ctx.decodeAudioData(buf);
            const src = ctx.createBufferSource();
            src.buffer = audio;
            src.connect(ctx.destination);
            src.start(currentTime);
            currentTime += audio.duration + 0.04;

        } catch {
            console.warn(`Audio untuk ${word} tidak ditemukan`)
        }
    }
}