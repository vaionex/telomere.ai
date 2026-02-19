/**
 * Parse AncestryDNA raw data format
 * Format: TSV with columns: rsid, chromosome, position, allele1, allele2
 * Comment lines start with #
 */
export function parseAncestry(content) {
  const snps = new Map();
  const chromosomes = new Set();
  let buildVersion = null;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('#')) {
      const buildMatch = trimmed.match(/build\s*(\d+)/i);
      if (buildMatch) buildVersion = parseInt(buildMatch[1]);
      continue;
    }

    if (trimmed === '') continue;

    // Skip header
    if (trimmed.startsWith('rsid\t') || trimmed.toLowerCase().startsWith('rsid\t')) continue;

    const parts = trimmed.split('\t');
    if (parts.length < 5) continue;

    const [rsid, chromosome, position, allele1, allele2] = parts;

    if (!rsid.startsWith('rs') && !rsid.startsWith('i')) continue;

    // Skip no-calls
    if (allele1 === '0' && allele2 === '0') continue;

    const genotype = allele1 + allele2;
    chromosomes.add(chromosome);

    snps.set(rsid, {
      chromosome,
      position: parseInt(position),
      genotype,
      allele1,
      allele2
    });
  }

  return {
    format: 'ancestry',
    snps,
    metadata: {
      totalSnps: snps.size,
      chromosomeCount: chromosomes.size,
      buildVersion: buildVersion || 37
    }
  };
}
