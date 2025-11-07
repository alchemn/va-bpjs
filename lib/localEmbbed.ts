import { pipeline, FeatureExtractionPipeline, Tensor } from "@xenova/transformers";
import { Stemmer, Tokenizer } from "sastrawijs";
import fs from "fs/promises";
import path from "path";

// === Preprocessing setup ===
const customWords = ["online"];
const stemmer = new Stemmer(customWords);
const tokenizer = new Tokenizer();

let embedder: FeatureExtractionPipeline | null = null;
let embeddingsCache: Record<string, { q: string; a: string; vector: number[] }[]> | null = null;

// === Load embedding model (for user input only) ===
async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedder) {
    console.log("⏳ Loading MiniLM model for input processing...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Model loaded.");
  }
  return embedder;
}

// === Load pre-computed embeddings ===
async function loadPrecomputedEmbeddings() {
  if (embeddingsCache) return embeddingsCache;

  console.log("⏳ Loading pre-computed embeddings from filesystem...");
  const filePath = path.join(process.cwd(), "public", "embeddings.json");

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    embeddingsCache = JSON.parse(fileContent);
    console.log("✅ Pre-computed embeddings loaded and cached.");
    return embeddingsCache;
  } catch (error) {
    console.error("Error reading or parsing embeddings.json:", error);
    throw new Error("Failed to load or parse embeddings file from filesystem.");
  }
}

// === Helper functions ===
function normalizeVector(v: Tensor): number[] {
  if (!v) return [];
  if (Array.isArray(v)) {
    if (Array.isArray(v[0])) return v[0].flat();
    return v.flat();
  }
  if (v.data) return Array.from(v.data);
  if (typeof v.tolist === "function") return v.tolist().flat();
  console.warn("Warning: normalizeVector received unexpected object:", v);
  return [];
}

function cosineSimilarity(a: number[], b: number[]) {
  if (!a || !b || a.length !== b.length) return -1;
  const dot = a.reduce((s, ai, i) => s + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  const denominator = normA * normB;
  return denominator === 0 ? 0 : dot / denominator;
}

function preprocessText(input: string): string {
  const text = input.toLowerCase().trim();
  const tokens = tokenizer.tokenize(text);
  const stemmed = tokens.map((token) => stemmer.stem(token));
  return stemmed.join(" ");
}

// === MAIN FUNCTION ===
export async function findLocalMatch(input: string) {
  //  0. Pre-filter untuk input non-layanan
  const nonServiceWords = [
    "berak", "pup", "toilet", "kencing",
    "makan", "tidur", "mandi", "boker", "pipis"
  ];
  const lowered = input.toLowerCase();

  if (nonServiceWords.some(w => lowered.includes(w))) {
    return {
      q: input,
      a: "Wkwk... sepertinya itu urusan pribadi, bukan urusan BPJS 😄",
      score: 1.0
    };
  }

  // 🤝 1. Load model dan embeddings
  const [model, embeddingsByCat] = await Promise.all([
    getEmbedder(),
    loadPrecomputedEmbeddings(),
  ]);

  //  2. Preprocess & embed input user
  const text = preprocessText(input);
  console.log(`Stemmed query: "${text}"`);
  const inputEmbed = await model(text, { pooling: "mean", normalize: true });
  const inputVec = normalizeVector(inputEmbed);

  let best = { q: "", a: "", score: -1 };

  //  3. Cari kesamaan tertinggi di embeddings.json
  for (const category in embeddingsByCat) {
    const db = embeddingsByCat[category] ?? [];
    if (db.length === 0) continue;

    for (const item of db) {
      const score = cosineSimilarity(inputVec, item.vector);
      if (score > best.score) {
        best = { q: item.q, a: item.a, score };
      }
    }
  }

  //  4. Ambang batas
  const THRESHOLD = 0.6;
  if (best.score < THRESHOLD) {
    return {
      q: best.q,
      a: "Maaf, saya belum paham maksudnya 😅 Bisa dijelaskan lebih spesifik ya?",
      score: best.score,
    };
  }

  // 5. Return hasil terbaik
  return best;
}
