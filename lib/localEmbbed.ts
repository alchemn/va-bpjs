import { pipeline, FeatureExtractionPipeline, Tensor } from "@xenova/transformers";
import { loadContext } from "@/lib/contextLoader";
import { Stemmer, Tokenizer } from "sastrawijs";

const customWords = ["online"];

const stemmer = new Stemmer(customWords);
const tokenizer = new Tokenizer();

let embedder: FeatureExtractionPipeline | null = null;

interface CachedItem {
  q: string;
  a: string;
  vector: number[];
}
const cache: Record<string, CachedItem[]> = {};


async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!embedder) {
    console.log("⏳ Loading MiniLM model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Model loaded.");
  }
  return embedder;
}

function normalizeVector(v: Tensor): number[] {
  if (!v) return [];

  if (Array.isArray(v)) {
    if (Array.isArray(v[0])) return v[0].flat();
    return v.flat();
  }

  if (v.data) return Array.from(v.data);
  if (typeof v.tolist === "function") return v.tolist().flat();
  
  console.warn("Warning: normalizeVector received an unexpected object:", v);
  return []; 
}


function cosineSimilarity(a: number[], b: number[]) {
  if (!a || !b || a.length === 0 || b.length === 0) return -1;

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

interface SubCategory {
    questions: { q: string; a: string }[];
}

export async function prepareLocalEmbeddings() {
  if (Object.keys(cache).length > 0) return cache;

  const context = loadContext();
  const model = await getEmbedder();

  for (const [sectionName, section] of Object.entries(context)) {
    const all: { q: string; a: string }[] = [];
    Object.values(section).forEach((sub) => {
      all.push(...(sub as SubCategory).questions);
    });

    const texts = all.map((x) => {
      const stemmed = preprocessText(x.q);
      console.log(`Stemmed question: "${stemmed}"`);
      return stemmed;
    });
    const output = await model(texts, { pooling: "mean", normalize: true });

    const vectors = await output.tolist();

    cache[sectionName] = all.map((item, i) => ({
      q: item.q,
      a: item.a,
      vector: vectors[i],
    }));
  }

  console.log("✅ Embeddings cached per category:", Object.keys(cache));
  return cache;
}


export async function findLocalMatch(input: string) {
  const model = await getEmbedder();
  const embeddingsByCat = await prepareLocalEmbeddings();

  // ✳️ tahap preprocessing
  const text = preprocessText(input);
  console.log(`Stemmed query: "${text}"`);

  const inputEmbed = await model(text, { pooling: "mean", normalize: true });
  const inputVec = normalizeVector(inputEmbed);

  let best = { q: "", a: "", score: -1 };

  for (const category in embeddingsByCat) {
    const db = embeddingsByCat[category] ?? [];
    if (db.length === 0) {
      console.warn("⚠️ No questions found for category:", category);
      continue;
    }

    for (const item of db) {
      const score = cosineSimilarity(inputVec, item.vector);
      if (score > best.score) best = { q: item.q, a: item.a, score };
    }
  }

  if (best.score < 0.5) {
    return {
      q: "",
      a: "Maaf, saya tidak mengerti maksud Anda. Bisakah Anda memberikan pertanyaan yang lebih spesifik?",
      score: 0,
    };
  }

  return best;
}