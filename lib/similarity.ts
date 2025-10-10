// Versi fuzzy: perbandingan tiap kata, bukan cuma set intersection
export function compareTwoStrings(a: string, b: string) {
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();

  if (a === b) return 1;

  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);

  let score = 0;

  for (const wordA of wordsA) {
    let best = 0;
    for (const wordB of wordsB) {
      const s = levenshteinSimilarity(wordA, wordB);
      if (s > best) best = s;
    }
    score += best;
  }

  return score / wordsA.length;
}

// hitung kemiripan antar dua kata pakai Levenshtein Distance
function levenshteinSimilarity(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(
              dp[i - 1][j - 1] + 1, // replace
              dp[i - 1][j] + 1, // delete
              dp[i][j - 1] + 1 // insert
            );
    }
  }

  const distance = dp[a.length][b.length];
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
}
