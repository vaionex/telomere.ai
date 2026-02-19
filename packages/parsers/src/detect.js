/**
 * Auto-detect genetic data file format from content
 */
export function detectFormat(content) {
  const lines = content.split('\n').slice(0, 50);

  for (const line of lines) {
    const trimmed = line.trim();

    // VCF: starts with ##fileformat=VCF
    if (trimmed.startsWith('##fileformat=VCF')) return 'vcf';

    // VCF: has #CHROM header
    if (trimmed.startsWith('#CHROM')) return 'vcf';

    // 23andMe: comment header with "23andMe" or typical format "# rsid\tchromosome\tposition\tgenotype"
    if (trimmed.includes('23andMe') || trimmed.includes('23andme')) return 'twentythree';

    // AncestryDNA: header line with "AncestryDNA"
    if (trimmed.includes('AncestryDNA')) return 'ancestry';

    // MyHeritage: header with "MyHeritage"
    if (trimmed.includes('MyHeritage')) return 'myheritage';
  }

  // Try detecting by data format
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed === '') continue;

    const tabs = trimmed.split('\t');
    const commas = trimmed.split(',');

    // 23andMe: 4 tab-separated columns (rsid, chr, pos, genotype)
    if (tabs.length === 4 && tabs[0].startsWith('rs')) return 'twentythree';

    // AncestryDNA: 5 tab-separated columns (rsid, chr, pos, allele1, allele2)
    if (tabs.length === 5 && tabs[0].startsWith('rs')) return 'ancestry';

    // MyHeritage CSV: comma-separated with similar structure
    if (commas.length >= 4 && commas[0].replace(/"/g, '').startsWith('rs')) return 'myheritage';

    break;
  }

  return null;
}
