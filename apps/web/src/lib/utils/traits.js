import { normalizeCondition } from './condition-merge.js';

/**
 * Build traits from matched SNPs by grouping on:
 * 1. Shared conditions (e.g., "Type 2 diabetes" links 10 SNPs)
 * 2. Same gene with related function (e.g., CYP2D6 variants → "Drug Metabolism via CYP2D6")
 * 3. Standalone SNPs become their own trait
 *
 * Conditions are normalized via condition-merge.js to avoid duplicates
 * like "Alzheimer disease" / "Alzheimer disease risk" / "Alzheimer's disease"
 */
export function buildTraits(matchedSnps) {
  const conditionMap = new Map();
  const usedSnps = new Set();

  for (const snp of matchedSnps) {
    for (const rawCondition of (snp.conditions || [])) {
      const condition = normalizeCondition(rawCondition);
      if (!conditionMap.has(condition)) conditionMap.set(condition, []);
      conditionMap.get(condition).push(snp);
    }
  }

  const traits = [];
  for (const [condition, snps] of conditionMap) {
    if (snps.length < 2) continue;
    const uniqueSnps = [...new Map(snps.map(s => [s.rsid, s])).values()];
    const riskLevels = uniqueSnps.map(s => s.riskPercent || 0);
    const avgRisk = riskLevels.reduce((a, b) => a + b, 0) / riskLevels.length;
    const highCount = uniqueSnps.filter(s => s.riskLevel === 'high').length;
    const modCount = uniqueSnps.filter(s => s.riskLevel === 'moderate').length;

    traits.push({
      id: slugify(condition),
      name: condition,
      type: 'condition',
      snps: uniqueSnps,
      snpCount: uniqueSnps.length,
      combinedRisk: Math.round(avgRisk + (highCount * 10) + (modCount * 5)),
      riskLevel: highCount > 0 ? 'high' : modCount > 0 ? 'moderate' : 'low',
      highCount,
      modCount,
      categories: [...new Set(uniqueSnps.flatMap(s => s.categories || []))],
      genes: [...new Set(uniqueSnps.map(s => s.gene))],
      description: getBestDescription(uniqueSnps),
    });
    uniqueSnps.forEach(s => usedSnps.add(s.rsid));
  }

  const geneMap = new Map();
  for (const snp of matchedSnps) {
    if (usedSnps.has(snp.rsid)) continue;
    if (!geneMap.has(snp.gene)) geneMap.set(snp.gene, []);
    geneMap.get(snp.gene).push(snp);
  }

  for (const [gene, snps] of geneMap) {
    if (snps.length < 2) continue;
    const riskLevels = snps.map(s => s.riskPercent || 0);
    const avgRisk = riskLevels.reduce((a, b) => a + b, 0) / riskLevels.length;
    const highCount = snps.filter(s => s.riskLevel === 'high').length;
    const modCount = snps.filter(s => s.riskLevel === 'moderate').length;

    traits.push({
      id: slugify(gene + '-variants'),
      name: gene + ' Variants',
      type: 'gene-group',
      snps,
      snpCount: snps.length,
      combinedRisk: Math.round(avgRisk + (highCount * 10) + (modCount * 5)),
      riskLevel: highCount > 0 ? 'high' : modCount > 0 ? 'moderate' : 'low',
      highCount,
      modCount,
      categories: [...new Set(snps.flatMap(s => s.categories || []))],
      genes: [gene],
      description: getBestDescription(snps),
    });
    snps.forEach(s => usedSnps.add(s.rsid));
  }

  for (const snp of matchedSnps) {
    if (usedSnps.has(snp.rsid)) continue;
    traits.push({
      id: snp.rsid,
      name: snp.trait,
      type: 'standalone',
      snps: [snp],
      snpCount: 1,
      combinedRisk: snp.riskPercent || 0,
      riskLevel: snp.riskLevel,
      highCount: snp.riskLevel === 'high' ? 1 : 0,
      modCount: snp.riskLevel === 'moderate' ? 1 : 0,
      categories: snp.categories || [],
      genes: [snp.gene],
      description: snp.riskLevel === 'high' ? snp.riskDescription :
                   snp.riskLevel === 'moderate' ? (snp.heterozygousDescription || snp.riskDescription) :
                   snp.normalDescription,
    });
  }

  return traits.sort((a, b) => b.combinedRisk - a.combinedRisk);
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getBestDescription(snps) {
  const sorted = [...snps].sort((a, b) => (b.riskPercent || 0) - (a.riskPercent || 0));
  const best = sorted[0];
  return best.riskLevel === 'high' ? best.riskDescription :
         best.riskLevel === 'moderate' ? (best.heterozygousDescription || best.riskDescription) :
         best.normalDescription;
}

export function filterTraitsByCategory(traits, category) {
  return traits.filter(t => t.categories.includes(category));
}

export function generateSummary(trait) {
  const { snps, name, highCount, modCount } = trait;
  const total = snps.length;
  const lowCount = total - highCount - modCount;

  let summary = `Based on ${total} genetic variant${total > 1 ? 's' : ''} across ${trait.genes.length} gene${trait.genes.length > 1 ? 's' : ''}`;

  if (highCount > 0) {
    summary += `, you show an elevated genetic predisposition for ${name.toLowerCase()}. `;
    summary += `${highCount} variant${highCount > 1 ? 's' : ''} ${highCount > 1 ? 'indicate' : 'indicates'} increased risk`;
    if (modCount > 0) summary += `, ${modCount} ${modCount > 1 ? 'are' : 'is'} moderate`;
    if (lowCount > 0) summary += `, and ${lowCount} ${lowCount > 1 ? 'are' : 'is'} typical`;
    summary += '.';
  } else if (modCount > 0) {
    summary += `, you show a slightly elevated predisposition for ${name.toLowerCase()}. `;
    summary += `${modCount} variant${modCount > 1 ? 's show' : ' shows'} moderate risk`;
    if (lowCount > 0) summary += ` and ${lowCount} ${lowCount > 1 ? 'are' : 'is'} typical`;
    summary += '.';
  } else {
    summary += `, your genetic risk for ${name.toLowerCase()} appears typical. `;
    summary += `All analyzed variants show normal results.`;
  }

  return summary;
}
