#!/usr/bin/env node
/**
 * SNPedia Scraper — fetches clinically relevant SNPs from SNPedia's MediaWiki API
 * and merges them with our existing curated database.
 *
 * Usage:
 *   node scripts/scrape-snpedia.js --limit 500
 *   node scripts/scrape-snpedia.js --limit 100 --dry-run
 *
 * Note: SNPedia uses Incapsula bot protection. If the API is blocked,
 * the script will fall back to generating an expanded database from
 * the built-in clinically significant SNP catalog.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '.snpedia-cache');
const DATA_FILE = path.join(__dirname, '..', 'packages', 'snp-db', 'src', 'data.js');

const API_BASE = 'https://bots.snpedia.com/api.php';
const RATE_LIMIT_MS = 1100;

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) || 500 : 500;
const DRY_RUN = args.includes('--dry-run');
const FORCE_FALLBACK = args.includes('--fallback');

fs.mkdirSync(CACHE_DIR, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function cacheKey(page) {
  return path.join(CACHE_DIR, encodeURIComponent(page) + '.json');
}

async function fetchPage(pageName) {
  const cached = cacheKey(pageName);
  if (fs.existsSync(cached)) {
    try { return JSON.parse(fs.readFileSync(cached, 'utf8')); } catch {}
  }
  await sleep(RATE_LIMIT_MS);
  const url = `${API_BASE}?action=parse&page=${encodeURIComponent(pageName)}&prop=wikitext&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  // Check for bot protection
  if (text.includes('Incapsula') || text.includes('<html')) return null;
  const data = JSON.parse(text);
  if (data.error) return null;
  fs.writeFileSync(cached, JSON.stringify(data));
  return data;
}

async function fetchCategoryMembers(cmcontinue) {
  const cached = cacheKey(`_category_${cmcontinue || 'start'}`);
  if (fs.existsSync(cached)) {
    try { return JSON.parse(fs.readFileSync(cached, 'utf8')); } catch {}
  }
  await sleep(RATE_LIMIT_MS);
  let url = `${API_BASE}?action=query&list=categorymembers&cmtitle=Category:Is_a_snp&cmlimit=500&format=json`;
  if (cmcontinue) url += `&cmcontinue=${encodeURIComponent(cmcontinue)}`;
  const res = await fetch(url);
  const text = await res.text();
  if (text.includes('Incapsula') || text.includes('<html')) return null;
  const data = JSON.parse(text);
  fs.writeFileSync(cached, JSON.stringify(data));
  return data;
}

function parseRsidTemplate(wikitext) {
  const match = wikitext.match(/\{\{[Rr]sid[\s\S]*?\}\}/);
  if (!match) return null;
  const fields = {};
  const re = /\|(\w+)\s*=\s*([^\n|}]*)/g;
  let m;
  while ((m = re.exec(match[0]))) fields[m[1].toLowerCase()] = m[2].trim();
  return fields;
}

function parseGenotypeTemplate(wikitext) {
  const match = wikitext.match(/\{\{[Gg]enotype[\s\S]*?\}\}/);
  if (!match) return null;
  const fields = {};
  const re = /\|(\w+)\s*=\s*([^\n|}]*)/g;
  let m;
  while ((m = re.exec(match[0]))) fields[m[1].toLowerCase()] = m[2].trim();
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
  if (/cystic|sickle|carrier|tay.sach|hearing|spinal|pku|phenylketon/i.test(text)) cats.push('carrier');
  if (cats.length === 0) cats.push('health');
  return [...new Set(cats)];
}

// ===== FALLBACK: Expanded clinically significant SNP catalog =====
// When SNPedia API is unavailable, use this curated expansion set
function getExpandedSnpCatalog() {
  return [
    // CARDIOVASCULAR
    { rsid: 'rs1801253', gene: 'ADRB1', chr: '10', pos: 115805056, mag: 2, summary: 'ADRB1 Arg389Gly — Beta-1 adrenergic receptor, heart rate response', cats: ['health', 'pharma'], risk: 'G', normal: 'C', conditions: ['Heart failure response', 'Beta-blocker sensitivity'], recs: ['Discuss beta-blocker dosing with physician'] },
    { rsid: 'rs5065', gene: 'NPPA', chr: '1', pos: 11905400, mag: 2, summary: 'NPPA — Atrial natriuretic peptide, blood pressure', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Hypertension risk'], recs: ['Monitor blood pressure regularly'] },
    { rsid: 'rs17228212', gene: 'SMAD3', chr: '15', pos: 67442596, mag: 2, summary: 'SMAD3 — Coronary artery disease risk', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Coronary artery disease'], recs: ['Cardiovascular risk management'] },
    { rsid: 'rs6922269', gene: 'MTHFD1L', chr: '6', pos: 151004770, mag: 2, summary: 'MTHFD1L — Coronary heart disease risk', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Coronary heart disease'], recs: ['Heart-healthy lifestyle'] },
    { rsid: 'rs2943634', gene: '2q36.3', chr: '2', pos: 227100698, mag: 2, summary: '2q36.3 — Coronary heart disease risk locus', cats: ['health'], risk: 'C', normal: 'A', conditions: ['Coronary heart disease'], recs: ['Regular cardiovascular screening'] },
    { rsid: 'rs12190287', gene: 'TCF21', chr: '6', pos: 134209837, mag: 2, summary: 'TCF21 — Coronary artery disease susceptibility', cats: ['health'], risk: 'C', normal: 'G', conditions: ['Coronary artery disease'], recs: ['Cardiovascular screening'] },
    { rsid: 'rs3798220', gene: 'LPA', chr: '6', pos: 160961137, mag: 4, summary: 'LPA — Elevated Lp(a), strong cardiovascular risk factor', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Elevated lipoprotein(a)', 'Coronary artery disease', 'Aortic valve stenosis'], recs: ['Measure Lp(a) levels', 'Consider PCSK9 inhibitors', 'Aggressive lipid management'] },
    { rsid: 'rs10455872', gene: 'LPA', chr: '6', pos: 161010118, mag: 4, summary: 'LPA — Elevated Lp(a), cardiovascular risk', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Elevated lipoprotein(a)', 'Heart disease risk'], recs: ['Lp(a) testing', 'Lipid management'] },
    { rsid: 'rs12413409', gene: 'CYP17A1', chr: '10', pos: 104719096, mag: 2, summary: 'CYP17A1 — Myocardial infarction risk', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Myocardial infarction'], recs: ['Cardiovascular risk monitoring'] },
    { rsid: 'rs1746048', gene: 'CXCL12', chr: '10', pos: 44060508, mag: 2, summary: 'CXCL12 — Coronary artery disease risk', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Coronary artery disease'], recs: ['Regular check-ups'] },

    // DIABETES & METABOLISM
    { rsid: 'rs1111875', gene: 'HHEX', chr: '10', pos: 94462882, mag: 2, summary: 'HHEX — Type 2 diabetes risk', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Type 2 diabetes'], recs: ['Blood glucose monitoring', 'Healthy diet'] },
    { rsid: 'rs13266634', gene: 'SLC30A8', chr: '8', pos: 118184783, mag: 2, summary: 'SLC30A8 — Type 2 diabetes, zinc transporter', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Type 2 diabetes', 'Insulin secretion'], recs: ['Zinc supplementation may help', 'Blood glucose monitoring'] },
    { rsid: 'rs10811661', gene: 'CDKN2A/B', chr: '9', pos: 22134094, mag: 2, summary: 'CDKN2A/B — Type 2 diabetes risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Type 2 diabetes'], recs: ['Regular glucose screening'] },
    { rsid: 'rs4402960', gene: 'IGF2BP2', chr: '3', pos: 185511687, mag: 2, summary: 'IGF2BP2 — Type 2 diabetes susceptibility', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Type 2 diabetes'], recs: ['Lifestyle modification'] },
    { rsid: 'rs5219', gene: 'KCNJ11', chr: '11', pos: 17409572, mag: 2, summary: 'KCNJ11 E23K — Type 2 diabetes, sulfonylurea response', cats: ['health', 'pharma'], risk: 'T', normal: 'C', conditions: ['Type 2 diabetes', 'Sulfonylurea drug response'], recs: ['Pharmacogenomic-guided diabetes management'] },
    { rsid: 'rs7756992', gene: 'CDKAL1', chr: '6', pos: 20679709, mag: 2, summary: 'CDKAL1 — Type 2 diabetes risk', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Type 2 diabetes'], recs: ['Regular glucose monitoring'] },
    { rsid: 'rs2237892', gene: 'KCNQ1', chr: '11', pos: 2839751, mag: 2, summary: 'KCNQ1 — Type 2 diabetes (East Asian)', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Type 2 diabetes'], recs: ['Glucose monitoring'] },
    { rsid: 'rs8050136', gene: 'FTO', chr: '16', pos: 53816275, mag: 2, summary: 'FTO — Obesity risk variant', cats: ['nutrition', 'health'], risk: 'A', normal: 'C', conditions: ['Obesity susceptibility'], recs: ['Portion control', 'Regular exercise'] },
    { rsid: 'rs1421085', gene: 'FTO', chr: '16', pos: 53800954, mag: 3, summary: 'FTO — Obesity, adipocyte thermogenesis', cats: ['nutrition', 'health'], risk: 'C', normal: 'T', conditions: ['Obesity', 'Reduced thermogenesis'], recs: ['Cold exposure therapy', 'Exercise', 'Caloric management'] },
    { rsid: 'rs17782313', gene: 'MC4R', chr: '18', pos: 60183864, mag: 2, summary: 'MC4R — Appetite regulation, obesity risk', cats: ['nutrition', 'health'], risk: 'C', normal: 'T', conditions: ['Increased appetite', 'Obesity risk'], recs: ['Mindful eating', 'Protein-rich diet'] },

    // CANCER RISK
    { rsid: 'rs1799950', gene: 'BRCA1', chr: '17', pos: 43091983, mag: 3, summary: 'BRCA1 Q356R — Breast cancer susceptibility', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Breast cancer risk'], recs: ['Genetic counseling', 'Enhanced screening'] },
    { rsid: 'rs3803662', gene: 'TOX3', chr: '16', pos: 52586341, mag: 2, summary: 'TOX3 — Breast cancer susceptibility locus', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Breast cancer risk'], recs: ['Regular mammography'] },
    { rsid: 'rs13281615', gene: '8q24', chr: '8', pos: 128413305, mag: 2, summary: '8q24 — Multiple cancer susceptibility locus', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Prostate cancer', 'Breast cancer', 'Colorectal cancer'], recs: ['Age-appropriate cancer screening'] },
    { rsid: 'rs6983267', gene: '8q24', chr: '8', pos: 128413305, mag: 2, summary: '8q24 — Colorectal and prostate cancer risk', cats: ['health'], risk: 'G', normal: 'T', conditions: ['Colorectal cancer', 'Prostate cancer'], recs: ['Colonoscopy screening', 'PSA monitoring'] },
    { rsid: 'rs1447295', gene: '8q24', chr: '8', pos: 128554220, mag: 2, summary: '8q24 — Prostate cancer risk', cats: ['health'], risk: 'A', normal: 'C', conditions: ['Prostate cancer'], recs: ['PSA screening discussion'] },
    { rsid: 'rs4242382', gene: '8q24', chr: '8', pos: 128535104, mag: 2, summary: '8q24 — Prostate cancer susceptibility', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Prostate cancer'], recs: ['Regular screening after 50'] },
    { rsid: 'rs10993994', gene: 'MSMB', chr: '10', pos: 51549496, mag: 2, summary: 'MSMB — Prostate cancer risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Prostate cancer'], recs: ['PSA monitoring'] },
    { rsid: 'rs401681', gene: 'TERT-CLPTM1L', chr: '5', pos: 1322087, mag: 2, summary: 'TERT-CLPTM1L — Multiple cancer susceptibility', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Lung cancer', 'Skin cancer', 'Bladder cancer'], recs: ['Avoid smoking', 'Sun protection'] },
    { rsid: 'rs2736098', gene: 'TERT', chr: '5', pos: 1294086, mag: 2, summary: 'TERT — Cancer susceptibility variant', cats: ['health', 'longevity'], risk: 'A', normal: 'G', conditions: ['Multiple cancer types'], recs: ['Regular screening'] },
    { rsid: 'rs4430796', gene: 'HNF1B', chr: '17', pos: 36098040, mag: 2, summary: 'HNF1B — Prostate cancer risk', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Prostate cancer'], recs: ['PSA screening'] },

    // ALZHEIMER'S & NEUROLOGICAL
    { rsid: 'rs744373', gene: 'BIN1', chr: '2', pos: 127894615, mag: 2, summary: 'BIN1 — Alzheimer disease risk', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Alzheimer disease'], recs: ['Cognitive health maintenance', 'Regular exercise'] },
    { rsid: 'rs3764650', gene: 'ABCA7', chr: '19', pos: 1046520, mag: 2, summary: 'ABCA7 — Alzheimer disease susceptibility', cats: ['health'], risk: 'G', normal: 'T', conditions: ['Alzheimer disease'], recs: ['Brain-healthy lifestyle'] },
    { rsid: 'rs3851179', gene: 'PICALM', chr: '11', pos: 85868640, mag: 2, summary: 'PICALM — Alzheimer disease susceptibility', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Alzheimer disease'], recs: ['Cognitive engagement', 'Cardiovascular health'] },
    { rsid: 'rs11136000', gene: 'CLU', chr: '8', pos: 27468862, mag: 2, summary: 'CLU (Clusterin) — Alzheimer disease risk', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Alzheimer disease'], recs: ['Neuroprotective lifestyle'] },
    { rsid: 'rs610932', gene: 'MS4A6A', chr: '11', pos: 60276106, mag: 2, summary: 'MS4A6A — Alzheimer disease susceptibility', cats: ['health'], risk: 'G', normal: 'T', conditions: ['Alzheimer disease'], recs: ['Brain health monitoring'] },
    { rsid: 'rs10498633', gene: 'SLC24A4', chr: '14', pos: 92926952, mag: 2, summary: 'SLC24A4 — Alzheimer disease risk', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Alzheimer disease'], recs: ['Cognitive assessment'] },
    { rsid: 'rs6656401', gene: 'CR1', chr: '1', pos: 207692049, mag: 2, summary: 'CR1 — Alzheimer disease susceptibility', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Alzheimer disease'], recs: ['Neuroprotective lifestyle'] },
    { rsid: 'rs3818361', gene: 'CR1', chr: '1', pos: 207692049, mag: 2, summary: 'CR1 — Alzheimer disease risk', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Alzheimer disease'], recs: ['Brain-healthy lifestyle'] },

    // AUTOIMMUNE & INFLAMMATORY
    { rsid: 'rs2476601', gene: 'PTPN22', chr: '1', pos: 114377568, mag: 3, summary: 'PTPN22 R620W — Autoimmune disease risk', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Type 1 diabetes', 'Rheumatoid arthritis', 'Lupus', 'Thyroid autoimmunity'], recs: ['Monitor for autoimmune symptoms', 'Regular thyroid function tests'] },
    { rsid: 'rs3135388', gene: 'HLA-DRB1', chr: '6', pos: 32681631, mag: 3, summary: 'HLA-DRB1*15:01 — Multiple sclerosis risk', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Multiple sclerosis'], recs: ['Vitamin D supplementation', 'Neurological monitoring'] },
    { rsid: 'rs2104286', gene: 'IL2RA', chr: '10', pos: 6099045, mag: 2, summary: 'IL2RA — Multiple sclerosis / Type 1 diabetes risk', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Multiple sclerosis', 'Type 1 diabetes'], recs: ['Autoimmune monitoring'] },
    { rsid: 'rs3087243', gene: 'CTLA4', chr: '2', pos: 204738919, mag: 2, summary: 'CTLA4 — Autoimmune disease susceptibility', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Type 1 diabetes', 'Graves disease', 'Autoimmune thyroiditis'], recs: ['Thyroid function monitoring'] },
    { rsid: 'rs6457620', gene: 'HLA-DRB1', chr: '6', pos: 32663851, mag: 3, summary: 'HLA-DRB1 — Rheumatoid arthritis risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Rheumatoid arthritis'], recs: ['Early treatment if symptomatic'] },
    { rsid: 'rs7574865', gene: 'STAT4', chr: '2', pos: 191964633, mag: 2, summary: 'STAT4 — Rheumatoid arthritis / Lupus risk', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Rheumatoid arthritis', 'Systemic lupus erythematosus'], recs: ['Autoimmune screening if symptomatic'] },
    { rsid: 'rs2542151', gene: 'PTPN2', chr: '18', pos: 12809340, mag: 2, summary: 'PTPN2 — Type 1 diabetes / Crohn disease risk', cats: ['health'], risk: 'G', normal: 'T', conditions: ['Type 1 diabetes', 'Crohn disease'], recs: ['Autoimmune awareness'] },
    { rsid: 'rs11209026', gene: 'IL23R', chr: '1', pos: 67705958, mag: 3, summary: 'IL23R R381Q — Protective against IBD', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Crohn disease (protective)', 'Ulcerative colitis (protective)'], recs: ['Protective variant for inflammatory bowel disease'] },
    { rsid: 'rs17234657', gene: 'NOD2', chr: '16', pos: 50745926, mag: 2, summary: 'NOD2 region — Crohn disease risk', cats: ['health'], risk: 'G', normal: 'T', conditions: ['Crohn disease'], recs: ['GI health monitoring'] },
    { rsid: 'rs2066844', gene: 'NOD2', chr: '16', pos: 50745926, mag: 3, summary: 'NOD2 R702W — Crohn disease risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Crohn disease'], recs: ['Gastroenterology consultation if symptomatic'] },
    { rsid: 'rs2066845', gene: 'NOD2', chr: '16', pos: 50756540, mag: 3, summary: 'NOD2 G908R — Crohn disease risk', cats: ['health'], risk: 'C', normal: 'G', conditions: ['Crohn disease'], recs: ['GI screening'] },
    { rsid: 'rs2066847', gene: 'NOD2', chr: '16', pos: 50763778, mag: 4, summary: 'NOD2 1007fs — Crohn disease, strongest NOD2 variant', cats: ['health'], risk: 'C', normal: '', conditions: ['Crohn disease'], recs: ['Gastroenterology referral if symptomatic'] },

    // PHARMACOGENOMICS (additional)
    { rsid: 'rs1142345', gene: 'TPMT', chr: '6', pos: 18130918, mag: 3, summary: 'TPMT*3C — Thiopurine drug toxicity', cats: ['pharma'], risk: 'G', normal: 'A', conditions: ['Thiopurine toxicity (azathioprine, 6-MP)'], recs: ['Dose reduction or alternative therapy', 'TPMT activity testing'] },
    { rsid: 'rs1800460', gene: 'TPMT', chr: '6', pos: 18143955, mag: 3, summary: 'TPMT*3B — Thiopurine sensitivity', cats: ['pharma'], risk: 'A', normal: 'G', conditions: ['Thiopurine toxicity'], recs: ['Pharmacogenomic-guided dosing'] },
    { rsid: 'rs1050828', gene: 'G6PD', chr: 'X', pos: 154535277, mag: 3, summary: 'G6PD A- — G6PD deficiency, drug-induced hemolysis', cats: ['pharma', 'health'], risk: 'T', normal: 'C', conditions: ['G6PD deficiency', 'Hemolytic anemia with certain drugs'], recs: ['Avoid primaquine, dapsone, rasburicase', 'Avoid fava beans'] },
    { rsid: 'rs1050829', gene: 'G6PD', chr: 'X', pos: 154536002, mag: 3, summary: 'G6PD — G6PD deficiency variant', cats: ['pharma', 'health'], risk: 'C', normal: 'T', conditions: ['G6PD deficiency'], recs: ['Drug avoidance list', 'Carry medical alert'] },
    { rsid: 'rs4149015', gene: 'SLCO1B1', chr: '12', pos: 21284127, mag: 2, summary: 'SLCO1B1 — Statin hepatic uptake', cats: ['pharma'], risk: 'G', normal: 'A', conditions: ['Statin metabolism variation'], recs: ['Monitor liver function on statins'] },
    { rsid: 'rs2279343', gene: 'CYP2B6', chr: '19', pos: 41515263, mag: 2, summary: 'CYP2B6 — Efavirenz/bupropion metabolism', cats: ['pharma'], risk: 'A', normal: 'G', conditions: ['Drug metabolism variation'], recs: ['Dose adjustments may be needed'] },
    { rsid: 'rs1799931', gene: 'NAT2', chr: '8', pos: 18258103, mag: 2, summary: 'NAT2 G590A — Slow acetylator variant', cats: ['pharma'], risk: 'A', normal: 'G', conditions: ['Slow acetylation', 'Drug toxicity risk'], recs: ['Isoniazid dose adjustment'] },
    { rsid: 'rs1801159', gene: 'DPYD', chr: '1', pos: 97915614, mag: 3, summary: 'DPYD — 5-FU/capecitabine toxicity risk', cats: ['pharma'], risk: 'T', normal: 'C', conditions: ['Fluoropyrimidine toxicity'], recs: ['Pre-treatment DPYD testing mandatory in many countries'] },
    { rsid: 'rs3918290', gene: 'DPYD', chr: '1', pos: 97915614, mag: 5, summary: 'DPYD*2A — Severe 5-FU toxicity, potentially fatal', cats: ['pharma'], risk: 'A', normal: 'G', conditions: ['Severe fluoropyrimidine toxicity', 'DPD deficiency'], recs: ['CONTRAINDICATED for 5-FU and capecitabine', 'Alternative chemotherapy required'] },
    { rsid: 'rs67376798', gene: 'DPYD', chr: '1', pos: 97981343, mag: 4, summary: 'DPYD D949V — Fluoropyrimidine toxicity', cats: ['pharma'], risk: 'A', normal: 'T', conditions: ['Fluoropyrimidine toxicity'], recs: ['Dose reduction required for 5-FU/capecitabine'] },
    { rsid: 'rs4149117', gene: 'SLCO1B3', chr: '12', pos: 21011680, mag: 2, summary: 'SLCO1B3 — Drug transporter variant', cats: ['pharma'], risk: 'G', normal: 'T', conditions: ['Altered drug transport'], recs: ['Relevant for statin and methotrexate dosing'] },

    // NUTRIGENOMICS (additional)
    { rsid: 'rs17602729', gene: 'AMPD1', chr: '1', pos: 115227804, mag: 2, summary: 'AMPD1 — Exercise capacity, AMP deaminase', cats: ['nutrition', 'traits'], risk: 'T', normal: 'C', conditions: ['Exercise intolerance', 'Muscle fatigue'], recs: ['Adjust exercise intensity', 'Adequate rest'] },
    { rsid: 'rs4343', gene: 'ACE', chr: '17', pos: 63488529, mag: 2, summary: 'ACE — Angiotensin converting enzyme activity', cats: ['health', 'traits'], risk: 'G', normal: 'A', conditions: ['Blood pressure variation', 'Athletic performance'], recs: ['Blood pressure monitoring'] },
    { rsid: 'rs7501331', gene: 'BCMO1', chr: '16', pos: 81272328, mag: 2, summary: 'BCMO1 — Beta-carotene conversion variant', cats: ['nutrition'], risk: 'T', normal: 'C', conditions: ['Poor beta-carotene converter'], recs: ['Pre-formed vitamin A supplementation'] },
    { rsid: 'rs2282679', gene: 'GC', chr: '4', pos: 72608383, mag: 2, summary: 'GC — Vitamin D levels', cats: ['nutrition'], risk: 'C', normal: 'A', conditions: ['Lower vitamin D levels'], recs: ['Vitamin D supplementation', 'Regular level monitoring'] },
    { rsid: 'rs10741657', gene: 'CYP2R1', chr: '11', pos: 14914878, mag: 2, summary: 'CYP2R1 — Vitamin D 25-hydroxylation', cats: ['nutrition'], risk: 'A', normal: 'G', conditions: ['Lower 25(OH)D levels'], recs: ['Higher vitamin D supplementation may be needed'] },
    { rsid: 'rs12785878', gene: 'DHCR7', chr: '11', pos: 71167449, mag: 2, summary: 'DHCR7 — Vitamin D synthesis from sunlight', cats: ['nutrition'], risk: 'T', normal: 'G', conditions: ['Reduced vitamin D synthesis'], recs: ['May need more sun exposure or supplementation'] },
    { rsid: 'rs855791', gene: 'TMPRSS6', chr: '22', pos: 37462936, mag: 2, summary: 'TMPRSS6 — Iron levels, hemoglobin', cats: ['nutrition', 'health'], risk: 'T', normal: 'C', conditions: ['Lower iron levels', 'Iron deficiency anemia risk'], recs: ['Monitor iron status', 'Iron-rich foods'] },
    { rsid: 'rs234706', gene: 'CBS', chr: '21', pos: 44485587, mag: 2, summary: 'CBS C699T — Homocysteine metabolism', cats: ['nutrition'], risk: 'A', normal: 'G', conditions: ['Altered homocysteine metabolism'], recs: ['B-vitamin supplementation', 'Homocysteine monitoring'] },
    { rsid: 'rs1801394', gene: 'MTRR', chr: '5', pos: 7870973, mag: 2, summary: 'MTRR A66G — Methionine synthase reductase', cats: ['nutrition'], risk: 'G', normal: 'A', conditions: ['Reduced B12 utilization', 'Homocysteine elevation'], recs: ['B12 supplementation', 'Methylcobalamin form preferred'] },
    { rsid: 'rs1805087', gene: 'MTR', chr: '1', pos: 237048500, mag: 2, summary: 'MTR A2756G — Methionine synthase', cats: ['nutrition'], risk: 'G', normal: 'A', conditions: ['Altered methionine metabolism'], recs: ['Adequate B12 and folate intake'] },
    { rsid: 'rs1801198', gene: 'TCN2', chr: '22', pos: 31011301, mag: 2, summary: 'TCN2 — Vitamin B12 transport', cats: ['nutrition'], risk: 'G', normal: 'C', conditions: ['Altered B12 transport'], recs: ['Monitor B12 levels'] },
    { rsid: 'rs4680', gene: 'COMT', chr: '22', pos: 19963748, mag: 3, summary: 'COMT Val158Met — Catechol metabolism', cats: ['pharma', 'traits'], risk: 'A', normal: 'G', conditions: ['Stress response', 'Pain sensitivity'], recs: ['Stress management'] },

    // TRAITS (additional)
    { rsid: 'rs4988235', gene: 'LCT', chr: '2', pos: 136608646, mag: 3, summary: 'LCT — Lactase persistence (European)', cats: ['nutrition', 'traits'], risk: 'G', normal: 'A', conditions: ['Lactose tolerance/intolerance'], recs: ['Dairy management based on genotype'] },
    { rsid: 'rs7495174', gene: 'OCA2', chr: '15', pos: 28344238, mag: 2, summary: 'OCA2 — Eye color determination', cats: ['traits'], risk: 'A', normal: 'G', conditions: ['Eye color'], recs: ['UV protection for light eyes'] },
    { rsid: 'rs12821256', gene: 'KITLG', chr: '12', pos: 89328335, mag: 2, summary: 'KITLG — Blond hair association', cats: ['traits'], risk: 'C', normal: 'T', conditions: ['Hair color'], recs: [] },
    { rsid: 'rs3827760', gene: 'EDAR', chr: '2', pos: 109513601, mag: 2, summary: 'EDAR V370A — Hair thickness, tooth shape (East Asian)', cats: ['traits'], risk: 'C', normal: 'T', conditions: ['Hair thickness', 'Tooth morphology', 'Sweat gland density'], recs: [] },
    { rsid: 'rs4481887', gene: 'OR6A2', chr: '11', pos: 7846472, mag: 2, summary: 'OR6A2 — Cilantro/coriander taste perception', cats: ['traits', 'nutrition'], risk: 'A', normal: 'G', conditions: ['Cilantro soapy taste perception'], recs: ['Avoid cilantro if you find it soapy, use alternatives'] },
    { rsid: 'rs2937573', gene: 'GNB3', chr: '12', pos: 6946829, mag: 2, summary: 'GNB3 — Obesity and hypertension risk', cats: ['health', 'traits'], risk: 'T', normal: 'C', conditions: ['Obesity tendency', 'Hypertension'], recs: ['Weight management', 'Blood pressure monitoring'] },
    { rsid: 'rs1800497', gene: 'ANKK1/DRD2', chr: '11', pos: 113400106, mag: 2, summary: 'DRD2 Taq1A — Dopamine receptor density', cats: ['traits'], risk: 'T', normal: 'C', conditions: ['Reward sensitivity', 'Addiction risk'], recs: ['Mindfulness', 'Dopamine-boosting activities'] },
    { rsid: 'rs4680', gene: 'COMT', chr: '22', pos: 19963748, mag: 3, summary: 'COMT Val158Met — Warrior vs Worrier', cats: ['traits', 'pharma'], risk: 'A', normal: 'G', conditions: ['Stress resilience variation'], recs: ['Adapt stress management to genotype'] },
    { rsid: 'rs28363170', gene: 'SLC6A3/DAT1', chr: '5', pos: 1393791, mag: 2, summary: 'DAT1 — Dopamine transporter, ADHD association', cats: ['traits'], risk: 'A', normal: 'G', conditions: ['ADHD susceptibility', 'Dopamine regulation'], recs: ['Structured routines', 'Regular exercise'] },
    { rsid: 'rs1800532', gene: 'TPH1', chr: '11', pos: 18026269, mag: 2, summary: 'TPH1 — Tryptophan hydroxylase, serotonin synthesis', cats: ['traits'], risk: 'A', normal: 'C', conditions: ['Mood regulation', 'Anxiety'], recs: ['Tryptophan-rich foods', 'Exercise'] },

    // LONGEVITY (additional)
    { rsid: 'rs1042714', gene: 'ADRB2', chr: '5', pos: 148206885, mag: 2, summary: 'ADRB2 Gln27Glu — Beta-2 adrenergic receptor', cats: ['longevity', 'health'], risk: 'G', normal: 'C', conditions: ['Obesity risk', 'Asthma response'], recs: ['Exercise', 'Beta-agonist response awareness'] },
    { rsid: 'rs1042713', gene: 'ADRB2', chr: '5', pos: 148206440, mag: 2, summary: 'ADRB2 Arg16Gly — Bronchodilator response', cats: ['health', 'pharma'], risk: 'G', normal: 'A', conditions: ['Asthma treatment response'], recs: ['Inform physician if using beta-agonists'] },
    { rsid: 'rs1800566', gene: 'NQO1', chr: '16', pos: 69711242, mag: 2, summary: 'NQO1 P187S — Detoxification enzyme', cats: ['longevity', 'health'], risk: 'T', normal: 'C', conditions: ['Reduced detoxification', 'Cancer susceptibility'], recs: ['Cruciferous vegetables', 'Antioxidants'] },
    { rsid: 'rs1801131', gene: 'MTHFR', chr: '1', pos: 11854476, mag: 2, summary: 'MTHFR A1298C — Methylation', cats: ['nutrition', 'health'], risk: 'G', normal: 'T', conditions: ['Reduced methylation'], recs: ['Methylfolate supplementation'] },
    { rsid: 'rs662', gene: 'PON1', chr: '7', pos: 95308134, mag: 2, summary: 'PON1 Q192R — Paraoxonase, organophosphate detox', cats: ['longevity', 'health'], risk: 'A', normal: 'G', conditions: ['Organophosphate sensitivity', 'Cardiovascular protection variation'], recs: ['Avoid pesticide exposure', 'Organic produce when possible'] },
    { rsid: 'rs854560', gene: 'PON1', chr: '7', pos: 95316772, mag: 2, summary: 'PON1 L55M — Paraoxonase activity', cats: ['longevity', 'health'], risk: 'A', normal: 'T', conditions: ['Reduced antioxidant enzyme activity'], recs: ['Antioxidant-rich diet'] },

    // MENTAL HEALTH
    { rsid: 'rs25531', gene: 'SLC6A4', chr: '17', pos: 30236002, mag: 3, summary: 'SLC6A4 5-HTTLPR — Serotonin transporter', cats: ['traits', 'health'], risk: 'T', normal: 'C', conditions: ['Depression susceptibility', 'SSRI response variation', 'Stress sensitivity'], recs: ['Consider SSRI response genotyping', 'Psychotherapy', 'Exercise'] },
    { rsid: 'rs6295', gene: 'HTR1A', chr: '5', pos: 63901748, mag: 2, summary: 'HTR1A — Serotonin 1A receptor, depression risk', cats: ['traits', 'health'], risk: 'G', normal: 'C', conditions: ['Depression risk', 'Anxiety', 'SSRI response'], recs: ['Mental health awareness', 'Regular exercise'] },
    { rsid: 'rs6313', gene: 'HTR2A', chr: '13', pos: 47471478, mag: 2, summary: 'HTR2A — Serotonin 2A receptor, antidepressant response', cats: ['traits', 'pharma'], risk: 'T', normal: 'C', conditions: ['Antidepressant response variation'], recs: ['Pharmacogenomic-guided prescribing'] },
    { rsid: 'rs1387923', gene: 'NTRK2', chr: '9', pos: 87283556, mag: 2, summary: 'NTRK2 — BDNF receptor, depression/anxiety', cats: ['traits', 'health'], risk: 'T', normal: 'C', conditions: ['Depression susceptibility'], recs: ['Exercise (boosts BDNF signaling)', 'Mental health monitoring'] },
    { rsid: 'rs4570625', gene: 'TPH2', chr: '12', pos: 72332381, mag: 2, summary: 'TPH2 — Brain serotonin synthesis', cats: ['traits'], risk: 'T', normal: 'G', conditions: ['Mood regulation'], recs: ['Tryptophan-rich diet', 'Sunlight exposure'] },

    // SLEEP & CIRCADIAN
    { rsid: 'rs1801260', gene: 'CLOCK', chr: '4', pos: 56294068, mag: 2, summary: 'CLOCK 3111T/C — Circadian rhythm, evening preference', cats: ['traits'], risk: 'C', normal: 'T', conditions: ['Evening chronotype', 'Delayed sleep phase'], recs: ['Morning light exposure', 'Consistent sleep schedule'] },
    { rsid: 'rs57875989', gene: 'DEC2/BHLHE41', chr: '12', pos: 26124973, mag: 4, summary: 'DEC2 P385R — Short sleeper gene', cats: ['traits'], risk: 'G', normal: 'A', conditions: ['Natural short sleeper (6h sufficient)'], recs: ['Rare variant — if you naturally feel rested on less sleep'] },
    { rsid: 'rs73598374', gene: 'ADA', chr: '20', pos: 44619522, mag: 2, summary: 'ADA — Adenosine deaminase, deep sleep', cats: ['traits'], risk: 'T', normal: 'C', conditions: ['Deeper slow-wave sleep', 'Caffeine sensitivity'], recs: ['Leverage good sleep quality', 'Limit caffeine if sensitive'] },

    // SKIN & AGING
    { rsid: 'rs1805005', gene: 'MC1R', chr: '16', pos: 89985844, mag: 2, summary: 'MC1R V60L — Skin pigmentation, sun sensitivity', cats: ['traits'], risk: 'T', normal: 'G', conditions: ['Fair skin tendency', 'Sun sensitivity'], recs: ['Sun protection'] },
    { rsid: 'rs2228479', gene: 'MC1R', chr: '16', pos: 89986091, mag: 2, summary: 'MC1R V92M — Red hair/fair skin variant', cats: ['traits'], risk: 'A', normal: 'G', conditions: ['Fair skin', 'Sun sensitivity'], recs: ['SPF 30+ sunscreen'] },
    { rsid: 'rs16891982', gene: 'SLC45A2', chr: '5', pos: 33951693, mag: 2, summary: 'SLC45A2 — Skin pigmentation', cats: ['traits'], risk: 'G', normal: 'C', conditions: ['Lighter skin pigmentation'], recs: ['Sun protection'] },
    { rsid: 'rs1426654', gene: 'SLC24A5', chr: '15', pos: 48426484, mag: 3, summary: 'SLC24A5 A111T — Major skin color determinant', cats: ['traits'], risk: 'A', normal: 'G', conditions: ['Skin pigmentation (light vs dark)'], recs: ['Appropriate sun protection for skin type'] },

    // IMMUNE FUNCTION
    { rsid: 'rs12979860', gene: 'IFNL3/IL28B', chr: '19', pos: 39738787, mag: 3, summary: 'IL28B — Hepatitis C treatment response', cats: ['pharma', 'health'], risk: 'T', normal: 'C', conditions: ['Hepatitis C treatment response'], recs: ['CC genotype: best response to interferon therapy'] },
    { rsid: 'rs8099917', gene: 'IFNL3/IL28B', chr: '19', pos: 39743165, mag: 3, summary: 'IL28B — Hepatitis C spontaneous clearance', cats: ['pharma', 'health'], risk: 'G', normal: 'T', conditions: ['Hepatitis C clearance'], recs: ['Relevant for HCV treatment decisions'] },

    // BONE HEALTH
    { rsid: 'rs3736228', gene: 'LRP5', chr: '11', pos: 68174290, mag: 2, summary: 'LRP5 — Bone mineral density', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Osteoporosis risk', 'Lower bone density'], recs: ['Weight-bearing exercise', 'Calcium and vitamin D', 'DEXA screening'] },
    { rsid: 'rs2306033', gene: 'LRP5', chr: '11', pos: 68174290, mag: 2, summary: 'LRP5 — Bone density variation', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Bone mineral density variation'], recs: ['Bone health monitoring'] },
    { rsid: 'rs9594759', gene: 'RANKL/TNFSF11', chr: '13', pos: 43173329, mag: 2, summary: 'RANKL — Bone turnover, osteoporosis risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Osteoporosis risk'], recs: ['Regular bone density screening after 50'] },

    // KIDNEY & URIC ACID
    { rsid: 'rs2231142', gene: 'ABCG2', chr: '4', pos: 89052323, mag: 3, summary: 'ABCG2 Q141K — Uric acid levels, gout risk', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Elevated uric acid', 'Gout risk'], recs: ['Limit purine-rich foods', 'Stay hydrated', 'Monitor uric acid levels'] },
    { rsid: 'rs1014290', gene: 'SLC2A9', chr: '4', pos: 9922166, mag: 2, summary: 'SLC2A9 — Uric acid levels', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Uric acid variation'], recs: ['Monitor uric acid if symptomatic'] },

    // VISION
    { rsid: 'rs10490924', gene: 'ARMS2', chr: '10', pos: 124214448, mag: 3, summary: 'ARMS2 A69S — Age-related macular degeneration', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Age-related macular degeneration'], recs: ['Regular eye exams', 'Lutein/zeaxanthin supplementation', 'Don\'t smoke'] },
    { rsid: 'rs1061170', gene: 'CFH', chr: '1', pos: 196659237, mag: 3, summary: 'CFH Y402H — Age-related macular degeneration', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Age-related macular degeneration'], recs: ['Regular eye exams after 50', 'AREDS2 formula supplements', 'UV-blocking sunglasses'] },

    // HEARING
    { rsid: 'rs7598759', gene: 'GRM7', chr: '3', pos: 7554775, mag: 2, summary: 'GRM7 — Age-related hearing loss susceptibility', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Age-related hearing loss'], recs: ['Hearing protection', 'Regular audiometry'] },

    // DENTAL
    { rsid: 'rs2274327', gene: 'AMELX', chr: 'X', pos: 11311489, mag: 2, summary: 'Enamel formation variant', cats: ['traits'], risk: 'T', normal: 'C', conditions: ['Dental enamel variation'], recs: ['Regular dental care'] },

    // ADDITIONAL WELL-KNOWN SNPS
    { rsid: 'rs1800012', gene: 'COL1A1', chr: '17', pos: 50200388, mag: 2, summary: 'COL1A1 Sp1 — Osteoporosis, collagen quality', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Osteoporosis risk', 'Fracture susceptibility'], recs: ['Weight-bearing exercise', 'Calcium/vitamin D supplementation'] },
    { rsid: 'rs1801275', gene: 'IL4R', chr: '16', pos: 27374182, mag: 2, summary: 'IL4R Q576R — Allergic disease risk', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Asthma', 'Allergic diseases'], recs: ['Allergy management'] },
    { rsid: 'rs601338', gene: 'FUT2', chr: '19', pos: 49206674, mag: 3, summary: 'FUT2 — Secretor status, norovirus resistance', cats: ['health', 'nutrition'], risk: 'A', normal: 'G', conditions: ['Non-secretor: norovirus resistance', 'Altered gut microbiome', 'Lower B12 levels'], recs: ['B12 monitoring if non-secretor', 'Generally protective against norovirus'] },
    { rsid: 'rs2243250', gene: 'IL4', chr: '5', pos: 132037036, mag: 2, summary: 'IL-4 -590C/T — Allergic disease risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Asthma', 'Allergic rhinitis', 'Atopic dermatitis'], recs: ['Allergy awareness and management'] },
    { rsid: 'rs1800871', gene: 'IL10', chr: '1', pos: 206773289, mag: 2, summary: 'IL-10 -819C/T — Anti-inflammatory variation', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Inflammatory response variation'], recs: ['Anti-inflammatory lifestyle'] },
    { rsid: 'rs1800872', gene: 'IL10', chr: '1', pos: 206773062, mag: 2, summary: 'IL-10 -592C/A — Inflammation modulation', cats: ['health'], risk: 'A', normal: 'C', conditions: ['Inflammatory disease susceptibility'], recs: ['Anti-inflammatory diet'] },

    // CLOTTING & HEMOSTASIS
    { rsid: 'rs1799889', gene: 'SERPINE1', chr: '7', pos: 101150318, mag: 2, summary: 'PAI-1 4G/5G — Thrombosis risk', cats: ['health'], risk: '4G', normal: '5G', conditions: ['Venous thrombosis risk', 'Myocardial infarction'], recs: ['Avoid prolonged immobility', 'Consider compression stockings for travel'] },
    { rsid: 'rs5918', gene: 'ITGB3', chr: '17', pos: 47253587, mag: 2, summary: 'GPIIIa PlA1/PlA2 — Platelet aggregation', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Increased platelet aggregation', 'Aspirin resistance risk'], recs: ['Discuss antiplatelet therapy with physician'] },

    // ADDITIONAL CARRIER STATUS
    { rsid: 'rs5030858', gene: 'GAA', chr: '17', pos: 80101543, mag: 3, summary: 'GAA — Pompe disease carrier', cats: ['carrier'], risk: 'T', normal: 'C', conditions: ['Pompe disease (homozygous)', 'Carrier status'], recs: ['Genetic counseling', 'Partner testing'] },
    { rsid: 'rs28940579', gene: 'HEXA', chr: '15', pos: 72638892, mag: 3, summary: 'HEXA — Tay-Sachs variant', cats: ['carrier'], risk: 'A', normal: 'G', conditions: ['Tay-Sachs carrier'], recs: ['Genetic counseling', 'Carrier screening for partner'] },
    { rsid: 'rs121908769', gene: 'ACADM', chr: '1', pos: 76227031, mag: 3, summary: 'ACADM K329E — MCAD deficiency carrier', cats: ['carrier'], risk: 'A', normal: 'G', conditions: ['MCAD deficiency (homozygous)', 'Carrier status'], recs: ['Newborn screening', 'Avoid fasting in affected individuals'] },

    // ADDITIONAL METABOLIC
    { rsid: 'rs7305115', gene: 'GAD1', chr: '2', pos: 171400766, mag: 2, summary: 'GAD1 — GABA synthesis, anxiety', cats: ['traits'], risk: 'A', normal: 'G', conditions: ['Anxiety tendency', 'GABA levels'], recs: ['Stress management', 'GABA-supporting nutrients'] },
    { rsid: 'rs165599', gene: 'COMT', chr: '22', pos: 19956781, mag: 2, summary: 'COMT 3\' UTR — Catechol metabolism regulation', cats: ['traits', 'pharma'], risk: 'A', normal: 'G', conditions: ['Dopamine/norepinephrine metabolism'], recs: ['Stress management'] },
    { rsid: 'rs2075650', gene: 'TOMM40', chr: '19', pos: 44892009, mag: 3, summary: 'TOMM40 — Alzheimer disease / longevity', cats: ['health', 'longevity'], risk: 'G', normal: 'A', conditions: ['Alzheimer disease risk', 'Longevity association'], recs: ['Brain health maintenance', 'Regular cognitive assessment'] },
    { rsid: 'rs769449', gene: 'APOE', chr: '19', pos: 44905579, mag: 2, summary: 'APOE region — Alzheimer and lipid metabolism', cats: ['health', 'longevity'], risk: 'A', normal: 'G', conditions: ['Alzheimer risk', 'Lipid metabolism'], recs: ['Mediterranean diet', 'Exercise'] },
    { rsid: 'rs405509', gene: 'APOE', chr: '19', pos: 44905750, mag: 2, summary: 'APOE promoter — Gene expression variation', cats: ['health', 'longevity'], risk: 'T', normal: 'G', conditions: ['APOE expression variation'], recs: ['Brain-healthy lifestyle'] },

    // ADDITIONAL PHARMACOGENOMICS
    { rsid: 'rs2032583', gene: 'ABCB1', chr: '7', pos: 87550285, mag: 2, summary: 'ABCB1 — Drug efflux transporter', cats: ['pharma'], risk: 'T', normal: 'C', conditions: ['Drug resistance variation'], recs: ['Relevant for chemotherapy response'] },
    { rsid: 'rs4986913', gene: 'CYP2C19', chr: '10', pos: 96612495, mag: 2, summary: 'CYP2C19*5 — Non-functional allele', cats: ['pharma'], risk: 'T', normal: 'C', conditions: ['CYP2C19 poor metabolizer'], recs: ['Pharmacogenomic card'] },
    { rsid: 'rs28399499', gene: 'CYP2D6', chr: '22', pos: 42522613, mag: 2, summary: 'CYP2D6*17 — Reduced function (African)', cats: ['pharma'], risk: 'T', normal: 'C', conditions: ['Reduced CYP2D6 metabolism'], recs: ['Dose adjustments may be needed'] },
    { rsid: 'rs16947', gene: 'CYP2D6', chr: '22', pos: 42523943, mag: 2, summary: 'CYP2D6*2 — Normal/increased function', cats: ['pharma'], risk: 'A', normal: 'G', conditions: ['CYP2D6 metabolism variation'], recs: ['Standard dosing usually appropriate'] },
    { rsid: 'rs5030867', gene: 'CYP2D6', chr: '22', pos: 42525772, mag: 3, summary: 'CYP2D6*6 — Non-functional allele', cats: ['pharma'], risk: 'T', normal: 'C', conditions: ['CYP2D6 poor metabolizer'], recs: ['Alternative medications for CYP2D6 substrates'] },
    { rsid: 'rs28371706', gene: 'CYP2D6', chr: '22', pos: 42524947, mag: 2, summary: 'CYP2D6*9 — Reduced function', cats: ['pharma'], risk: 'T', normal: 'C', conditions: ['Intermediate CYP2D6 metabolism'], recs: ['Consider dose modifications'] },

    // ADDITIONAL EXERCISE/PERFORMANCE
    { rsid: 'rs8192678', gene: 'PPARGC1A', chr: '4', pos: 23815924, mag: 2, summary: 'PGC-1α Gly482Ser — Mitochondrial biogenesis, endurance', cats: ['traits', 'longevity'], risk: 'A', normal: 'G', conditions: ['Endurance capacity variation', 'Mitochondrial function'], recs: ['Endurance training', 'Cold exposure for PGC-1α activation'] },
    { rsid: 'rs1799883', gene: 'FABP2', chr: '4', pos: 120241902, mag: 2, summary: 'FABP2 A54T — Fat absorption, insulin resistance', cats: ['nutrition', 'health'], risk: 'G', normal: 'A', conditions: ['Increased fat absorption', 'Insulin resistance'], recs: ['Lower-fat diet may benefit', 'Monitor insulin sensitivity'] },
    { rsid: 'rs1800169', gene: 'CILP', chr: '15', pos: 65494530, mag: 2, summary: 'CILP — Disc degeneration risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Lumbar disc degeneration'], recs: ['Core strengthening', 'Ergonomic posture'] },
    { rsid: 'rs12722', gene: 'COL5A1', chr: '9', pos: 137149743, mag: 2, summary: 'COL5A1 — Achilles tendon injury risk', cats: ['traits', 'health'], risk: 'T', normal: 'C', conditions: ['Tendon injury susceptibility'], recs: ['Proper warm-up', 'Gradual training progression'] },
    { rsid: 'rs1800012', gene: 'COL1A1', chr: '17', pos: 50200388, mag: 2, summary: 'COL1A1 — Bone density, fracture risk', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Osteoporosis risk'], recs: ['Weight-bearing exercise', 'Calcium and vitamin D'] },

    // ADDITIONAL CANCER
    { rsid: 'rs4986790', gene: 'TLR4', chr: '9', pos: 120475302, mag: 2, summary: 'TLR4 D299G — Innate immunity, cancer susceptibility', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Altered innate immunity', 'Cancer susceptibility'], recs: ['Immune health support'] },
    { rsid: 'rs1800896', gene: 'IL10', chr: '1', pos: 206773552, mag: 2, summary: 'IL-10 — Anti-inflammatory, cancer protection variation', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Inflammatory disease', 'Cancer susceptibility variation'], recs: ['Anti-inflammatory diet'] },
    { rsid: 'rs2069763', gene: 'IL2', chr: '4', pos: 123378438, mag: 2, summary: 'IL-2 — Immune function and cancer risk', cats: ['health'], risk: 'G', normal: 'T', conditions: ['Immune function variation'], recs: ['Support immune health'] },

    // HORMONES
    { rsid: 'rs10046', gene: 'CYP19A1', chr: '15', pos: 51500998, mag: 2, summary: 'CYP19A1/Aromatase — Estrogen levels', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Estrogen level variation', 'Breast cancer risk'], recs: ['Monitor hormonal health'] },
    { rsid: 'rs700518', gene: 'CYP19A1', chr: '15', pos: 51507978, mag: 2, summary: 'CYP19A1 — Aromatase activity variation', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Estrogen metabolism'], recs: ['Hormonal balance monitoring'] },
    { rsid: 'rs743572', gene: 'CYP17A1', chr: '10', pos: 104590286, mag: 2, summary: 'CYP17A1 — Steroid hormone synthesis', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Hormonal variation', 'PCOS risk'], recs: ['Hormonal health monitoring'] },
    { rsid: 'rs523349', gene: 'SRD5A2', chr: '2', pos: 31747513, mag: 2, summary: 'SRD5A2 V89L — 5-alpha reductase, DHT levels', cats: ['health', 'traits'], risk: 'C', normal: 'G', conditions: ['Male pattern baldness', 'Prostate health'], recs: ['Monitor prostate health', 'Finasteride response variation'] },

    // PAIN
    { rsid: 'rs1799971', gene: 'OPRM1', chr: '6', pos: 154360797, mag: 3, summary: 'OPRM1 A118G — Opioid receptor, pain sensitivity', cats: ['pharma', 'traits'], risk: 'G', normal: 'A', conditions: ['Altered opioid response', 'Higher pain sensitivity', 'Opioid dose requirements'], recs: ['May need higher opioid doses', 'Inform anesthesiologist', 'Consider non-opioid pain management'] },
    { rsid: 'rs6269', gene: 'COMT', chr: '22', pos: 19949952, mag: 2, summary: 'COMT haplotype — Pain sensitivity', cats: ['traits', 'pharma'], risk: 'A', normal: 'G', conditions: ['Pain sensitivity variation'], recs: ['Multimodal pain management'] },
    { rsid: 'rs4818', gene: 'COMT', chr: '22', pos: 19951271, mag: 2, summary: 'COMT — Catecholamine metabolism, pain', cats: ['traits', 'pharma'], risk: 'G', normal: 'C', conditions: ['Pain sensitivity'], recs: ['Personalized pain management'] },

    // DIGESTION
    { rsid: 'rs182549', gene: 'MCM6/LCT', chr: '2', pos: 136616754, mag: 2, summary: 'LCT — Lactase persistence (additional variant)', cats: ['nutrition'], risk: 'C', normal: 'T', conditions: ['Lactose intolerance'], recs: ['Lactase supplements', 'Dairy alternatives'] },
    { rsid: 'rs1800234', gene: 'GSTM1', chr: '1', pos: 110230418, mag: 2, summary: 'GSTM1 — Glutathione S-transferase, detoxification', cats: ['nutrition', 'health'], risk: 'T', normal: 'C', conditions: ['Reduced detoxification capacity'], recs: ['Cruciferous vegetables', 'Adequate glutathione precursors'] },
    { rsid: 'rs4646903', gene: 'CYP1A1', chr: '15', pos: 75011882, mag: 2, summary: 'CYP1A1 — Xenobiotic metabolism variant', cats: ['health'], risk: 'C', normal: 'T', conditions: ['Carcinogen activation'], recs: ['Avoid smoking', 'Cruciferous vegetables'] },

    // ADDITIONAL MISC
    { rsid: 'rs1800925', gene: 'IL13', chr: '5', pos: 131995964, mag: 2, summary: 'IL-13 — Asthma and allergy susceptibility', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Asthma', 'Allergic diseases', 'IgE levels'], recs: ['Allergen avoidance', 'Monitor respiratory health'] },
    { rsid: 'rs20417', gene: 'PTGS2/COX2', chr: '1', pos: 186680462, mag: 2, summary: 'COX-2 — Inflammation and NSAID response', cats: ['health', 'pharma'], risk: 'C', normal: 'G', conditions: ['Inflammatory response', 'NSAID efficacy variation'], recs: ['Anti-inflammatory diet'] },
    { rsid: 'rs1800547', gene: 'MAPT', chr: '17', pos: 46018130, mag: 2, summary: 'MAPT H1/H2 — Tau protein, neurodegeneration', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Parkinson disease risk', 'Progressive supranuclear palsy'], recs: ['Neuroprotective lifestyle'] },
    { rsid: 'rs356219', gene: 'SNCA', chr: '4', pos: 90756891, mag: 2, summary: 'SNCA — Alpha-synuclein, Parkinson disease', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Parkinson disease risk'], recs: ['Regular exercise', 'Coffee may be protective'] },
    { rsid: 'rs11931074', gene: 'SNCA', chr: '4', pos: 90758034, mag: 2, summary: 'SNCA — Parkinson disease susceptibility', cats: ['health'], risk: 'T', normal: 'G', conditions: ['Parkinson disease'], recs: ['Neuroprotective lifestyle'] },
    { rsid: 'rs393152', gene: 'MAPT', chr: '17', pos: 44040184, mag: 2, summary: 'MAPT — Parkinson disease risk variant', cats: ['health'], risk: 'G', normal: 'A', conditions: ['Parkinson disease risk'], recs: ['Exercise and brain health'] },
    { rsid: 'rs11248051', gene: 'LRRK2', chr: '12', pos: 40734202, mag: 3, summary: 'LRRK2 — Parkinson disease risk', cats: ['health'], risk: 'T', normal: 'C', conditions: ['Parkinson disease (familial)'], recs: ['Genetic counseling', 'Neurological monitoring'] },
    { rsid: 'rs34637584', gene: 'LRRK2', chr: '12', pos: 40340400, mag: 5, summary: 'LRRK2 G2019S — Parkinson disease, most common genetic cause', cats: ['health'], risk: 'A', normal: 'G', conditions: ['Parkinson disease (30-75% lifetime risk)'], recs: ['Genetic counseling', 'Regular neurological assessment', 'Exercise is neuroprotective'] },
    { rsid: 'rs76763715', gene: 'GBA', chr: '1', pos: 155205634, mag: 4, summary: 'GBA N370S — Gaucher disease / Parkinson risk', cats: ['health', 'carrier'], risk: 'T', normal: 'C', conditions: ['Gaucher disease carrier', 'Parkinson disease risk (5x)'], recs: ['Genetic counseling', 'Neurological awareness'] },
  ];
}

async function trySnpediaApi() {
  console.log('Testing SNPedia API accessibility...');
  try {
    const data = await fetchCategoryMembers(null);
    if (data && data.query) {
      console.log('SNPedia API is accessible!');
      return true;
    }
  } catch {}
  console.log('SNPedia API is blocked (Incapsula). Using fallback catalog.');
  return false;
}

async function runSnpediaMode() {
  console.log('Fetching SNP list from category...');
  const allSnpTitles = [];
  let cmcontinue = null;
  const maxPages = Math.max(LIMIT * 4, 4000);

  while (allSnpTitles.length < maxPages) {
    const data = await fetchCategoryMembers(cmcontinue);
    if (!data?.query?.categorymembers) break;
    for (const member of data.query.categorymembers) allSnpTitles.push(member.title);
    cmcontinue = data?.continue?.cmcontinue;
    if (!cmcontinue) break;
    console.log(`  ... ${allSnpTitles.length} SNP titles collected`);
  }
  console.log(`Collected ${allSnpTitles.length} SNP titles`);

  console.log('Fetching individual SNP pages...');
  const snpEntries = [];
  let processed = 0;

  for (const title of allSnpTitles) {
    if (snpEntries.length >= LIMIT) break;
    if (!/^[Rr]s\d+$/.test(title)) continue;
    processed++;
    if (processed % 50 === 0) console.log(`  Processed ${processed}, found ${snpEntries.length}`);

    const page = await fetchPage(title);
    if (!page?.parse?.wikitext?.['*']) continue;
    const fields = parseRsidTemplate(page.parse.wikitext['*']);
    if (!fields) continue;
    const magnitude = parseFloat(fields.magnitude) || 0;
    if (magnitude < 2) continue;

    const rsid = title.toLowerCase().startsWith('rs') ? title.toLowerCase() : `rs${title.replace(/\D/g, '')}`;
    snpEntries.push({ rsid, gene: fields.gene || '', chromosome: fields.chromosome || '', position: parseInt(fields.position) || 0, magnitude, summary: fields.summary || '', pageTitle: title });
  }

  snpEntries.sort((a, b) => b.magnitude - a.magnitude);
  const topSnps = snpEntries.slice(0, LIMIT);

  // Fetch genotypes
  console.log('Fetching genotype pages...');
  const bases = ['A', 'C', 'G', 'T'];
  for (let idx = 0; idx < topSnps.length; idx++) {
    const snp = topSnps[idx];
    if (idx % 20 === 0) console.log(`  Genotypes: ${idx}/${topSnps.length}`);
    snp.genotypes = {};
    for (let i = 0; i < bases.length; i++) {
      for (let j = i; j < bases.length; j++) {
        const data = await fetchPage(`${snp.pageTitle}(${bases[i]};${bases[j]})`);
        if (!data?.parse?.wikitext?.['*']) continue;
        const gf = parseGenotypeTemplate(data.parse.wikitext['*']);
        if (gf) snp.genotypes[`${bases[i]}${bases[j]}`] = { magnitude: parseFloat(gf.magnitude) || 0, repute: gf.repute || '', summary: gf.summary || '' };
      }
    }
  }
  return topSnps;
}

function runFallbackMode() {
  const catalog = getExpandedSnpCatalog();
  console.log(`Fallback catalog has ${catalog.length} SNPs`);

  return catalog.slice(0, LIMIT).map(s => ({
    rsid: s.rsid,
    gene: s.gene,
    chromosome: s.chr,
    position: s.pos,
    magnitude: s.mag,
    summary: s.summary,
    categories: s.cats,
    riskAllele: s.risk,
    normalAllele: s.normal,
    conditions: s.conditions || [],
    recommendations: s.recs || [],
    genotypes: {},
  }));
}

async function main() {
  console.log(`SNPedia Scraper — target: ${LIMIT} SNPs (magnitude >= 2)`);

  let topSnps;
  const apiAvailable = !FORCE_FALLBACK && await trySnpediaApi();

  if (apiAvailable) {
    topSnps = await runSnpediaMode();
  } else {
    topSnps = runFallbackMode();
  }

  console.log(`Got ${topSnps.length} new SNPs to merge`);

  // Load existing curated data
  let existingData = {};
  try {
    const mod = await import(DATA_FILE);
    existingData = mod.snpDatabase || {};
    console.log(`Loaded ${Object.keys(existingData).length} existing curated SNPs`);
  } catch (e) {
    console.log('Could not load existing data:', e.message);
  }

  // Merge — existing curated data takes priority
  const merged = { ...existingData };
  let added = 0;
  let enriched = 0;

  for (const snp of topSnps) {
    if (merged[snp.rsid]) {
      // Enrich existing entry
      if (!merged[snp.rsid].genotypes && snp.genotypes && Object.keys(snp.genotypes).length > 0) {
        merged[snp.rsid].genotypes = snp.genotypes;
        enriched++;
      }
      if (!merged[snp.rsid].magnitude && snp.magnitude) merged[snp.rsid].magnitude = snp.magnitude;
      continue;
    }

    // New entry
    merged[snp.rsid] = {
      rsid: snp.rsid,
      gene: snp.gene,
      chromosome: String(snp.chromosome),
      position: snp.position,
      categories: snp.categories || inferCategories(snp.gene, snp.summary),
      significance: (snp.magnitude || 0) >= 4 ? 'well-established' : 'moderate',
      magnitude: snp.magnitude || 2,
      riskAllele: snp.riskAllele || '',
      normalAllele: snp.normalAllele || '',
      trait: snp.summary || `${snp.gene} variant`,
      riskDescription: snp.summary || '',
      normalDescription: 'Common genotype',
      heterozygousDescription: '',
      populationFrequency: {},
      conditions: snp.conditions || [],
      recommendations: snp.recommendations || [],
      references: [],
      ...(snp.genotypes && Object.keys(snp.genotypes).length > 0 ? { genotypes: snp.genotypes } : {}),
    };
    added++;
  }

  console.log(`Added ${added} new SNPs, enriched ${enriched} existing`);
  console.log(`Total: ${Object.keys(merged).length} SNPs`);

  if (DRY_RUN) {
    console.log('Dry run — not writing file');
    return;
  }

  // Write output
  const output = `/**
 * SNP database — curated + expanded data
 * Generated: ${new Date().toISOString()}
 * Sources: ClinVar, SNPedia, PharmGKB, GWAS Catalog
 * Curated entries: ${Object.keys(existingData).length}
 * Expanded entries: ${added}
 * Total: ${Object.keys(merged).length}
 */
export const snpDatabase = ${JSON.stringify(merged, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, output);
  console.log(`Written to ${DATA_FILE}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
