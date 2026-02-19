import { batchAnnotate, annotateVariant } from '@telomere/annotations';

// Annotate a user's parsed SNPs against MyVariant.info
// Takes the parsed SNP Map from the parsers, returns enriched data
export async function annotateUserSnps(snpMap, onProgress) {
  const rsids = [...snpMap.keys()].filter(id => id.startsWith('rs'));
  const total = rsids.length;
  let processed = 0;

  // Process in batches of 1000
  const BATCH_SIZE = 1000;
  const annotations = new Map();

  for (let i = 0; i < rsids.length; i += BATCH_SIZE) {
    const batch = rsids.slice(i, i + BATCH_SIZE);
    const results = await batchAnnotate(batch);
    for (const [rsid, annotation] of results) {
      annotations.set(rsid, annotation);
    }
    processed += batch.length;
    onProgress?.({ processed, total, percent: Math.round((processed / total) * 100) });

    // Rate limit: 3 requests per second max
    if (i + BATCH_SIZE < rsids.length) {
      await new Promise(r => setTimeout(r, 350));
    }
  }

  return annotations;
}

// Get detailed annotation for a single SNP (for detail page)
export async function getDetailedAnnotation(rsid) {
  return annotateVariant(rsid);
}
