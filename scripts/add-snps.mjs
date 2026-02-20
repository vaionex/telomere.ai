import { readFileSync, writeFileSync } from 'fs';

const dataPath = 'packages/snp-db/src/data.js';
let content = readFileSync(dataPath, 'utf8');

// Parse existing database
const match = content.match(/export const snpDatabase = (\{[\s\S]*\});?\s*$/);
if (!match) throw new Error('Could not parse snpDatabase');

// Use eval to parse (it's JS object literal)
const db = eval('(' + match[1] + ')');
console.log('Existing SNP count:', Object.keys(db).length);

// Check which target rsids exist
const targets = [
  'rs4236601','rs10483727','rs11209032','rs10490924','rs524952',
  'rs7521902','rs2349415','rs2414096','rs10986105','rs12150660','rs11031006','rs1800012',
  'rs12191877','rs3212227','rs4349859','rs3761847','rs7574865','rs4728142',
  'rs1006737','rs10994359','rs7794745','rs2710102','rs3825145','rs8099160','rs406001',
  'rs12917707','rs13329952','rs219780','rs11887534','rs3741049',
  'rs738409','rs58542926','rs76904798','rs1799945',
  'rs713041','rs855791','rs6050','rs1800562',
  'rs11204981','rs2228145','rs20541','rs8016947','rs28777',
  'rs35705950','rs12067292','rs2305480','rs8192678',
  'rs11209026','rs143383','rs4988235','rs1800795','rs1107946','rs6570507',
  'rs965513','rs3087243','rs10830963','rs6166','rs727479',
  'rs9939609','rs1799971','rs53576','rs4680','rs429358','rs662799','rs1801131'
];

for (const rs of targets) {
  console.log(`${rs}: ${db[rs] ? 'EXISTS' : 'NEW'}`);
}

// === ENHANCEMENTS to existing entries ===

// rs10490924 - enhance with better descriptions and references
db.rs10490924.significance = 'well-established';
db.rs10490924.riskDescription = 'Significantly increased risk of age-related macular degeneration (AMD). Homozygous carriers have ~7x risk.';
db.rs10490924.normalDescription = 'Normal risk for age-related macular degeneration';
db.rs10490924.heterozygousDescription = 'Moderately increased risk of AMD (~2.5x)';
db.rs10490924.populationFrequency = { GG: 0.45, GT: 0.42, TT: 0.13 };
if (!db.rs10490924.references.includes('PMID:16174643')) db.rs10490924.references.push('PMID:16174643');

// rs1800012 - enhance with pregnancy loss
if (!db.rs1800012.conditions.includes('Recurrent pregnancy loss')) db.rs1800012.conditions.push('Recurrent pregnancy loss');
db.rs1800012.riskDescription = 'Altered collagen production affecting bone density and connective tissue. Associated with osteoporosis and recurrent pregnancy loss.';
db.rs1800012.normalDescription = 'Normal collagen type I production';
db.rs1800012.heterozygousDescription = 'Carrier of COL1A1 Sp1 variant; mildly increased osteoporosis risk';
db.rs1800012.populationFrequency = { GG: 0.65, GT: 0.30, TT: 0.05 };
if (!db.rs1800012.references.includes('PMID:12815586')) db.rs1800012.references.push('PMID:12815586');

// rs7574865 - enhance with more autoimmune
db.rs7574865.significance = 'well-established';
db.rs7574865.riskDescription = 'Increased risk of multiple autoimmune conditions including RA, lupus, and Sjögren syndrome';
db.rs7574865.normalDescription = 'Normal STAT4 signaling and autoimmune risk';
db.rs7574865.heterozygousDescription = 'Moderately increased autoimmune susceptibility';
db.rs7574865.populationFrequency = { GG: 0.50, GT: 0.40, TT: 0.10 };
if (!db.rs7574865.conditions.includes('Autoimmune susceptibility')) db.rs7574865.conditions.push('Autoimmune susceptibility');
if (!db.rs7574865.references.includes('PMID:17502902')) db.rs7574865.references.push('PMID:17502902');

// rs11209026 - enhance with ankylosing spondylitis
if (!db.rs11209026.conditions.includes('Ankylosing spondylitis (protective)')) db.rs11209026.conditions.push('Ankylosing spondylitis (protective)');
if (!db.rs11209026.conditions.includes('Psoriasis (protective)')) db.rs11209026.conditions.push('Psoriasis (protective)');
db.rs11209026.riskDescription = 'Common IL23R variant associated with inflammatory bowel disease, psoriasis, and ankylosing spondylitis susceptibility';
db.rs11209026.normalDescription = 'Protective IL23R R381Q variant reduces risk of IBD and other inflammatory conditions';
db.rs11209026.heterozygousDescription = 'Partial protection against inflammatory bowel disease';
db.rs11209026.populationFrequency = { GG: 0.93, GA: 0.07, AA: 0.002 };
if (!db.rs11209026.references.includes('PMID:17554300')) db.rs11209026.references.push('PMID:17554300');

// rs1800795 - add joint conditions
if (!db.rs1800795.conditions.includes('Osteoarthritis')) db.rs1800795.conditions.push('Osteoarthritis');
if (!db.rs1800795.conditions.includes('Joint inflammation')) db.rs1800795.conditions.push('Joint inflammation');

// rs3087243 - enhance with Hashimoto's
if (!db.rs3087243.conditions.includes("Hashimoto's thyroiditis")) db.rs3087243.conditions.push("Hashimoto's thyroiditis");
db.rs3087243.riskDescription = 'Increased susceptibility to autoimmune thyroid disease, type 1 diabetes, and other autoimmune conditions';
db.rs3087243.normalDescription = 'Normal CTLA4 immune checkpoint function';
db.rs3087243.heterozygousDescription = 'Moderately increased autoimmune susceptibility';
db.rs3087243.populationFrequency = { AA: 0.20, AG: 0.50, GG: 0.30 };

// rs10830963 - enhance with gestational diabetes
if (!db.rs10830963.conditions.includes('Gestational diabetes risk')) db.rs10830963.conditions.push('Gestational diabetes risk');

// rs8192678 - enhance with respiratory
if (!db.rs8192678.conditions.includes('Respiratory capacity')) db.rs8192678.conditions.push('Respiratory capacity');
if (!db.rs8192678.categories.includes('health')) db.rs8192678.categories.push('health');
db.rs8192678.riskDescription = 'Reduced mitochondrial biogenesis affecting endurance capacity and respiratory function';
db.rs8192678.normalDescription = 'Normal PGC-1α function supporting mitochondrial health and exercise capacity';
db.rs8192678.heterozygousDescription = 'Intermediate mitochondrial biogenesis capacity';
db.rs8192678.populationFrequency = { GG: 0.40, GA: 0.45, AA: 0.15 };

// rs2228145 - add skin conditions
if (!db.rs2228145.conditions.includes('Atopic dermatitis')) db.rs2228145.conditions.push('Atopic dermatitis');
if (!db.rs2228145.conditions.includes('Eczema')) db.rs2228145.conditions.push('Eczema');
if (!db.rs2228145.references.includes('PMID:22153133')) db.rs2228145.references.push('PMID:22153133');

// rs855791 - enhance
db.rs855791.riskDescription = 'Lower iron and hemoglobin levels; increased risk of iron deficiency anemia';
db.rs855791.normalDescription = 'Normal iron regulation via TMPRSS6/matriptase-2';
db.rs855791.heterozygousDescription = 'Mildly reduced iron levels';
db.rs855791.populationFrequency = { CC: 0.35, CT: 0.47, TT: 0.18 };
if (!db.rs855791.references.includes('PMID:19862010')) db.rs855791.references.push('PMID:19862010');

// rs1799945 - enhance with liver
if (!db.rs1799945.conditions.includes('Liver iron overload')) db.rs1799945.conditions.push('Liver iron overload');
if (!db.rs1799945.references.includes('PMID:9462394')) db.rs1799945.references.push('PMID:9462394');

// === NEW SNPs ===
const newSnps = {
  rs4236601: {
    rsid: 'rs4236601', gene: 'CAV1', chromosome: '7', position: 116164839,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'CAV1 — Primary Open-Angle Glaucoma',
    riskDescription: 'Increased risk of primary open-angle glaucoma through altered caveolin-1 signaling',
    normalDescription: 'Normal caveolin-1 function and glaucoma risk',
    heterozygousDescription: 'Moderately increased glaucoma susceptibility',
    populationFrequency: { GG: 0.60, GA: 0.34, AA: 0.06 },
    conditions: ['Primary open-angle glaucoma', 'Intraocular pressure elevation'],
    recommendations: ['Regular eye pressure screening', 'Annual comprehensive eye exams after age 40'],
    references: ['PMID:21532571']
  },
  rs10483727: {
    rsid: 'rs10483727', gene: 'TMCO1', chromosome: '1', position: 165768665,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'TMCO1 — Open-Angle Glaucoma',
    riskDescription: 'Increased risk of open-angle glaucoma via TMCO1 calcium channel dysfunction',
    normalDescription: 'Normal TMCO1 function and glaucoma risk',
    heterozygousDescription: 'Mildly increased glaucoma risk',
    populationFrequency: { GG: 0.42, GA: 0.44, AA: 0.14 },
    conditions: ['Open-angle glaucoma', 'Elevated intraocular pressure'],
    recommendations: ['Regular eye exams', 'Monitor intraocular pressure'],
    references: ['PMID:21532571']
  },
  rs11209032: {
    rsid: 'rs11209032', gene: 'IL23R', chromosome: '1', position: 67725120,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'IL23R — Acute Anterior Uveitis',
    riskDescription: 'Increased susceptibility to acute anterior uveitis and ocular inflammation',
    normalDescription: 'Normal risk for uveitis',
    heterozygousDescription: 'Mildly increased uveitis risk',
    populationFrequency: { GG: 0.45, GA: 0.42, AA: 0.13 },
    conditions: ['Acute anterior uveitis', 'Ocular inflammation'],
    recommendations: ['Seek prompt evaluation for eye pain/redness', 'Report symptoms to ophthalmologist'],
    references: ['PMID:21743469']
  },
  rs524952: {
    rsid: 'rs524952', gene: 'GJD2', chromosome: '15', position: 35005886,
    categories: ['health', 'traits'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'C',
    trait: 'GJD2 — Myopia/Nearsightedness',
    riskDescription: 'Increased risk of myopia (nearsightedness)',
    normalDescription: 'Normal refractive development',
    heterozygousDescription: 'Mildly increased myopia risk',
    populationFrequency: { CC: 0.35, CA: 0.47, AA: 0.18 },
    conditions: ['Myopia', 'Nearsightedness'],
    recommendations: ['Regular vision screening', 'Outdoor time may be protective', 'Limit prolonged near-work in children'],
    references: ['PMID:23049088']
  },
  rs7521902: {
    rsid: 'rs7521902', gene: 'WNT4', chromosome: '1', position: 22463610,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'C',
    trait: 'WNT4 — Endometriosis',
    riskDescription: 'Increased risk of endometriosis through altered WNT signaling in reproductive tissue',
    normalDescription: 'Normal WNT4 signaling and endometriosis risk',
    heterozygousDescription: 'Moderately increased endometriosis risk',
    populationFrequency: { CC: 0.50, CA: 0.40, AA: 0.10 },
    conditions: ['Endometriosis', 'Pelvic pain', 'Fertility complications'],
    recommendations: ['Discuss symptoms with gynecologist', 'Early evaluation of pelvic pain'],
    references: ['PMID:21151130']
  },
  rs2349415: {
    rsid: 'rs2349415', gene: 'GREB1', chromosome: '2', position: 11780808,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'C', normalAllele: 'T',
    trait: 'GREB1 — Endometriosis',
    riskDescription: 'Increased endometriosis risk via estrogen-responsive GREB1 pathway',
    normalDescription: 'Normal GREB1 function and endometriosis risk',
    heterozygousDescription: 'Mildly increased endometriosis susceptibility',
    populationFrequency: { TT: 0.35, TC: 0.47, CC: 0.18 },
    conditions: ['Endometriosis'],
    recommendations: ['Gynecological screening if symptomatic'],
    references: ['PMID:21151130']
  },
  rs2414096: {
    rsid: 'rs2414096', gene: 'CYP19A1', chromosome: '15', position: 51507981,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'CYP19A1 — PCOS/Hormone Levels',
    riskDescription: 'Altered aromatase activity affecting estrogen/androgen balance; associated with PCOS',
    normalDescription: 'Normal aromatase activity and hormone balance',
    heterozygousDescription: 'Mildly altered hormone metabolism',
    populationFrequency: { GG: 0.40, GA: 0.45, AA: 0.15 },
    conditions: ['Polycystic ovary syndrome', 'Hormone imbalance'],
    recommendations: ['Monitor hormone levels if symptomatic', 'Discuss PCOS risk with endocrinologist'],
    references: ['PMID:18042004']
  },
  rs10986105: {
    rsid: 'rs10986105', gene: 'FSHB', chromosome: '11', position: 30226356,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'FSHB — FSH Levels/Fertility',
    riskDescription: 'Altered FSH levels affecting fertility and reproductive function',
    normalDescription: 'Normal FSH production and fertility',
    heterozygousDescription: 'Mildly altered FSH levels',
    populationFrequency: { GG: 0.55, GA: 0.38, AA: 0.07 },
    conditions: ['FSH level variation', 'Fertility issues'],
    recommendations: ['Check FSH levels if experiencing fertility issues', 'Fertility counseling if planning pregnancy'],
    references: ['PMID:22246508']
  },
  rs12150660: {
    rsid: 'rs12150660', gene: 'SHBG', chromosome: '17', position: 7534860,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'G', normalAllele: 'T',
    trait: 'SHBG — Sex Hormone Binding Globulin Levels',
    riskDescription: 'Altered SHBG levels affecting free testosterone and estrogen availability',
    normalDescription: 'Normal SHBG and sex hormone levels',
    heterozygousDescription: 'Moderately altered SHBG levels',
    populationFrequency: { TT: 0.50, TG: 0.40, GG: 0.10 },
    conditions: ['SHBG level variation', 'Testosterone level variation', 'Sex hormone imbalance'],
    recommendations: ['Monitor sex hormone levels', 'Discuss with endocrinologist if symptomatic'],
    references: ['PMID:19141602']
  },
  rs11031006: {
    rsid: 'rs11031006', gene: 'FSHB', chromosome: '11', position: 30230805,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'G', normalAllele: 'A',
    trait: 'FSHB — Menopause Timing/Female Fertility',
    riskDescription: 'Associated with earlier menopause and altered reproductive lifespan',
    normalDescription: 'Normal reproductive aging timeline',
    heterozygousDescription: 'Slightly earlier menopause timing',
    populationFrequency: { AA: 0.70, AG: 0.27, GG: 0.03 },
    conditions: ['Early menopause risk', 'Reproductive aging'],
    recommendations: ['Fertility planning awareness', 'Discuss reproductive timeline with OB/GYN'],
    references: ['PMID:23307926']
  },
  rs12191877: {
    rsid: 'rs12191877', gene: 'HLA-C', chromosome: '6', position: 31271746,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'T', normalAllele: 'C',
    trait: 'HLA-C — Psoriasis',
    riskDescription: 'Strongly increased risk of psoriasis through HLA-C*06:02 association',
    normalDescription: 'Normal psoriasis risk',
    heterozygousDescription: 'Increased psoriasis susceptibility',
    populationFrequency: { CC: 0.55, CT: 0.38, TT: 0.07 },
    conditions: ['Psoriasis', 'Psoriatic arthritis'],
    recommendations: ['Monitor skin changes', 'Early dermatological evaluation if symptomatic'],
    references: ['PMID:20953190']
  },
  rs3212227: {
    rsid: 'rs3212227', gene: 'IL12B', chromosome: '5', position: 159315684,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'C', normalAllele: 'A',
    trait: 'IL12B — Psoriasis',
    riskDescription: 'Altered IL-12 production increasing psoriasis and autoimmune disease risk',
    normalDescription: 'Normal IL-12B signaling',
    heterozygousDescription: 'Mildly increased psoriasis risk',
    populationFrequency: { AA: 0.45, AC: 0.42, CC: 0.13 },
    conditions: ['Psoriasis', 'Autoimmune skin disease'],
    recommendations: ['Dermatological screening if symptomatic', 'Vitamin D optimization'],
    references: ['PMID:17476679']
  },
  rs4349859: {
    rsid: 'rs4349859', gene: 'HLA-B', chromosome: '6', position: 31323166,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'HLA-B27 — Ankylosing Spondylitis',
    riskDescription: 'Strong proxy for HLA-B27; major risk factor for ankylosing spondylitis',
    normalDescription: 'HLA-B27 negative; low risk for ankylosing spondylitis',
    heterozygousDescription: 'Likely HLA-B27 carrier; increased ankylosing spondylitis risk',
    populationFrequency: { GG: 0.85, GA: 0.14, AA: 0.01 },
    conditions: ['Ankylosing spondylitis', 'Axial spondyloarthritis', 'Anterior uveitis'],
    recommendations: ['Evaluate back pain/stiffness', 'Rheumatology referral if symptomatic'],
    references: ['PMID:21743469']
  },
  rs3761847: {
    rsid: 'rs3761847', gene: 'TRAF1/C5', chromosome: '9', position: 123652898,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'G', normalAllele: 'A',
    trait: 'TRAF1/C5 — Rheumatoid Arthritis',
    riskDescription: 'Increased susceptibility to rheumatoid arthritis via complement/TNF signaling',
    normalDescription: 'Normal TRAF1/C5 function and RA risk',
    heterozygousDescription: 'Mildly increased RA susceptibility',
    populationFrequency: { AA: 0.30, AG: 0.48, GG: 0.22 },
    conditions: ['Rheumatoid arthritis', 'Joint inflammation'],
    recommendations: ['Monitor for joint symptoms', 'Early rheumatology referral if symptomatic'],
    references: ['PMID:17804836']
  },
  rs4728142: {
    rsid: 'rs4728142', gene: 'IRF5', chromosome: '7', position: 128937983,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'IRF5 — Sjögren Syndrome/Lupus',
    riskDescription: 'Increased risk of Sjögren syndrome and systemic lupus erythematosus',
    normalDescription: 'Normal IRF5 interferon signaling',
    heterozygousDescription: 'Moderately increased autoimmune risk',
    populationFrequency: { GG: 0.35, GA: 0.47, AA: 0.18 },
    conditions: ['Sjögren syndrome', 'Systemic lupus erythematosus', 'Autoimmune susceptibility'],
    recommendations: ['Monitor for dry eyes/mouth symptoms', 'Autoimmune screening if symptomatic'],
    references: ['PMID:19838195']
  },
  rs1006737: {
    rsid: 'rs1006737', gene: 'CACNA1C', chromosome: '12', position: 2345295,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'CACNA1C — Bipolar Disorder',
    riskDescription: 'Increased risk of bipolar disorder and mood dysregulation via calcium channel variation',
    normalDescription: 'Normal CACNA1C calcium channel function',
    heterozygousDescription: 'Mildly increased bipolar disorder susceptibility',
    populationFrequency: { GG: 0.42, GA: 0.44, AA: 0.14 },
    conditions: ['Bipolar disorder', 'Mood dysregulation', 'Major depression'],
    recommendations: ['Mental health screening if symptomatic', 'Mood tracking', 'Regular sleep schedule'],
    references: ['PMID:18711365']
  },
  rs10994359: {
    rsid: 'rs10994359', gene: 'ANK3', chromosome: '10', position: 61872018,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'ANK3 — Bipolar Disorder',
    riskDescription: 'Increased bipolar disorder risk via altered ankyrin-G neuronal function',
    normalDescription: 'Normal ANK3 neuronal signaling',
    heterozygousDescription: 'Mildly increased bipolar susceptibility',
    populationFrequency: { GG: 0.50, GA: 0.40, AA: 0.10 },
    conditions: ['Bipolar disorder', 'Psychiatric susceptibility'],
    recommendations: ['Mental health awareness', 'Psychiatric evaluation if symptomatic'],
    references: ['PMID:18711365']
  },
  rs7794745: {
    rsid: 'rs7794745', gene: 'CNTNAP2', chromosome: '7', position: 146817504,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'T', normalAllele: 'A',
    trait: 'CNTNAP2 — Autism Spectrum Susceptibility',
    riskDescription: 'Increased susceptibility to autism spectrum disorder via contactin-associated protein',
    normalDescription: 'Normal CNTNAP2 neuronal connectivity',
    heterozygousDescription: 'Mildly increased ASD susceptibility',
    populationFrequency: { AA: 0.35, AT: 0.47, TT: 0.18 },
    conditions: ['Autism spectrum disorder', 'Neurodevelopmental variation'],
    recommendations: ['Early developmental screening', 'Speech/language evaluation if concerns'],
    references: ['PMID:18179900']
  },
  rs2710102: {
    rsid: 'rs2710102', gene: 'CNTNAP2', chromosome: '7', position: 147576809,
    categories: ['traits', 'health'], significance: 'moderate',
    riskAllele: 'C', normalAllele: 'T',
    trait: 'CNTNAP2 — Language/Social Cognition',
    riskDescription: 'Variation in language development and social cognition abilities',
    normalDescription: 'Typical language and social cognitive development',
    heterozygousDescription: 'Mild variation in language processing',
    populationFrequency: { TT: 0.30, TC: 0.48, CC: 0.22 },
    conditions: ['Language development variation', 'Social cognition variation'],
    recommendations: ['Support language development in children', 'Speech therapy if delays noted'],
    references: ['PMID:18668044']
  },
  rs3825145: {
    rsid: 'rs3825145', gene: 'SLC1A1', chromosome: '9', position: 4584022,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'SLC1A1 — OCD Susceptibility',
    riskDescription: 'Increased susceptibility to obsessive-compulsive disorder via glutamate transporter variation',
    normalDescription: 'Normal SLC1A1 glutamate signaling',
    heterozygousDescription: 'Mildly increased OCD susceptibility',
    populationFrequency: { GG: 0.50, GA: 0.40, AA: 0.10 },
    conditions: ['Obsessive-compulsive disorder', 'Anxiety disorders'],
    recommendations: ['Mental health screening if symptomatic', 'CBT therapy may be beneficial'],
    references: ['PMID:16642436']
  },
  rs8099160: {
    rsid: 'rs8099160', gene: 'NTRK2', chromosome: '9', position: 87400547,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'G', normalAllele: 'A',
    trait: 'NTRK2 — Eating Disorder/Anorexia Susceptibility',
    riskDescription: 'Increased risk of eating disorders including anorexia nervosa via BDNF-TrkB signaling',
    normalDescription: 'Normal NTRK2 neurotrophic signaling',
    heterozygousDescription: 'Mildly increased eating disorder susceptibility',
    populationFrequency: { AA: 0.45, AG: 0.42, GG: 0.13 },
    conditions: ['Anorexia nervosa', 'Eating disorders'],
    recommendations: ['Awareness of eating disorder risk factors', 'Early intervention if symptoms emerge'],
    references: ['PMID:21658798']
  },
  rs406001: {
    rsid: 'rs406001', gene: 'CRHR1', chromosome: '17', position: 45808836,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'C', normalAllele: 'T',
    trait: 'CRHR1 — PTSD Susceptibility',
    riskDescription: 'Altered stress hormone response increasing PTSD susceptibility after trauma',
    normalDescription: 'Normal CRH receptor stress response',
    heterozygousDescription: 'Moderately altered stress response',
    populationFrequency: { TT: 0.40, TC: 0.45, CC: 0.15 },
    conditions: ['PTSD susceptibility', 'Stress response variation'],
    recommendations: ['Trauma-informed care awareness', 'Stress management techniques', 'Seek support after traumatic events'],
    references: ['PMID:24585513']
  },
  rs12917707: {
    rsid: 'rs12917707', gene: 'UMOD', chromosome: '16', position: 20367690,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'G', normalAllele: 'T',
    trait: 'UMOD — Chronic Kidney Disease',
    riskDescription: 'Increased uromodulin production associated with chronic kidney disease and hypertension',
    normalDescription: 'Normal uromodulin levels and kidney function',
    heterozygousDescription: 'Mildly increased CKD susceptibility',
    populationFrequency: { TT: 0.15, TG: 0.45, GG: 0.40 },
    conditions: ['Chronic kidney disease', 'Hypertensive nephropathy'],
    recommendations: ['Monitor kidney function (eGFR, creatinine)', 'Blood pressure management', 'Adequate hydration'],
    references: ['PMID:20686651']
  },
  rs13329952: {
    rsid: 'rs13329952', gene: 'SHROOM3', chromosome: '4', position: 77485097,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'SHROOM3 — Kidney Function/eGFR',
    riskDescription: 'Reduced kidney function as measured by eGFR',
    normalDescription: 'Normal kidney function',
    heterozygousDescription: 'Mildly reduced eGFR',
    populationFrequency: { GG: 0.45, GA: 0.42, AA: 0.13 },
    conditions: ['Reduced kidney function', 'Low eGFR'],
    recommendations: ['Regular kidney function testing', 'Stay hydrated', 'Manage blood pressure'],
    references: ['PMID:20686651']
  },
  rs219780: {
    rsid: 'rs219780', gene: 'CLDN14', chromosome: '21', position: 37834040,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'C', normalAllele: 'T',
    trait: 'CLDN14 — Kidney Stones',
    riskDescription: 'Increased risk of calcium kidney stones via altered claudin-14 tight junction function',
    normalDescription: 'Normal claudin-14 function and kidney stone risk',
    heterozygousDescription: 'Moderately increased kidney stone risk',
    populationFrequency: { TT: 0.40, TC: 0.45, CC: 0.15 },
    conditions: ['Kidney stones', 'Nephrolithiasis', 'Hypercalciuria'],
    recommendations: ['Adequate fluid intake', 'Limit sodium and oxalate', 'Calcium from food sources'],
    references: ['PMID:19706858']
  },
  rs11887534: {
    rsid: 'rs11887534', gene: 'ABCG8', chromosome: '2', position: 43840665,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'C', normalAllele: 'G',
    trait: 'ABCG8 D19H — Gallstones',
    riskDescription: 'Significantly increased gallstone risk (~2-3x) via cholesterol transport dysfunction',
    normalDescription: 'Normal cholesterol/bile transport',
    heterozygousDescription: 'Increased gallstone risk (~1.5-2x)',
    populationFrequency: { GG: 0.80, GC: 0.18, CC: 0.02 },
    conditions: ['Gallstones', 'Cholelithiasis'],
    recommendations: ['Maintain healthy weight', 'Avoid rapid weight loss', 'Moderate fat diet'],
    references: ['PMID:17632509']
  },
  rs3741049: {
    rsid: 'rs3741049', gene: 'SLC7A9', chromosome: '19', position: 33327832,
    categories: ['health', 'carrier'], significance: 'moderate',
    riskAllele: 'T', normalAllele: 'C',
    trait: 'SLC7A9 — Cystinuria/Kidney Stones',
    riskDescription: 'Impaired cystine reabsorption leading to cystine kidney stones',
    normalDescription: 'Normal cystine transport in kidneys',
    heterozygousDescription: 'Carrier of cystinuria variant; may have elevated cystine levels',
    populationFrequency: { CC: 0.92, CT: 0.08, TT: 0.002 },
    conditions: ['Cystinuria', 'Cystine kidney stones'],
    recommendations: ['High fluid intake', 'Alkalinize urine if affected', 'Monitor urine cystine levels'],
    references: ['PMID:10441578']
  },
  rs738409: {
    rsid: 'rs738409', gene: 'PNPLA3', chromosome: '22', position: 44324727,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'G', normalAllele: 'C',
    trait: 'PNPLA3 I148M — Fatty Liver Disease (NAFLD/NASH)',
    riskDescription: 'Strongly increased risk of non-alcoholic fatty liver disease, NASH, and liver fibrosis. Most clinically significant liver SNP.',
    normalDescription: 'Normal hepatic fat metabolism',
    heterozygousDescription: 'Moderately increased fatty liver risk; amplified by obesity/alcohol',
    populationFrequency: { CC: 0.45, CG: 0.42, GG: 0.13 },
    conditions: ['Non-alcoholic fatty liver disease', 'NASH', 'Liver fibrosis', 'Hepatic steatosis'],
    recommendations: ['Limit alcohol consumption', 'Maintain healthy weight', 'Regular liver function tests', 'Mediterranean diet may be protective'],
    references: ['PMID:18820647']
  },
  rs58542926: {
    rsid: 'rs58542926', gene: 'TM6SF2', chromosome: '19', position: 19379549,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'T', normalAllele: 'C',
    trait: 'TM6SF2 E167K — NAFLD/Liver Fibrosis',
    riskDescription: 'Increased hepatic fat content and liver fibrosis risk; paradoxically protective against cardiovascular disease',
    normalDescription: 'Normal hepatic lipid secretion',
    heterozygousDescription: 'Moderately increased liver fat; mildly reduced cardiovascular risk',
    populationFrequency: { CC: 0.85, CT: 0.14, TT: 0.01 },
    conditions: ['Non-alcoholic fatty liver disease', 'Liver fibrosis', 'Hepatic steatosis'],
    recommendations: ['Monitor liver function', 'Avoid excessive alcohol', 'Weight management'],
    references: ['PMID:25129146']
  },
  rs76904798: {
    rsid: 'rs76904798', gene: 'LRRK2', chromosome: '12', position: 40614434,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'T', normalAllele: 'C',
    trait: 'LRRK2 — Parkinson Disease/Liver Metabolism',
    riskDescription: 'Increased risk of Parkinson disease; may affect liver xenobiotic metabolism',
    normalDescription: 'Normal LRRK2 kinase function',
    heterozygousDescription: 'Mildly increased Parkinson disease risk',
    populationFrequency: { CC: 0.85, CT: 0.14, TT: 0.01 },
    conditions: ['Parkinson disease', 'Neurodegeneration', 'Liver metabolism variation'],
    recommendations: ['Neurological monitoring with aging', 'Exercise is neuroprotective', 'Report tremor/movement changes'],
    references: ['PMID:19915575']
  },
  rs713041: {
    rsid: 'rs713041', gene: 'GPX4', chromosome: '19', position: 1105567,
    categories: ['health', 'nutrition'], significance: 'moderate',
    riskAllele: 'C', normalAllele: 'T',
    trait: 'GPX4 — Selenium-Dependent Antioxidant Defense',
    riskDescription: 'Reduced glutathione peroxidase 4 activity; increased oxidative stress susceptibility',
    normalDescription: 'Normal GPX4 antioxidant function',
    heterozygousDescription: 'Mildly reduced antioxidant capacity',
    populationFrequency: { TT: 0.30, TC: 0.48, CC: 0.22 },
    conditions: ['Oxidative stress susceptibility', 'Selenium-dependent antioxidant variation'],
    recommendations: ['Ensure adequate selenium intake', 'Brazil nuts are rich in selenium', 'Antioxidant-rich diet'],
    references: ['PMID:17573169']
  },
  rs6050: {
    rsid: 'rs6050', gene: 'FGA', chromosome: '4', position: 155505558,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'FGA — Fibrinogen Levels/Blood Clotting',
    riskDescription: 'Elevated fibrinogen levels increasing clotting tendency and cardiovascular risk',
    normalDescription: 'Normal fibrinogen levels and clotting function',
    heterozygousDescription: 'Mildly elevated fibrinogen',
    populationFrequency: { GG: 0.40, GA: 0.45, AA: 0.15 },
    conditions: ['Elevated fibrinogen', 'Thrombosis risk', 'Cardiovascular disease risk'],
    recommendations: ['Monitor fibrinogen levels', 'Regular cardiovascular screening', 'Anti-inflammatory lifestyle'],
    references: ['PMID:16474174']
  },
  rs11204981: {
    rsid: 'rs11204981', gene: 'FLG', chromosome: '1', position: 152285861,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'FLG — Eczema/Atopic Dermatitis',
    riskDescription: 'Impaired skin barrier function due to filaggrin variation; significantly increased eczema risk',
    normalDescription: 'Normal filaggrin production and skin barrier',
    heterozygousDescription: 'Mildly impaired skin barrier; increased eczema susceptibility',
    populationFrequency: { GG: 0.70, GA: 0.26, AA: 0.04 },
    conditions: ['Atopic dermatitis', 'Eczema', 'Skin barrier dysfunction', 'Asthma risk (atopic march)'],
    recommendations: ['Regular moisturizing', 'Avoid harsh soaps/detergents', 'Emollient-based skincare', 'Monitor for asthma development'],
    references: ['PMID:21714856']
  },
  rs20541: {
    rsid: 'rs20541', gene: 'IL13', chromosome: '5', position: 132023863,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'IL13 R130Q — Atopic Dermatitis/Asthma',
    riskDescription: 'Enhanced IL-13 signaling increasing atopic dermatitis, asthma, and allergy risk',
    normalDescription: 'Normal IL-13 immune signaling',
    heterozygousDescription: 'Mildly increased atopic disease risk',
    populationFrequency: { GG: 0.55, GA: 0.38, AA: 0.07 },
    conditions: ['Atopic dermatitis', 'Asthma', 'Allergic disease', 'IgE elevation'],
    recommendations: ['Allergy testing if symptomatic', 'Avoid known triggers', 'Consider immunotherapy'],
    references: ['PMID:14985375']
  },
  rs8016947: {
    rsid: 'rs8016947', gene: 'WNT10A', chromosome: '2', position: 219746820,
    categories: ['traits', 'health'], significance: 'moderate',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'WNT10A — Hair/Skin/Dental Development',
    riskDescription: 'Variation in ectodermal development affecting hair thickness, skin texture, and dental morphology',
    normalDescription: 'Normal ectodermal development',
    heterozygousDescription: 'Mild variation in hair/skin/dental features',
    populationFrequency: { GG: 0.40, GA: 0.45, AA: 0.15 },
    conditions: ['Ectodermal variation', 'Hair thickness variation', 'Dental development variation'],
    recommendations: ['Regular dental check-ups', 'Dermatological evaluation if concerns'],
    references: ['PMID:20383146']
  },
  rs28777: {
    rsid: 'rs28777', gene: 'SLC45A2', chromosome: '5', position: 33951693,
    categories: ['traits'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'SLC45A2 — Skin Pigmentation',
    riskDescription: 'Lighter skin pigmentation; increased sun sensitivity and skin cancer risk',
    normalDescription: 'Darker skin pigmentation; greater UV protection',
    heterozygousDescription: 'Intermediate pigmentation',
    populationFrequency: { GG: 0.35, GA: 0.45, AA: 0.20 },
    conditions: ['Skin pigmentation variation', 'Sun sensitivity', 'Melanoma risk (lighter skin)'],
    recommendations: ['Sun protection (SPF 30+)', 'Regular skin cancer screening', 'Vitamin D monitoring'],
    references: ['PMID:17952075']
  },
  rs35705950: {
    rsid: 'rs35705950', gene: 'MUC5B', chromosome: '11', position: 1219991,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'T', normalAllele: 'G',
    trait: 'MUC5B — Idiopathic Pulmonary Fibrosis',
    riskDescription: 'Strongly increased risk (~5-20x) of idiopathic pulmonary fibrosis via mucin overproduction',
    normalDescription: 'Normal MUC5B mucin production in airways',
    heterozygousDescription: 'Significantly increased IPF risk (~5x)',
    populationFrequency: { GG: 0.80, GT: 0.18, TT: 0.02 },
    conditions: ['Idiopathic pulmonary fibrosis', 'Interstitial lung disease'],
    recommendations: ['Avoid smoking', 'Minimize dust/fiber exposure', 'Pulmonary function monitoring if symptomatic'],
    references: ['PMID:21292169']
  },
  rs12067292: {
    rsid: 'rs12067292', gene: 'LPAR1', chromosome: '9', position: 113872992,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'LPAR1 — Obstructive Sleep Apnea',
    riskDescription: 'Increased susceptibility to obstructive sleep apnea',
    normalDescription: 'Normal sleep apnea risk',
    heterozygousDescription: 'Mildly increased sleep apnea susceptibility',
    populationFrequency: { GG: 0.50, GA: 0.40, AA: 0.10 },
    conditions: ['Obstructive sleep apnea', 'Sleep-disordered breathing'],
    recommendations: ['Sleep study if snoring/daytime sleepiness', 'Maintain healthy weight', 'Sleep position optimization'],
    references: ['PMID:30309133']
  },
  rs2305480: {
    rsid: 'rs2305480', gene: 'GSDMB', chromosome: '17', position: 38062196,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'G', normalAllele: 'A',
    trait: 'GSDMB — Asthma/Respiratory',
    riskDescription: 'Increased asthma susceptibility via gasdermin B-mediated airway inflammation',
    normalDescription: 'Normal respiratory immune response',
    heterozygousDescription: 'Moderately increased asthma risk',
    populationFrequency: { AA: 0.30, AG: 0.48, GG: 0.22 },
    conditions: ['Asthma', 'Airway hyperresponsiveness', 'Childhood-onset asthma'],
    recommendations: ['Asthma action plan if diagnosed', 'Avoid known triggers', 'Regular pulmonary monitoring'],
    references: ['PMID:17611496']
  },
  rs143383: {
    rsid: 'rs143383', gene: 'GDF5', chromosome: '20', position: 34025756,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'T', normalAllele: 'C',
    trait: 'GDF5 — Osteoarthritis',
    riskDescription: 'Reduced GDF5 expression increasing osteoarthritis risk, particularly in knees and hips',
    normalDescription: 'Normal GDF5 expression and joint cartilage maintenance',
    heterozygousDescription: 'Mildly increased osteoarthritis susceptibility',
    populationFrequency: { CC: 0.25, CT: 0.50, TT: 0.25 },
    conditions: ['Osteoarthritis', 'Joint degeneration', 'Cartilage degradation'],
    recommendations: ['Joint-protective exercise', 'Maintain healthy weight', 'Glucosamine/chondroitin may help'],
    references: ['PMID:17554300']
  },
  rs1107946: {
    rsid: 'rs1107946', gene: 'COL1A1', chromosome: '17', position: 50184329,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'T', normalAllele: 'G',
    trait: 'COL1A1 — Scoliosis',
    riskDescription: 'Altered collagen type I affecting spinal development; increased scoliosis risk',
    normalDescription: 'Normal spinal collagen structure',
    heterozygousDescription: 'Mildly increased scoliosis susceptibility',
    populationFrequency: { GG: 0.55, GT: 0.38, TT: 0.07 },
    conditions: ['Adolescent idiopathic scoliosis', 'Spinal curvature'],
    recommendations: ['Scoliosis screening in adolescents', 'Core strengthening exercises', 'Early orthopedic evaluation if concerned'],
    references: ['PMID:15085180']
  },
  rs6570507: {
    rsid: 'rs6570507', gene: 'LBX1', chromosome: '10', position: 102986658,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'G', normalAllele: 'A',
    trait: 'LBX1 — Adolescent Idiopathic Scoliosis',
    riskDescription: 'Increased risk of adolescent idiopathic scoliosis via altered LBX1 spinal development',
    normalDescription: 'Normal spinal development',
    heterozygousDescription: 'Moderately increased scoliosis risk',
    populationFrequency: { AA: 0.25, AG: 0.50, GG: 0.25 },
    conditions: ['Adolescent idiopathic scoliosis', 'Spinal curvature'],
    recommendations: ['Scoliosis screening during growth spurts', 'Physical therapy if diagnosed'],
    references: ['PMID:21559072']
  },
  rs965513: {
    rsid: 'rs965513', gene: 'FOXE1', chromosome: '9', position: 100556109,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: "FOXE1 — Thyroid Cancer/Hashimoto's",
    riskDescription: "Increased risk of thyroid cancer and Hashimoto's thyroiditis",
    normalDescription: 'Normal thyroid cancer risk',
    heterozygousDescription: 'Moderately increased thyroid disease risk',
    populationFrequency: { GG: 0.50, GA: 0.40, AA: 0.10 },
    conditions: ['Thyroid cancer', "Hashimoto's thyroiditis", 'Thyroid nodules'],
    recommendations: ['Regular thyroid palpation/ultrasound', 'Monitor TSH levels', 'Report neck swelling promptly'],
    references: ['PMID:19198613']
  },
  rs6166: {
    rsid: 'rs6166', gene: 'FSHR', chromosome: '2', position: 49189921,
    categories: ['health'], significance: 'well-established',
    riskAllele: 'A', normalAllele: 'G',
    trait: 'FSHR N680S — Ovarian Response/Fertility',
    riskDescription: 'Poor ovarian response to FSH stimulation; may require higher doses in IVF',
    normalDescription: 'Normal FSH receptor sensitivity',
    heterozygousDescription: 'Intermediate ovarian response to FSH',
    populationFrequency: { GG: 0.25, GA: 0.50, AA: 0.25 },
    conditions: ['Ovarian response variation', 'IVF outcome variation', 'Fertility treatment response'],
    recommendations: ['Inform fertility specialist of genotype', 'May need dose adjustments in IVF protocols'],
    references: ['PMID:10523614']
  },
  rs727479: {
    rsid: 'rs727479', gene: 'CYP19A1', chromosome: '15', position: 51536903,
    categories: ['health'], significance: 'moderate',
    riskAllele: 'A', normalAllele: 'C',
    trait: 'CYP19A1 — Estrogen Levels',
    riskDescription: 'Altered aromatase expression affecting circulating estrogen levels',
    normalDescription: 'Normal estrogen biosynthesis',
    heterozygousDescription: 'Mildly altered estrogen levels',
    populationFrequency: { CC: 0.40, CA: 0.45, AA: 0.15 },
    conditions: ['Estrogen level variation', 'Breast cancer risk', 'Endometriosis risk'],
    recommendations: ['Monitor estrogen-related symptoms', 'Regular breast cancer screening'],
    references: ['PMID:20668263']
  },
  rs662799: {
    rsid: 'rs662799', gene: 'APOA5', chromosome: '11', position: 116661392,
    categories: ['health', 'nutrition'], significance: 'well-established',
    riskAllele: 'C', normalAllele: 'T',
    trait: 'APOA5 — Triglyceride Levels',
    riskDescription: 'Significantly elevated triglyceride levels (~30% increase); increased cardiovascular risk',
    normalDescription: 'Normal triglyceride metabolism',
    heterozygousDescription: 'Moderately elevated triglycerides',
    populationFrequency: { TT: 0.75, TC: 0.23, CC: 0.02 },
    conditions: ['Hypertriglyceridemia', 'Cardiovascular disease risk', 'Metabolic syndrome'],
    recommendations: ['Limit refined carbohydrates and sugar', 'Omega-3 fatty acid supplementation', 'Regular lipid panel monitoring'],
    references: ['PMID:17903294']
  }
};

// Add all new SNPs to db
for (const [rsid, snp] of Object.entries(newSnps)) {
  if (db[rsid]) {
    console.log(`SKIPPING ${rsid} — already exists (should have been enhanced above)`);
  } else {
    db[rsid] = snp;
    console.log(`ADDED ${rsid}`);
  }
}

const totalCount = Object.keys(db).length;
console.log(`\nNew total: ${totalCount}`);

// Generate output
const entries = Object.entries(db).map(([key, val]) => {
  return `  ${JSON.stringify(key)}: ${JSON.stringify(val, null, 4).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')}`;
}).join(',\n');

const output = `// Auto-generated SNP database — DO NOT EDIT MANUALLY
// Run: node scripts/expand-snp-db.js to add more SNPs
// Last updated: ${new Date().toISOString()}
// Total SNPs: ${totalCount}

export const snpDatabase = {
${entries}
};
`;

writeFileSync(dataPath, output);
console.log('Written to', dataPath);
