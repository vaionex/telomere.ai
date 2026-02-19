import { snpDatabase } from './data.js';

/** Lookup a single SNP by rsid */
export function lookupSnp(rsid) {
  return snpDatabase[rsid] || null;
}

/** Get all SNPs in a category */
export function getByCategory(category) {
  return Object.values(snpDatabase).filter(s => s.categories.includes(category));
}

/** Get all SNPs for a gene */
export function getByGene(gene) {
  return Object.values(snpDatabase).filter(s => s.gene.toUpperCase() === gene.toUpperCase());
}

/** Get all SNPs on a chromosome */
export function getByChromosome(chr) {
  return Object.values(snpDatabase).filter(s => s.chromosome === String(chr));
}

/** Search SNPs by rsid or gene name */
export function searchSnps(query) {
  const q = query.toLowerCase();
  return Object.values(snpDatabase).filter(s =>
    s.rsid.toLowerCase().includes(q) ||
    s.gene.toLowerCase().includes(q) ||
    s.trait.toLowerCase().includes(q)
  );
}

/** Get all available categories */
export function getCategories() {
  const cats = new Set();
  Object.values(snpDatabase).forEach(s => s.categories.forEach(c => cats.add(c)));
  return [...cats];
}

/** Get all SNPs as array */
export function getAllSnps() {
  return Object.values(snpDatabase);
}

/** Match user's SNP map against database, returning enriched results */
export function matchSnps(userSnps) {
  const results = [];
  for (const [rsid, snpInfo] of Object.entries(snpDatabase)) {
    const userGenotype = userSnps.get(rsid);
    if (userGenotype) {
      const genotype = userGenotype.genotype || (userGenotype.allele1 + userGenotype.allele2);
      const riskLevel = assessRisk(snpInfo, genotype);
      results.push({
        ...snpInfo,
        userGenotype: genotype,
        userAllele1: userGenotype.allele1,
        userAllele2: userGenotype.allele2,
        riskLevel,
        riskPercent: riskLevel === 'high' ? 85 : riskLevel === 'moderate' ? 55 : riskLevel === 'low' ? 20 : 10
      });
    }
  }
  return results;
}

function assessRisk(snp, genotype) {
  const alleles = genotype.split('');
  const riskCount = alleles.filter(a => a === snp.riskAllele).length;
  if (riskCount === 2) return 'high';
  if (riskCount === 1) return 'moderate';
  return 'low';
}

export { snpDatabase } from './data.js';
