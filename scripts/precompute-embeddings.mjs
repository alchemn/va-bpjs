
import { pipeline } from "@xenova/transformers";
import { Stemmer, Tokenizer } from "sastrawijs";
import fs from "fs/promises";
import path from "path";

// This function must be kept in sync with the one in lib/localEmbbed.ts
function preprocessText(input, tokenizer, stemmer) {
  const text = input.toLowerCase().trim();
  const tokens = tokenizer.tokenize(text);
  const stemmed = tokens.map((token) => stemmer.stem(token));
  return stemmed.join(" ");
}

async function main() {
  console.log("Starting embedding pre-computation...");

  const customWords = ["online"];
  const stemmer = new Stemmer(customWords);
  const tokenizer = new Tokenizer();

  // 1. Load the model
  console.log("Loading feature-extraction model...");
  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  console.log("Model loaded.");

  // 2. Load the source context data
  const contextPath = path.join(process.cwd(), "public", "context.json");
  const contextFile = await fs.readFile(contextPath, "utf-8");
  const context = JSON.parse(contextFile);
  console.log("Loaded context.json data.");

  const embeddingsByCat = {};

  // 3. Generate embeddings for each question
  for (const [sectionName, section] of Object.entries(context)) {
    console.log(`Processing section: ${sectionName}...`);
    const all = [];
    for (const sub of Object.values(section)) {
      if (sub.questions && Array.isArray(sub.questions)) {
        all.push(...sub.questions);
      }
    }

    if (all.length === 0) {
      console.log(`No questions found in section: ${sectionName}. Skipping.`);
      continue;
    }

    const texts = all.map((x) => preprocessText(x.q, tokenizer, stemmer));

    const output = await embedder(texts, { pooling: "mean", normalize: true });

    embeddingsByCat[sectionName] = all.map((item, i) => ({
      q: item.q,
      a: item.a,
      vector: Array.from(output.data.slice(i * 384, (i + 1) * 384)),
    }));
    console.log(`Generated ${all.length} embeddings for ${sectionName}.`);
  }

  // 4. Save the pre-computed embeddings
  const outputPath = path.join(process.cwd(), "public", "embeddings.json");
  await fs.writeFile(
    outputPath,
    JSON.stringify(embeddingsByCat, null, 2),
    "utf-8"
  );

  console.log(`\n✅ Successfully pre-computed and saved embeddings to ${outputPath}`);
}

main().catch((err) => {
  console.error("Error during embedding pre-computation:", err);
  process.exit(1);
});
