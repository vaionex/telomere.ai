/**
 * Parse MyHeritage CSV raw data format
 * Format: CSV with columns: RSID, CHROMOSOME, POSITION, RESULT
 * Or sometimes with quotes and varying delimiters
 */
export function parseMyHeritage(content) {
  const snps = new Map();
  const chromosomes = new Set();
  let buildVersion = null;

  const lines = content.split('\n');
  let headerParsed = false;
  let delimiter = ',';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('#') || trimmed.startsWith('\"#')) {
      const buildMatch = trimmed.match(/build\s*(\d+)/i);
      if (buildMatch) buildVersion = parseInt(buildMatch[1]);
      continue;
    }

    if (trimmed === '') continue;

    // Detect and skip header
    if (!headerParsed && (trimmed.toUpperCase().includes('RSID') || trimmed.toUpperCase().includes('SNP'))) {
      // Detect delimiter
      if (trimmed.includes('\t')) delimiter = '\t';
      else delimiter = ',';
      headerParsed = true;
      continue;
    }

    headerParsed = true;

    // Parse CSV, handling quoted fields
    const parts = trimmed.replace(/"/g, '').split(delimiter).map(s => s.trim());
    if (parts.length < 4) continue;

    const rsid = parts[0];
    const chromosome = parts[1];
    const position = parts[2];
    const genotype = parts[3];

    if (!rsid.startsWith('rs') && !rsid.startsWith('i')) continue;
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
    format: 'myheritage',
    snps,
    metadata: {
      totalSnps: snps.size,
      chromosomeCount: chromosomes.size,
      buildVersion: buildVersion || 37
    }
  };
}
