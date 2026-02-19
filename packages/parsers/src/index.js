export { detectFormat } from './detect.js';
export { parse23andMe } from './twentythree.js';
export { parseAncestry } from './ancestry.js';
export { parseMyHeritage } from './myheritage.js';
export { parseVcf } from './vcf.js';
export { parseVcfStream } from './vcf-stream.js';

import { detectFormat } from './detect.js';
import { parse23andMe } from './twentythree.js';
import { parseAncestry } from './ancestry.js';
import { parseMyHeritage } from './myheritage.js';
import { parseVcf } from './vcf.js';

/** Size threshold for streaming parser (50MB) */
const STREAM_THRESHOLD = 50 * 1024 * 1024;

/**
 * Detect format from file extension (for large files that shouldn't be read into memory)
 * @param {string} fileName
 * @returns {string|null}
 */
export function detectFormatByExtension(fileName) {
  const name = fileName.toLowerCase();
  if (name.endsWith('.vcf') || name.endsWith('.vcf.gz') || name.endsWith('.bgz')) return 'vcf';
  return null;
}

/**
 * Check if a file should use the streaming parser
 * @param {File} file
 * @returns {boolean}
 */
export function shouldUseStreaming(file) {
  if (file.size > STREAM_THRESHOLD) return true;
  const name = file.name.toLowerCase();
  if (name.endsWith('.vcf.gz') || name.endsWith('.bgz')) return true;
  return false;
}

/**
 * Auto-detect format and parse genetic data file
 * @param {string} content - Raw file content
 * @returns {{ format, snps, metadata }}
 */
export function parseGeneticFile(content) {
  const format = detectFormat(content);
  if (!format) throw new Error('Unable to detect file format. Supported: 23andMe, AncestryDNA, MyHeritage, VCF');

  switch (format) {
    case 'twentythree': return parse23andMe(content);
    case 'ancestry': return parseAncestry(content);
    case 'myheritage': return parseMyHeritage(content);
    case 'vcf': return parseVcf(content);
    default: throw new Error(`Unsupported format: ${format}`);
  }
}
