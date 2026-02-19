import { derived } from 'svelte/store';
import { rawSnps } from './genetic-data.js';
import { matchSnps } from '@telomere/snp-db';

export const matchedSnps = derived(rawSnps, ($snps) => {
  if ($snps.size === 0) return [];
  return matchSnps($snps);
});

export const reportsByCategory = derived(matchedSnps, ($matched) => {
  const cats = {};
  for (const snp of $matched) {
    for (const cat of snp.categories) {
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(snp);
    }
  }
  return cats;
});

export const topFindings = derived(matchedSnps, ($matched) => {
  return [...$matched]
    .sort((a, b) => b.riskPercent - a.riskPercent)
    .slice(0, 5);
});

export const categoryMeta = {
  health: { title: 'Health Risks', icon: '🏥', description: 'Cardiovascular, cancer, diabetes, and other health risk factors', color: 'accent-red' },
  longevity: { title: 'Longevity & Aging', icon: '🧬', description: 'Telomere length, biological aging, and longevity-associated variants', color: 'accent-cyan' },
  nutrition: { title: 'Nutrigenomics', icon: '🥗', description: 'How your genes affect nutrient metabolism, dietary needs, and food sensitivities', color: 'accent-green' },
  pharma: { title: 'Pharmacogenomics', icon: '💊', description: 'Drug metabolism and medication response predictions', color: 'accent-violet' },
  traits: { title: 'Physical Traits', icon: '👤', description: 'Eye color, muscle type, sleep patterns, and other genetic traits', color: 'accent-blue' },
  carrier: { title: 'Carrier Status', icon: '🧪', description: 'Recessive condition carrier screening for family planning', color: 'accent-amber' }
};
