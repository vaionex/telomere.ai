import { derived } from 'svelte/store';
import { rawSnps } from './genetic-data.js';
import { matchSnps } from '@telomere/snp-db';
import { calculateAllPGS } from '@telomere/pgs';

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

export const pgsResults = derived(rawSnps, ($snps) => {
  if ($snps.size === 0) return [];
  return calculateAllPGS($snps);
});

export const categoryRiskSummary = derived(reportsByCategory, ($cats) => {
  const summary = {};
  for (const [cat, snps] of Object.entries($cats)) {
    const riskScores = snps.map(s => s.riskPercent || 0);
    const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    const highCount = snps.filter(s => s.riskLevel === 'high').length;
    const modCount = snps.filter(s => s.riskLevel === 'moderate').length;
    const carrierCount = snps.filter(s => s.riskLevel === 'carrier').length;
    summary[cat] = { avgRisk: Math.round(avgRisk), highCount, modCount, carrierCount, total: snps.length };
  }
  return summary;
});

export const categoryMeta = {
  health: { title: 'Health Risks', iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/><path d="M6 12h3l2-4l2 8l2-4h3"/></svg>', description: 'Cardiovascular, cancer, diabetes, and other health risk factors', color: 'accent-red' },
  longevity: { title: 'Longevity & Aging', iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', description: 'Telomere length, biological aging, and longevity-associated variants', color: 'accent-cyan' },
  nutrition: { title: 'Nutrigenomics', iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 2.5-1 6.5a7 7 0 0 1-5 10Z"/><path d="M10.7 10.5c2.6-.5 4.3-2.3 5.3-4"/></svg>', description: 'How your genes affect nutrient metabolism, dietary needs, and food sensitivities', color: 'accent-green' },
  pharma: { title: 'Pharmacogenomics', iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="2" width="15" height="8" rx="2"/><rect x="4.5" y="10" width="15" height="12" rx="2"/><line x1="12" y1="10" x2="12" y2="22"/></svg>', description: 'Drug metabolism and medication response predictions', color: 'accent-violet' },
  traits: { title: 'Physical Traits', iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>', description: 'Eye color, muscle type, sleep patterns, and other genetic traits', color: 'accent-blue' },
  carrier: { title: 'Carrier Status', iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v5a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V3z"/><path d="M12 11v4"/><path d="M8 15h8l1 6H7l1-6z"/></svg>', description: 'Recessive condition carrier screening for family planning', color: 'accent-amber' }
};
