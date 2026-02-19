#!/usr/bin/env node
/**
 * SNPedia Scraper — fetches clinically relevant SNPs from SNPedia's MediaWiki API
 * and merges them with our existing curated database.
 *
 * Usage:
 *   node scripts/scrape-snpedia.js --limit 500
 *   node scripts/scrape-snpedia.js --limit 100 --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '.snpedia-cache');
const DATA_FILE = path.join(__dirname, '..', 'packages', 'snp-db', 'src', 'data.js');

const API_BASE = 'https://bots.snpedia.com/api.php';
const RATE_LIMIT_MS = 1100; // >1s between requests

// Parse CLI args
const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) || 500 : 500;
const DRY_RUN = args.includes('--dry-run');

fs.mkdirSync(CACHE_DIR, { recursive: true });

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function cacheKey(page) {
  return path.join(CACHE_DIR, encodeURIComponent(page) + '.json');
}

async function fetchPage(pageName) {
  const cached = cacheKey(pageName);
  if (fs.existsSync(cached)) {
    try {
      return JSON.parse(fs.readFileSync(cached, 'utf8'));
    } catch { /* refetch */ }
  }

  await sleep(RATE_LIMIT_MS);
  const url = `${API_BASE}?action=parse&page=${encodeURIComponent(pageName)}&prop=wikitext&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error) return null;

  fs.writeFileSync(cached, JSON.stringify(data));
  return data;
}

async function fetchCategoryMembers(cmcontinue) {
  const cached = cacheKey(`_category_${cmcontinue || 'start'}`);
  if (fs.existsSync(cached)) {
    try {
      return JSON.parse(fs.readFileSync(cached, 'utf8'));
    } catch { /* refetch */ }
  }

  await sleep(RATE_LIMIT_MS);
  let url = `${API_BASE}?action=query&list=categorymembers&cmtitle=Category:Is_a_snp&cmlimit=500&format=json`;
  if (cmcontinue) url += `&cmcontinue=${encodeURIComponent(cmcontinue)}`;
  const res = await fetch(url);
  const data = await res.json();
  fs.writeFileSync(cached, JSON.stringify(data));
  return data;
}

function parseRsidTemplate(wikitext) {
  // Extract {{Rsid ... }} or {{rsid ... }}
  const match = wikitext.match(/\{\{[Rr]sid[\s\S]*?\}\}/);
  if (!match) return null;

  const block = match[0];
  const fields = {};
  const fieldRegex = /\|(\w+)\s*=\s*([^\n|}]*)/g;
  let m;
  while ((m = fieldRegex.exec(block))) {
    fields[m[1].toLowerCase()] = m[2].trim();
  }
  return fields;
}

function parseGenotypeTemplate(wikitext) {
  const match = wikitext.match(/\{\{[Gg]enotype[\s\S]*?\}\}/);
  if (!match) return null;

  const block = match[0];
  const fields = {};
  const fieldRegex = /\|(\w+)\s*=\s*([^\n|}]*)/g;
  let m;
  while ((m = fieldRegex.exec(block))) {
    fields[m[1].toLowerCase()] = m[2].trim();
  }
  return fields;
}

function inferCategories(gene, summary) {
  const cats = [];
  const text = `${gene} ${summary}`.toLowerCase();
  if (/mthfr|folat|b12|vitamin|iron|hfe|diet|fto|obes|nutri|caffein|lactos|choline|omega/i.test(text)) cats.push('nutrition');
  if (/cancer|brca|tumor|tp53|mutyh|lynch/i.test(text)) cats.push('health');
  if (/heart|cardio|cad|cholest|lipid|thrombo|factor.v|clot/i.test(text)) cats.push('health');
  if (/diabet|insulin|glucose/i.test(text)) cats.push('health');
  if (/alzheim|parkinson|neuro|brain|bdnf/i.test(text)) cats.push('health');
  if (/cyp|warfarin|statin|drug|pharma|metaboli/i.test(text)) cats.push('pharma');
  if (/eye.color|hair|skin|height|muscle|sleep|chrono|taste|empath/i.test(text)) cats.push('traits');
  if (/telomer|longev|aging|foxo|sirt/i.test(text)) cats.push('longevity');
  if (/cystic|sickle|carrier|tay.sach|hearing|spinal|pkü|pku|phenylketon/i.test(text)) cats.push('carrier');
  if (cats.length === 0) cats.push('health');
  return [...new Set(cats)];
}

async function main() {
  console.log(`SNPedia Scraper — fetching up to ${LIMIT} SNPs (magnitude >= 2)`);

  // Step 1: Collect SNP page titles
  console.log('Fetching SNP list from category...');
  const allSnpTitles = [];
  let cmcontinue = null;
  // Fetch enough pages — we need more than LIMIT since we'll filter by magnitude
  const maxPages = Math.max(LIMIT * 4, 4000);

  while (allSnpTitles.length < maxPages) {
    const data = await fetchCategoryMembers(cmcontinue);
    if (!data?.query?.categorymembers) break;
    for (const member of data.query.categorymembers) {
      allSnpTitles.push(member.title);
    }
    cmcontinue = data?.continue?.cmcontinue;
    if (!cmcontinue) break;
    console.log(`  ... ${allSnpTitles.length} SNP titles collected`);
  }
  console.log(`Collected ${allSnpTitles.length} SNP titles`);

  // Step 2: Fetch each SNP page and filter by magnitude
  console.log('Fetching individual SNP pages...');
  const snpEntries = [];
  let processed = 0;
  let skipped = 0;

  for (const title of allSnpTitles) {
    if (snpEntries.length >= LIMIT) break;

    // Only process Rs* pages
    if (!/^[Rr]s\d+$/.test(title)) {
      skipped++;
      continue;
    }

    processed++;
    if (processed % 50 === 0) {
      console.log(`  Processed ${processed}/${allSnpTitles.length}, found ${snpEntries.length} high-magnitude SNPs`);
    }

    const page = await fetchPage(title);
    if (!page?.parse?.wikitext?.['*']) continue;

    const wikitext = page.parse.wikitext['*'];
    const fields = parseRsidTemplate(wikitext);
    if (!fields) continue;

    const magnitude = parseFloat(fields.magnitude) || 0;
    if (magnitude < 2) continue;

    const rsid = title.toLowerCase().startsWith('rs') ? title.toLowerCase() : `rs${title.replace(/\D/g, '')}`;

    snpEntries.push({
      rsid,
      gene: fields.gene || '',
      chromosome: fields.chromosome || '',
      position: parseInt(fields.position) || 0,
      magnitude,
      summary: fields.summary || '',
      orientation: fields.stabilizedorientation || fields.orientation || '',
      pageTitle: title,
    });
  }

  console.log(`Found ${snpEntries.length} SNPs with magnitude >= 2`);

  // Sort by magnitude descending, take top LIMIT
  snpEntries.sort((a, b) => b.magnitude - a.magnitude);
  const topSnps = snpEntries.slice(0, LIMIT);

  // Step 3: Fetch genotype pages for each SNP
  console.log('Fetching genotype pages...');
  const bases = ['A', 'C', 'G', 'T'];
  const genotypePairs = [];
  for (let i = 0; i < bases.length; i++) {
    for (let j = i; j < bases.length; j++) {
      genotypePairs.push([bases[i], bases[j]]);
    }
  }

  for (let idx = 0; idx < topSnps.length; idx++) {
    const snp = topSnps[idx];
    if (idx % 20 === 0) console.log(`  Genotypes: ${idx}/${topSnps.length}`);

    snp.genotypes = {};
    const rsName = snp.pageTitle;

    for (const [a1, a2] of genotypePairs) {
      const genoPage = `${rsName}(${a1};${a2})`;
      const data = await fetchPage(genoPage);
      if (!data?.parse?.wikitext?.['*']) continue;

      const gFields = parseGenotypeTemplate(data.parse.wikitext['*']);
      if (!gFields) continue;

      const key = `${a1}${a2}`;
      snp.genotypes[key] = {
        magnitude: parseFloat(gFields.magnitude) || 0,
        repute: gFields.repute || '',
        summary: gFields.summary || '',
      };
    }
  }

  // Step 4: Load existing curated data
  console.log('Loading existing curated data...');
  let existingData = {};
  try {
    const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
    // Extract the object by evaluating (safe since it's our own file)
    const match = dataContent.match(/export const snpDatabase\s*=\s*(\{[\s\S]*\});?\s*$/);
    if (match) {
      // We'll just re-import it
    }
  } catch { /* no existing file */ }

  // Actually import the existing module
  try {
    const mod = await import(DATA_FILE);
    existingData = mod.snpDatabase || {};
    console.log(`Loaded ${Object.keys(existingData).length} existing curated SNPs`);
  } catch (e) {
    console.log('Could not load existing data, starting fresh:', e.message);
  }

  // Step 5: Merge
  console.log('Merging data...');
  const merged = { ...existingData };

  for (const snp of topSnps) {
    if (merged[snp.rsid]) {
      // Existing curated entry — add SNPedia genotypes if missing
      if (!merged[snp.rsid].genotypes && Object.keys(snp.genotypes).length > 0) {
        merged[snp.rsid].genotypes = snp.genotypes;
      }
      if (!merged[snp.rsid].magnitude) {
        merged[snp.rsid].magnitude = snp.magnitude;
      }
      continue;
    }

    // New entry from SNPedia
    merged[snp.rsid] = {
      rsid: snp.rsid,
      gene: snp.gene,
      chromosome: snp.chromosome,
      position: snp.position,
      categories: inferCategories(snp.gene, snp.summary),
      significance: snp.magnitude >= 4 ? 'well-established' : 'moderate',
      magnitude: snp.magnitude,
      riskAllele: '',
      normalAllele: '',
      trait: snp.summary || `${snp.gene} variant`,
      riskDescription: snp.summary || '',
      normalDescription: 'Common genotype',
      heterozygousDescription: '',
      populationFrequency: {},
      conditions: [],
      recommendations: [],
      references: [],
      ...(Object.keys(snp.genotypes).length > 0 ? { genotypes: snp.genotypes } : {}),
    };

    // Try to infer risk/normal alleles from genotype reputes
    const genoEntries = Object.entries(snp.genotypes);
    const badGeno = genoEntries.find(([, v]) => v.repute === 'bad');
    const goodGeno = genoEntries.find(([, v]) => v.repute === 'good');
    if (badGeno && goodGeno) {
      const badAlleles = badGeno[0].split('');
      const goodAlleles = goodGeno[0].split('');
      const risk = badAlleles.find(a => !goodAlleles.includes(a)) || badAlleles[0];
      const normal = goodAlleles.find(a => !badAlleles.includes(a)) || goodAlleles[0];
      merged[snp.rsid].riskAllele = risk;
      merged[snp.rsid].normalAllele = normal;
    }
  }

  console.log(`Total SNPs after merge: ${Object.keys(merged).length}`);

  if (DRY_RUN) {
    console.log('Dry run — not writing file');
    return;
  }

  // Step 6: Write output
  console.log('Writing data.js...');
  const output = `/**
 * SNP database — curated + SNPedia scraped data
 * Generated: ${new Date().toISOString()}
 * Sources: ClinVar, SNPedia, PharmGKB, GWAS Catalog
 * Curated entries: ${Object.keys(existingData).length}
 * SNPedia entries: ${topSnps.length}
 * Total: ${Object.keys(merged).length}
 */
export const snpDatabase = ${JSON.stringify(merged, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, output);
  console.log(`Written ${Object.keys(merged).length} SNPs to ${DATA_FILE}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
