export const extractionPrompt = `Extract only business ideas that are directly supported by the supplied source chunk.

Rules:
- Skip vague chunks.
- Do not invent market claims, revenue numbers, or customer pain.
- Prefer fewer high-quality ideas over many weak ideas.
- Attach evidence with chunkId and a short quote when legally acceptable.
- Return structured JSON only.`

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(extractionPrompt)
  console.log('Implement provider-specific structured generation after OPENAI_API_KEY or another AI SDK provider is configured.')
}
