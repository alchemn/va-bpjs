const replacements = [
  {
    find: "Klik Link ini",
    html: `<a href="https://meet.google.com/wvw-spoe-iij?pli=1" target="_blank"
            class="text-green-600 underline font-semibold">
            Klik Link ini</a>`,
  },
  {
    find: "Whatsuap",
    html: `<a href="https://wa.me/628118165165" target="_blank"
            class="inline-flex items-center gap-1 text-green-600 underline font-semibold">
            <img src="/image/wa.png" alt="Whatsapp" class="w-4 h-4" /> WhatsApp
          </a>`,
  },
  {
    find: "telepon",
    html: `<a href="tel:165" target="_blank" class="inline-flex items-center gap-1 text-green-600 underline font-semibold">
            <img src="/image/phon.png" alt="Phone" class="w-4 h-4" /> Telepon
          </a>`
  }
];

const replacePattern = new RegExp(
  replacements.map(r => r.find.replace(/[.*+?^${}()|[\\]/g, '\\$&')).join('|'),
  'gi'
);

const replaceMap = new Map(
  replacements.map(r => [r.find.toLowerCase(), r.html])
);

export const formatAnswerText = (items: string[]) => 
  items
    .map(item => {
      if (!item) return "";
      return item.replace(replacePattern, match => 
        replaceMap.get(match.toLowerCase()) || match
      );
    })
    .join("<br />");
