/**
 * @telomere/pgs — Polygenic Risk Score Calculator
 * 
 * All data is bundled locally. No external API calls at runtime.
 * Scoring files are pre-downloaded from PGS Catalog and included in the app.
 * 
 * To add new scoring files:
 *   1. Download from https://www.pgscatalog.org/
 *   2. Place TSV in packages/pgs/data/
 *   3. Import via parseScoringFile()
 */

/**
 * Parse a PGS Catalog scoring file (TSV with # header comments)
 * Columns: rsID, chr_name, chr_position, effect_allele, other_allele, effect_weight
 */
export function parseScoringFile(tsvContent) {
  const lines = tsvContent.split('\n');
  const variants = [];
  let headerParsed = false;
  let columns = [];

  for (const line of lines) {
    if (line.startsWith('#') || line.trim() === '') continue;
    if (!headerParsed) {
      columns = line.split('\t').map(c => c.trim().toLowerCase());
      headerParsed = true;
      continue;
    }
    const values = line.split('\t');
    if (values.length < columns.length) continue;

    const row = {};
    columns.forEach((col, i) => { row[col] = values[i]?.trim(); });

    const rsid = row.rsid || row.snp_id || row.variant_id;
    if (!rsid) continue;

    variants.push({
      rsid,
      chromosome: row.chr_name || row.hm_chr,
      position: parseInt(row.chr_position || row.hm_pos) || 0,
      effectAllele: row.effect_allele,
      otherAllele: row.other_allele || row.reference_allele,
      weight: parseFloat(row.effect_weight) || 0,
    });
  }
  return variants;
}

/**
 * Calculate a polygenic risk score given user SNPs and scoring variants
 * @param {Map} userSnps - Map<rsid, { genotype, allele1, allele2 }>
 * @param {Array} scoringVariants - Parsed scoring file variants
 * @returns {{ score, matched, total, coverage, percentile }}
 */
export function calculatePGS(userSnps, scoringVariants) {
  let score = 0;
  let matched = 0;

  for (const variant of scoringVariants) {
    const userSnp = userSnps.get(variant.rsid);
    if (!userSnp) continue;

    matched++;
    const genotype = userSnp.genotype || `${userSnp.allele1}${userSnp.allele2}`;
    const alleles = genotype.split('');
    const effectCount = alleles.filter(a => a === variant.effectAllele).length;
    score += effectCount * variant.weight;
  }

  return {
    score: Math.round(score * 10000) / 10000,
    matched,
    total: scoringVariants.length,
    coverage: scoringVariants.length > 0 ? parseFloat((matched / scoringVariants.length * 100).toFixed(1)) : 0,
  };
}

/**
 * Pre-curated list of well-validated PGS scores for common conditions
 */
export const COMMON_PGS = [
  { id: 'PGS000001', trait: 'Coronary artery disease', category: 'health' },
  { id: 'PGS000013', trait: 'Type 2 diabetes', category: 'health' },
  { id: 'PGS000018', trait: 'Breast cancer', category: 'health' },
  { id: 'PGS000039', trait: 'Body mass index', category: 'nutrition' },
  { id: 'PGS000058', trait: "Alzheimer's disease", category: 'longevity' },
  { id: 'PGS000073', trait: 'Prostate cancer', category: 'health' },
  { id: 'PGS000296', trait: 'Atrial fibrillation', category: 'health' },
  { id: 'PGS000328', trait: 'Schizophrenia', category: 'health' },
  { id: 'PGS000334', trait: 'Major depressive disorder', category: 'health' },
  { id: 'PGS000662', trait: 'Height', category: 'traits' },
];
