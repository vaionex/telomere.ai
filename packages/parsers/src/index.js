export { detectFormat } from './detect.js';
export { parse23andMe } from './twentythree.js';
export { parseAncestry } from './ancestry.js';
export { parseMyHeritage } from './myheritage.js';
export { parseVcf } from './vcf.js';

import { detectFormat } from './detect.js';
import { parse23andMe } from './twentythree.js';
import { parseAncestry } from './ancestry.js';
import { parseMyHeritage } from './myheritage.js';
import { parseVcf } from './vcf.js';

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
