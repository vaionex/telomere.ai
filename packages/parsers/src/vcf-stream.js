/**
 * Streaming VCF parser for large files (e.g., 30x Whole Genome Sequencing)
 * Processes 5-15GB VCF files without loading into memory
 */

/**
 * Parse a VCF line into a SNP entry
 * @param {string} line - Tab-separated VCF data line
 * @returns {object|null} Parsed SNP or null if unparseable
 */
function parseVcfLine(line) {
  const parts = line.split('\t');
  if (parts.length < 10) return null;

  const chrom = parts[0].replace('chr', '');
  const pos = parts[1];
  const id = parts[2];
  const ref = parts[3];
  const alt = parts[4];
  const formatField = parts[8] || '';
  const sampleField = parts[9] || '';

  let allele1 = ref;
  let allele2 = ref;

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
  } else {
    return null;
  }

  const genotype = allele1 + allele2;
  const rsid = id !== '.' ? id : `chr${chrom}:${pos}`;

  return {
    rsid,
    chromosome: chrom,
    position: parseInt(pos),
    genotype,
    allele1,
    allele2
  };
}

/**
 * Stream-parse a VCF file without loading it entirely into memory
 * @param {File} file - File object to parse
 * @param {object} options
 * @param {function} [options.onProgress] - Called every ~100k lines with (lineCount)
 * @param {Set} [options.snpFilter] - If provided, only retain variants whose rsid is in this set
 * @param {function} [options.onMatch] - Called immediately when a SNP match is found with (rsid, snpData)
 * @returns {Promise<{ format, snps: Map, metadata }>}
 */
export async function parseVcfStream(file, { onProgress, snpFilter, onMatch } = {}) {
  const isGzipped = file.name.endsWith('.gz') || file.name.endsWith('.bgz');
  let stream = file.stream();
  if (isGzipped) {
    stream = stream.pipeThrough(new DecompressionStream('gzip'));
  }

  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  const snps = new Map();
  const chromosomes = new Set();
  let buildVersion = null;
  let buffer = '';
  let lineCount = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete last line

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') continue;

      // Meta-information lines
      if (trimmed.startsWith('##')) {
        const refMatch = trimmed.match(/##reference.*?(?:GRCh|hg)(\d+)/i);
        if (refMatch) buildVersion = parseInt(refMatch[1]);
        continue;
      }

      // Header line
      if (trimmed.startsWith('#CHROM')) continue;

      lineCount++;
      if (lineCount % 100000 === 0 && onProgress) onProgress(lineCount);

      // If we have a filter, do a quick rsid check before full parse
      if (snpFilter) {
        const tabIdx1 = trimmed.indexOf('\t');
        const tabIdx2 = tabIdx1 > -1 ? trimmed.indexOf('\t', tabIdx1 + 1) : -1;
        const tabIdx3 = tabIdx2 > -1 ? trimmed.indexOf('\t', tabIdx2 + 1) : -1;
        if (tabIdx3 > -1) {
          const id = trimmed.substring(tabIdx2 + 1, tabIdx3);
          const chrom = trimmed.substring(0, tabIdx1).replace('chr', '');
          const pos = trimmed.substring(tabIdx1 + 1, tabIdx2);
          const rsid = id !== '.' ? id : `chr${chrom}:${pos}`;
          if (!snpFilter.has(rsid)) continue;
        }
      }

      const parsed = parseVcfLine(trimmed);
      if (!parsed) continue;

      chromosomes.add(parsed.chromosome);
      const snpData = {
        chromosome: parsed.chromosome,
        position: parsed.position,
        genotype: parsed.genotype,
        allele1: parsed.allele1,
        allele2: parsed.allele2
      };
      snps.set(parsed.rsid, snpData);
      if (onMatch) onMatch(parsed.rsid, snpData);
    }
  }

  // Process remaining buffer
  if (buffer.trim() && !buffer.startsWith('#')) {
    lineCount++;
    const parsed = parseVcfLine(buffer.trim());
    if (parsed) {
      if (!snpFilter || snpFilter.has(parsed.rsid)) {
        chromosomes.add(parsed.chromosome);
        const snpData = {
          chromosome: parsed.chromosome,
          position: parsed.position,
          genotype: parsed.genotype,
          allele1: parsed.allele1,
          allele2: parsed.allele2
        };
        snps.set(parsed.rsid, snpData);
        if (onMatch) onMatch(parsed.rsid, snpData);
      }
    }
  }

  if (onProgress) onProgress(lineCount);

  return {
    format: 'vcf',
    snps,
    metadata: {
      totalSnps: snps.size,
      chromosomeCount: chromosomes.size,
      buildVersion: buildVersion || 38,
      totalVariants: lineCount
    }
  };
}
