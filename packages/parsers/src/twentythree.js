/**
 * Parse 23andMe raw data format
 * Format: TSV with columns: rsid, chromosome, position, genotype
 * Comment lines start with #
 */
export function parse23andMe(content) {
  const snps = new Map();
  const chromosomes = new Set();
  let buildVersion = null;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Extract build version from comments
    if (trimmed.startsWith('#')) {
      const buildMatch = trimmed.match(/build\s*(\d+)/i);
      if (buildMatch) buildVersion = parseInt(buildMatch[1]);
      continue;
    }

    if (trimmed === '') continue;

    // Skip header line if present
    if (trimmed.startsWith('rsid\t') || trimmed.startsWith('rsid ')) continue;

    const parts = trimmed.split('\t');
    if (parts.length < 4) continue;

    const [rsid, chromosome, position, genotype] = parts;

    // Validate rsid format
    if (!rsid.startsWith('rs') && !rsid.startsWith('i')) continue;

    // Skip no-calls
    if (genotype === '--' || genotype === '00') continue;

    const allele1 = genotype.charAt(0);
    const allele2 = genotype.length > 1 ? genotype.charAt(1) : allele1;

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
    format: 'twentythree',
    snps,
    metadata: {
      totalSnps: snps.size,
      chromosomeCount: chromosomes.size,
      buildVersion: buildVersion || 37
    }
  };
}
