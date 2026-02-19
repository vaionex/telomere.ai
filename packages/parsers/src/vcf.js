/**
 * Parse VCF (Variant Call Format) 4.x files
 */
export function parseVcf(content) {
  const snps = new Map();
  const chromosomes = new Set();
  let buildVersion = null;

  const lines = content.split('\n');
  let sampleIndex = -1;

  for (const line of lines) {
    const trimmed = line.trim();

    // Meta-information lines
    if (trimmed.startsWith('##')) {
      const refMatch = trimmed.match(/##reference.*?(?:GRCh|hg)(\d+)/i);
      if (refMatch) buildVersion = parseInt(refMatch[1]);
      continue;
    }

    // Header line
    if (trimmed.startsWith('#CHROM')) {
      const headers = trimmed.split('\t');
      // Sample data starts at column 9 (0-indexed)
      sampleIndex = headers.length > 9 ? 9 : -1;
      continue;
    }

    if (trimmed === '') continue;

    const parts = trimmed.split('\t');
    if (parts.length < 8) continue;

    const chrom = parts[0].replace('chr', '');
    const pos = parts[1];
    const id = parts[2]; // rsID
    const ref = parts[3];
    const alt = parts[4];
    const filter = parts[6];

    // Skip filtered variants (optional: keep PASS and .)
    // We'll be permissive and include all

    // Parse genotype from sample column
    let allele1 = ref;
    let allele2 = ref;

    if (sampleIndex >= 0 && parts.length > sampleIndex) {
      const formatField = parts[8] || '';
      const sampleField = parts[sampleIndex] || '';
      const formatParts = formatField.split(':');
      const sampleParts = sampleField.split(':');

      const gtIndex = formatParts.indexOf('GT');
      if (gtIndex >= 0 && gtIndex < sampleParts.length) {
        const gt = sampleParts[gtIndex];
        const alleles = [ref, ...alt.split(',')];
        const gtParts = gt.split(/[/|]/);

        if (gtParts.length >= 1) {
          const idx1 = parseInt(gtParts[0]);
          if (!isNaN(idx1) && idx1 < alleles.length) allele1 = alleles[idx1];
        }
        if (gtParts.length >= 2) {
          const idx2 = parseInt(gtParts[1]);
          if (!isNaN(idx2) && idx2 < alleles.length) allele2 = alleles[idx2];
        }
      }
    }

    const genotype = allele1 + allele2;
    const rsid = id !== '.' ? id : `chr${chrom}:${pos}`;

    chromosomes.add(chrom);
    snps.set(rsid, {
      chromosome: chrom,
      position: parseInt(pos),
      genotype,
      allele1,
      allele2
    });
  }

  return {
    format: 'vcf',
    snps,
    metadata: {
      totalSnps: snps.size,
      chromosomeCount: chromosomes.size,
      buildVersion: buildVersion || 38
    }
  };
}
