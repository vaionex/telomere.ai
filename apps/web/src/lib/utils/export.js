/**
 * Export utilities for genetic analysis results
 */

export function exportMatchedSnpsCsv(matchedSnps, genomeName) {
  const headers = ['rsID', 'Gene', 'Chromosome', 'Position', 'Your Genotype', 'Risk Allele', 'Risk Level', 'Trait', 'Category', 'Clinical Significance'];
  const rows = matchedSnps.map(snp => [
    snp.rsid, snp.gene, snp.chromosome, snp.position,
    snp.userGenotype, snp.riskAllele, snp.riskLevel,
    snp.trait, snp.categories.join('; '), snp.significance
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadFile(csv, `telomere-report-${genomeName || 'export'}.csv`, 'text/csv');
}

export function exportReport(matchedSnps, pgsResults, genomeName) {
  let text = `TELOMERE.AI GENETIC ANALYSIS REPORT\n`;
  text += `Generated: ${new Date().toISOString()}\n`;
  text += `Genome: ${genomeName || 'Unknown'}\n`;
  text += `${'='.repeat(60)}\n\n`;

  text += `SUMMARY\n${'-'.repeat(40)}\n`;
  text += `Total SNPs analyzed: ${matchedSnps.length}\n`;
  const high = matchedSnps.filter(s => s.riskLevel === 'high').length;
  const moderate = matchedSnps.filter(s => s.riskLevel === 'moderate').length;
  const carrier = matchedSnps.filter(s => s.riskLevel === 'carrier').length;
  text += `High risk variants: ${high}\n`;
  text += `Moderate risk variants: ${moderate}\n`;
  text += `Carrier variants: ${carrier}\n\n`;

  if (pgsResults?.length) {
    text += `POLYGENIC RISK SCORES\n${'-'.repeat(40)}\n`;
    for (const pgs of pgsResults) {
      text += `${pgs.trait}: ${pgs.percentile}th percentile (${pgs.variantsUsed}/${pgs.variantsTotal} variants)\n`;
    }
    text += '\n';
  }

  const cats = {};
  for (const snp of matchedSnps) {
    for (const cat of snp.categories) {
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(snp);
    }
  }
  for (const [cat, snps] of Object.entries(cats)) {
    text += `${cat.toUpperCase()}\n${'-'.repeat(40)}\n`;
    for (const snp of snps.sort((a, b) => (b.riskPercent || 0) - (a.riskPercent || 0))) {
      text += `  ${snp.rsid} (${snp.gene}) - ${snp.trait}\n`;
      text += `    Genotype: ${snp.userGenotype} | Risk: ${snp.riskLevel}\n`;
    }
    text += '\n';
  }

  text += `\nDisclaimer: This report is for educational and research purposes only.\n`;
  downloadFile(text, `telomere-report-${genomeName || 'export'}.txt`, 'text/plain');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
