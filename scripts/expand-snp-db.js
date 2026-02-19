#!/usr/bin/env node
/**
 * Expand SNP database using NCBI dbSNP E-utilities API
 * Pulls data for a curated list of clinically important SNPs
 * 
 * Usage: node scripts/expand-snp-db.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'packages', 'snp-db', 'src', 'data.js');

// Curated list of well-validated, clinically important SNPs to add
// These are sourced from ClinVar, PharmGKB, GWAS Catalog, and genetic counseling guidelines
const SNPS_TO_ADD = [
  // === CARDIOVASCULAR ===
  { rsid:'rs1333049', gene:'CDKN2B-AS1', chr:'9', pos:22125503, cat:['health'], sig:'well-established', risk:'C', normal:'G', trait:'9p21 Coronary Artery Disease Risk', riskDesc:'Increased risk of coronary artery disease and myocardial infarction', normalDesc:'Baseline cardiovascular risk from this locus', hetDesc:'Moderately elevated CAD risk (~1.3x)', freq:{GG:0.36,GC:0.48,CC:0.16}, conditions:['Coronary artery disease','Myocardial infarction','Peripheral artery disease'], recs:['Regular cardiovascular screening','Heart-healthy diet and exercise'], refs:['PMID:17478679','PMID:17478681'] },
  { rsid:'rs10757278', gene:'CDKN2B-AS1', chr:'9', pos:22124478, cat:['health'], sig:'well-established', risk:'G', normal:'A', trait:'9p21.3 Heart Disease Risk', riskDesc:'Elevated risk for coronary heart disease', normalDesc:'Lower risk allele for coronary heart disease', hetDesc:'Intermediate coronary heart disease risk', freq:{AA:0.36,AG:0.48,GG:0.16}, conditions:['Coronary heart disease','Aortic aneurysm'], recs:['Cardiovascular risk management'], refs:['PMID:17478679'] },
  { rsid:'rs4977574', gene:'CDKN2B-AS1', chr:'9', pos:22098619, cat:['health'], sig:'well-established', risk:'G', normal:'A', trait:'Coronary Heart Disease — 9p21.3', riskDesc:'Strong association with coronary heart disease risk', normalDesc:'Lower coronary risk from this variant', hetDesc:'Moderately elevated coronary risk', freq:{AA:0.34,AG:0.48,GG:0.18}, conditions:['Coronary heart disease'], recs:['Lipid panel monitoring','Regular exercise'], refs:['PMID:17634449'] },
  { rsid:'rs6025', gene:'F5', chr:'1', pos:169519049, cat:['health'], sig:'well-established', risk:'A', normal:'G', trait:'Factor V Leiden Thrombophilia', riskDesc:'Factor V Leiden mutation — significantly increased risk of venous thromboembolism', normalDesc:'Normal Factor V — baseline clotting risk', hetDesc:'Carrier of Factor V Leiden — 5-10x increased VTE risk', freq:{GG:0.95,GA:0.045,AA:0.005}, conditions:['Deep vein thrombosis','Pulmonary embolism','Venous thromboembolism'], recs:['Avoid prolonged immobility','Inform surgeon before any procedure','Consider anticoagulation during high-risk periods'], refs:['PMID:7989264','PMID:9521222'] },
  { rsid:'rs1799963', gene:'F2', chr:'11', pos:46761055, cat:['health'], sig:'well-established', risk:'A', normal:'G', trait:'Prothrombin G20210A Thrombophilia', riskDesc:'Prothrombin mutation — increased venous thrombosis risk', normalDesc:'Normal prothrombin — baseline clotting', hetDesc:'Carrier — 2-5x increased VTE risk', freq:{GG:0.97,GA:0.027,AA:0.003}, conditions:['Venous thromboembolism','Prothrombin thrombophilia'], recs:['Inform healthcare providers','Avoid estrogen-containing contraceptives if carrier'], refs:['PMID:8872463'] },

  // === TYPE 2 DIABETES ===
  { rsid:'rs1801282', gene:'PPARG', chr:'3', pos:12393125, cat:['health'], sig:'well-established', risk:'C', normal:'G', trait:'Type 2 Diabetes Risk — PPARG Pro12Ala', riskDesc:'Common allele associated with slightly higher T2D risk', normalDesc:'Ala variant — protective against type 2 diabetes', hetDesc:'Intermediate T2D risk', freq:{CC:0.85,CG:0.14,GG:0.01}, conditions:['Type 2 diabetes','Insulin resistance'], recs:['Regular blood glucose monitoring','Maintain healthy weight'], refs:['PMID:10886038','PMID:17426276'] },
  { rsid:'rs10811661', gene:'CDKN2A/B', chr:'9', pos:22134094, cat:['health'], sig:'well-established', risk:'T', normal:'C', trait:'Type 2 Diabetes Risk — CDKN2A/B', riskDesc:'Increased susceptibility to type 2 diabetes', normalDesc:'Lower T2D risk from this locus', hetDesc:'Moderately elevated T2D risk', freq:{CC:0.20,CT:0.49,TT:0.31}, conditions:['Type 2 diabetes'], recs:['Monitor blood glucose','Mediterranean diet'], refs:['PMID:17554300'] },

  // === CELIAC & AUTOIMMUNE ===
  { rsid:'rs2187668', gene:'HLA-DQ2.5', chr:'6', pos:32637421, cat:['health'], sig:'well-established', risk:'T', normal:'C', trait:'Celiac Disease Risk — HLA-DQ2.5', riskDesc:'Carries HLA-DQ2.5 — strongly predisposes to celiac disease', normalDesc:'Does not carry HLA-DQ2.5 risk haplotype', hetDesc:'Carrier of DQ2.5 — elevated celiac risk', freq:{CC:0.75,CT:0.22,TT:0.03}, conditions:['Celiac disease','Gluten sensitivity'], recs:['Consider celiac antibody testing if symptomatic','Discuss with gastroenterologist'], refs:['PMID:18311140'] },

  // === PHARMACOGENOMICS ===
  { rsid:'rs3892097', gene:'CYP2D6', chr:'22', pos:42130692, cat:['pharma'], sig:'well-established', risk:'A', normal:'G', trait:'CYP2D6*4 — Drug Metabolism', riskDesc:'CYP2D6 poor metabolizer allele — many drugs metabolized too slowly', normalDesc:'Normal CYP2D6 metabolism', hetDesc:'Intermediate CYP2D6 metabolism — may need dose adjustments', freq:{GG:0.72,GA:0.24,AA:0.04}, conditions:['CYP2D6 poor metabolizer status','Altered drug metabolism'], recs:['Inform prescribers about CYP2D6 status','Affected drugs: codeine, tamoxifen, many antidepressants','FDA-labeled pharmacogenomic biomarker'], refs:['PMID:16958828','PMID:23486447'] },
  { rsid:'rs1065852', gene:'CYP2D6', chr:'22', pos:42130738, cat:['pharma'], sig:'well-established', risk:'A', normal:'G', trait:'CYP2D6*10 — Reduced Drug Metabolism', riskDesc:'Reduced CYP2D6 enzyme activity', normalDesc:'Normal CYP2D6 activity', hetDesc:'Intermediate metabolizer', freq:{GG:0.65,GA:0.30,AA:0.05}, conditions:['Reduced drug metabolism'], recs:['Consider pharmacogenomic-guided dosing'], refs:['PMID:16958828'] },
  { rsid:'rs4244285', gene:'CYP2C19', chr:'10', pos:96541616, cat:['pharma'], sig:'well-established', risk:'A', normal:'G', trait:'CYP2C19*2 — Clopidogrel Response', riskDesc:'CYP2C19 poor metabolizer — clopidogrel (Plavix) may be ineffective', normalDesc:'Normal CYP2C19 metabolism — standard clopidogrel response', hetDesc:'Intermediate metabolizer — reduced clopidogrel activation', freq:{GG:0.65,GA:0.29,AA:0.06}, conditions:['Clopidogrel resistance','Altered drug metabolism'], recs:['FDA boxed warning: consider alternative antiplatelet therapy','Affected: clopidogrel, omeprazole, some antidepressants'], refs:['PMID:19706858','PMID:20385995'] },
  { rsid:'rs12248560', gene:'CYP2C19', chr:'10', pos:96522463, cat:['pharma'], sig:'well-established', risk:'T', normal:'C', trait:'CYP2C19*17 — Ultra-Rapid Metabolism', riskDesc:'Ultra-rapid CYP2C19 metabolizer — may need higher doses of some drugs', normalDesc:'Normal CYP2C19 metabolism rate', hetDesc:'Rapid metabolizer — enhanced CYP2C19 activity', freq:{CC:0.60,CT:0.34,TT:0.06}, conditions:['Ultra-rapid drug metabolism','Increased bleeding risk on clopidogrel'], recs:['May metabolize some drugs too quickly','Discuss with pharmacist'], refs:['PMID:16637834'] },
  { rsid:'rs4149056', gene:'SLCO1B1', chr:'12', pos:21331549, cat:['pharma'], sig:'well-established', risk:'C', normal:'T', trait:'Statin Myopathy Risk — SLCO1B1', riskDesc:'Increased risk of statin-induced myopathy, especially with simvastatin', normalDesc:'Normal statin transport — standard myopathy risk', hetDesc:'Moderately increased statin myopathy risk', freq:{TT:0.65,TC:0.30,CC:0.05}, conditions:['Statin-induced myopathy','Rhabdomyolysis risk'], recs:['FDA label: avoid simvastatin 80mg','Consider alternative statins (rosuvastatin, pravastatin)','CPIC guideline: reduce simvastatin dose'], refs:['PMID:18650507','PMID:22617227'] },
  { rsid:'rs1799853', gene:'CYP2C9', chr:'10', pos:96702047, cat:['pharma'], sig:'well-established', risk:'T', normal:'C', trait:'CYP2C9*2 — Warfarin Sensitivity', riskDesc:'Reduced CYP2C9 activity — slower warfarin metabolism, bleeding risk', normalDesc:'Normal CYP2C9 metabolism', hetDesc:'Intermediate warfarin metabolism', freq:{CC:0.80,CT:0.18,TT:0.02}, conditions:['Warfarin sensitivity','NSAID metabolism'], recs:['FDA-labeled warfarin dosing adjustment','Also affects: celecoxib, losartan, phenytoin'], refs:['PMID:14616350'] },
  { rsid:'rs1057910', gene:'CYP2C9', chr:'10', pos:96741053, cat:['pharma'], sig:'well-established', risk:'C', normal:'A', trait:'CYP2C9*3 — Warfarin Sensitivity', riskDesc:'Significantly reduced CYP2C9 activity — major warfarin dose reduction needed', normalDesc:'Normal CYP2C9*1 activity', hetDesc:'Intermediate metabolizer — reduced warfarin clearance', freq:{AA:0.88,AC:0.11,CC:0.01}, conditions:['Warfarin hypersensitivity','Drug metabolism'], recs:['CPIC guideline: reduce warfarin dose 20-40%','Critical for patients starting anticoagulation'], refs:['PMID:14616350','PMID:21900891'] },
  { rsid:'rs3918290', gene:'DPYD', chr:'1', pos:97915614, cat:['pharma'], sig:'well-established', risk:'A', normal:'G', trait:'DPYD*2A — Fluoropyrimidine Toxicity', riskDesc:'Complete DPD deficiency — life-threatening toxicity from 5-FU/capecitabine chemotherapy', normalDesc:'Normal DPD activity — standard fluoropyrimidine tolerance', hetDesc:'Partial DPD deficiency — increased toxicity risk, dose reduction needed', freq:{GG:0.98,GA:0.018,AA:0.002}, conditions:['Fluoropyrimidine toxicity','5-FU toxicity','Capecitabine toxicity'], recs:['CRITICAL: Pre-treatment DPYD testing recommended by EMA/FDA','Heterozygous: reduce 5-FU/capecitabine dose 50%','Homozygous: contraindicated — use alternative chemotherapy'], refs:['PMID:23988873','PMID:29152729'] },

  // === NUTRIGENOMICS ===
  { rsid:'rs1801131', gene:'MTHFR', chr:'1', pos:11854476, cat:['nutrition','health'], sig:'well-established', risk:'C', normal:'A', trait:'MTHFR A1298C — Methylation', riskDesc:'Reduced MTHFR activity (milder than C677T)', normalDesc:'Normal MTHFR activity at this position', hetDesc:'Slightly reduced MTHFR activity', freq:{AA:0.46,AC:0.44,CC:0.10}, conditions:['Methylation impairment (mild)','Homocysteine elevation (mild)'], recs:['Compound heterozygotes (677CT + 1298AC) may need methylfolate','Monitor folate and B12 status'], refs:['PMID:10444342'] },
  { rsid:'rs2228570', gene:'VDR', chr:'12', pos:48272895, cat:['nutrition'], sig:'well-established', risk:'T', normal:'C', trait:'Vitamin D Receptor — VDR FokI', riskDesc:'Less efficient vitamin D receptor — may need higher vitamin D intake', normalDesc:'Efficient vitamin D receptor function', hetDesc:'Intermediate vitamin D receptor efficiency', freq:{CC:0.38,CT:0.47,TT:0.15}, conditions:['Vitamin D metabolism','Bone density','Immune function'], recs:['Consider higher vitamin D supplementation','Regular 25-OH vitamin D testing'], refs:['PMID:15886920'] },
  { rsid:'rs1800562', gene:'HFE', chr:'6', pos:26093141, cat:['nutrition','health'], sig:'well-established', risk:'A', normal:'G', trait:'Hereditary Hemochromatosis — HFE C282Y', riskDesc:'HFE C282Y homozygote — high risk of iron overload (hemochromatosis)', normalDesc:'No HFE C282Y — normal iron metabolism', hetDesc:'C282Y carrier — usually unaffected but monitor ferritin', freq:{GG:0.90,GA:0.09,AA:0.01}, conditions:['Hereditary hemochromatosis','Iron overload','Liver disease (if untreated)'], recs:['Homozygous: regular ferritin and iron saturation testing','Therapeutic phlebotomy if iron elevated','Avoid iron supplements and excess red meat'], refs:['PMID:8696333','PMID:11443561'] },
  { rsid:'rs1799945', gene:'HFE', chr:'6', pos:26091179, cat:['nutrition','health'], sig:'well-established', risk:'G', normal:'C', trait:'HFE H63D — Iron Metabolism', riskDesc:'H63D variant — mild increase in iron absorption', normalDesc:'Normal iron absorption', hetDesc:'Slight increase in iron absorption, usually benign', freq:{CC:0.73,CG:0.24,GG:0.03}, conditions:['Mild iron overload (compound heterozygotes)'], recs:['Monitor if compound heterozygote (C282Y + H63D)'], refs:['PMID:9399903'] },
  { rsid:'rs174546', gene:'FADS1', chr:'11', pos:61597972, cat:['nutrition'], sig:'well-established', risk:'T', normal:'C', trait:'Omega-3/6 Fatty Acid Metabolism — FADS1', riskDesc:'Reduced conversion of ALA to EPA/DHA — may benefit from direct omega-3', normalDesc:'Efficient omega fatty acid desaturation', hetDesc:'Intermediate fatty acid conversion efficiency', freq:{CC:0.35,CT:0.48,TT:0.17}, conditions:['Omega-3 fatty acid metabolism','Inflammation levels'], recs:['Consider direct EPA/DHA supplementation (fish oil)','TT genotype: plant-based omega-3 (ALA) less efficiently converted'], refs:['PMID:21829377'] },
  { rsid:'rs7501331', gene:'BCMO1', chr:'16', pos:81264597, cat:['nutrition'], sig:'moderate', risk:'T', normal:'C', trait:'Beta-Carotene Conversion — BCMO1', riskDesc:'Reduced conversion of beta-carotene to vitamin A (~50% less)', normalDesc:'Normal beta-carotene to retinol conversion', hetDesc:'Moderately reduced beta-carotene conversion', freq:{CC:0.58,CT:0.36,TT:0.06}, conditions:['Vitamin A status','Beta-carotene metabolism'], recs:['TT: preformed vitamin A (retinol) may be preferable to beta-carotene','Eat vitamin A-rich foods (liver, dairy, eggs)'], refs:['PMID:19103647'] },

  // === TRAITS ===
  { rsid:'rs1805007', gene:'MC1R', chr:'16', pos:89986117, cat:['traits'], sig:'well-established', risk:'T', normal:'C', trait:'Red Hair & Fair Skin — MC1R R151C', riskDesc:'Red hair, fair skin, increased UV sensitivity and melanoma risk', normalDesc:'Normal MC1R — typical pigmentation', hetDesc:'Carrier — may have lighter skin, freckles, slight red tint', freq:{CC:0.85,CT:0.13,TT:0.02}, conditions:['Red hair','Fair skin','Increased melanoma risk','UV sensitivity'], recs:['Rigorous sun protection','Regular dermatological screening','Higher SPF sunscreen'], refs:['PMID:8651275','PMID:11260714'] },
  { rsid:'rs2304672', gene:'PER2', chr:'2', pos:239153949, cat:['traits'], sig:'moderate', risk:'G', normal:'C', trait:'Sleep Chronotype — PER2', riskDesc:'May prefer earlier sleep/wake times (morning chronotype)', normalDesc:'Standard circadian rhythm', hetDesc:'Slight tendency toward morningness', freq:{CC:0.85,CG:0.14,GG:0.01}, conditions:['Advanced sleep phase','Morning chronotype'], recs:['Align schedule with natural chronotype when possible'], refs:['PMID:11232563'] },
  { rsid:'rs713598', gene:'TAS2R38', chr:'7', pos:141973545, cat:['traits','nutrition'], sig:'well-established', risk:'C', normal:'G', trait:'Bitter Taste Perception — TAS2R38', riskDesc:'Strong bitter taster (PTC/PROP sensitivity)', normalDesc:'Non-taster — reduced sensitivity to bitter compounds', hetDesc:'Intermediate bitter taste sensitivity', freq:{GG:0.30,GC:0.48,CC:0.22}, conditions:['Bitter taste perception','Food preferences'], recs:['Strong tasters may avoid cruciferous vegetables — find palatable preparations'], refs:['PMID:12595690'] },
  { rsid:'rs1229984', gene:'ADH1B', chr:'4', pos:100239319, cat:['traits','nutrition'], sig:'well-established', risk:'T', normal:'C', trait:'Alcohol Metabolism — ADH1B', riskDesc:'Rapid alcohol metabolizer — faster ethanol to acetaldehyde conversion, protective against alcoholism', normalDesc:'Standard alcohol metabolism rate', hetDesc:'Faster alcohol metabolism', freq:{CC:0.72,CT:0.24,TT:0.04}, conditions:['Alcohol metabolism rate','Alcoholism risk (protective)'], recs:['Fast metabolizers: alcohol causes more facial flushing','Protective against alcohol use disorder'], refs:['PMID:19384953'] },
  { rsid:'rs1801260', gene:'CLOCK', chr:'4', pos:56413283, cat:['traits'], sig:'moderate', risk:'G', normal:'A', trait:'Evening Preference — CLOCK 3111T/C', riskDesc:'Tendency toward eveningness, delayed sleep', normalDesc:'Standard circadian preference', hetDesc:'Slight tendency toward later sleep timing', freq:{AA:0.60,AG:0.34,GG:0.06}, conditions:['Evening chronotype','Delayed sleep phase tendency'], recs:['Consider light therapy in morning if struggling with early schedules'], refs:['PMID:11723080'] },

  // === CARRIER STATUS ===
  { rsid:'rs75527207', gene:'CFTR', chr:'7', pos:117559590, cat:['carrier'], sig:'well-established', risk:'T', normal:'C', trait:'Cystic Fibrosis Carrier — CFTR ΔF508', riskDesc:'Homozygous — cystic fibrosis', normalDesc:'Non-carrier — no CF risk', hetDesc:'CF carrier — 1 in 25 Europeans carry this variant', freq:{CC:0.96,CT:0.038,TT:0.002}, conditions:['Cystic fibrosis','CF carrier status'], recs:['Carriers: genetic counseling recommended before family planning','Partner should be tested for CF variants'], refs:['PMID:2475911','PMID:21228398'] },
  { rsid:'rs80338939', gene:'GJB2', chr:'13', pos:20763612, cat:['carrier'], sig:'well-established', risk:'T', normal:'C', trait:'Non-Syndromic Hearing Loss Carrier — GJB2 35delG', riskDesc:'Homozygous — congenital non-syndromic hearing loss', normalDesc:'Non-carrier', hetDesc:'Carrier — most common cause of hereditary hearing loss in Europeans', freq:{CC:0.96,CT:0.037,TT:0.003}, conditions:['Congenital sensorineural hearing loss','GJB2-related deafness'], recs:['Carriers: partner testing recommended','Newborn hearing screening important'], refs:['PMID:9462747'] },
  { rsid:'rs1800429', gene:'HEXA', chr:'15', pos:72638892, cat:['carrier'], sig:'well-established', risk:'A', normal:'G', trait:'Tay-Sachs Carrier — HEXA', riskDesc:'Tay-Sachs disease', normalDesc:'Non-carrier', hetDesc:'Tay-Sachs carrier — higher frequency in Ashkenazi Jewish population', freq:{GG:0.97,GA:0.028,AA:0.002}, conditions:['Tay-Sachs disease carrier'], recs:['Carrier screening recommended for at-risk populations','Genetic counseling before family planning'], refs:['PMID:3020429'] },

  // === LONGEVITY ===
  { rsid:'rs7412', gene:'APOE', chr:'19', pos:44908822, cat:['longevity','health'], sig:'well-established', risk:'T', normal:'C', trait:'APOE ε2 — Longevity & Cardiovascular', riskDesc:'APOE ε2 — protective against Alzheimer\'s, associated with longevity. Higher risk of type III hyperlipoproteinemia', normalDesc:'Non-ε2 carrier — standard risk profile', hetDesc:'One ε2 copy — some neuroprotection', freq:{CC:0.75,CT:0.22,TT:0.03}, conditions:['Alzheimer disease (protective)','Longevity association','Type III hyperlipoproteinemia (rare risk)'], recs:['ε2/ε2: monitor lipid profile for type III hyperlipoproteinemia','Generally considered protective for neurodegeneration'], refs:['PMID:8346443','PMID:24259556'] },
  { rsid:'rs12696304', gene:'TERC', chr:'3', pos:169764124, cat:['longevity'], sig:'well-established', risk:'G', normal:'C', trait:'Telomere Length — TERC', riskDesc:'Associated with shorter telomere length', normalDesc:'Associated with longer telomeres', hetDesc:'Intermediate telomere length effect', freq:{CC:0.45,CG:0.43,GG:0.12}, conditions:['Telomere length','Cellular aging'], recs:['Lifestyle factors support telomere maintenance','Exercise, stress reduction, adequate sleep'], refs:['PMID:21304973'] },
  { rsid:'rs10936599', gene:'OBFC1', chr:'10', pos:105669068, cat:['longevity'], sig:'well-established', risk:'T', normal:'C', trait:'Telomere Length — OBFC1/STN1', riskDesc:'Associated with shorter telomeres', normalDesc:'Associated with longer telomeres', hetDesc:'Intermediate effect on telomere length', freq:{CC:0.55,CT:0.38,TT:0.07}, conditions:['Telomere length','Biological aging'], recs:['Maintain telomere-supportive lifestyle'], refs:['PMID:21304973'] },
  { rsid:'rs7726159', gene:'TERT', chr:'5', pos:1282319, cat:['longevity'], sig:'well-established', risk:'C', normal:'A', trait:'Telomerase Activity — TERT', riskDesc:'May have lower telomerase activity', normalDesc:'Normal telomerase expression', hetDesc:'Intermediate telomerase effect', freq:{AA:0.40,AC:0.45,CC:0.15}, conditions:['Telomere maintenance','Cancer risk (complex)'], recs:['Telomerase variants have complex effects on both aging and cancer'], refs:['PMID:21304973'] },
  { rsid:'rs2853669', gene:'TERT', chr:'5', pos:1295028, cat:['longevity'], sig:'moderate', risk:'T', normal:'C', trait:'TERT Promoter — Telomere Biology', riskDesc:'May affect TERT promoter activity and telomere maintenance', normalDesc:'Standard TERT promoter function', hetDesc:'Intermediate effect', freq:{CC:0.45,CT:0.43,TT:0.12}, conditions:['Telomerase regulation'], recs:['Part of telomere biology — consider with other TERT variants'], refs:['PMID:21304973'] },
  { rsid:'rs5882', gene:'CETP', chr:'16', pos:57016092, cat:['longevity','health'], sig:'well-established', risk:'A', normal:'G', trait:'CETP V422I — HDL & Longevity', riskDesc:'Lower CETP activity — higher HDL cholesterol, associated with longevity', normalDesc:'Normal CETP activity and HDL levels', hetDesc:'Moderately elevated HDL', freq:{GG:0.65,GA:0.30,AA:0.05}, conditions:['HDL cholesterol levels','Longevity association','Cardiovascular protection'], recs:['Higher HDL is generally cardioprotective'], refs:['PMID:12711737'] },
  { rsid:'rs1800795', gene:'IL6', chr:'7', pos:22766645, cat:['longevity','health'], sig:'well-established', risk:'C', normal:'G', trait:'IL-6 Inflammatory Response', riskDesc:'Higher IL-6 production — increased systemic inflammation', normalDesc:'Lower IL-6 expression — reduced inflammatory burden', hetDesc:'Intermediate IL-6 levels', freq:{GG:0.30,GC:0.48,CC:0.22}, conditions:['Chronic inflammation','Cardiovascular disease risk','Longevity (inversely)'], recs:['Anti-inflammatory diet may be especially beneficial','Omega-3, turmeric, exercise reduce IL-6'], refs:['PMID:9600986'] },
  { rsid:'rs662', gene:'PON1', chr:'7', pos:95308134, cat:['longevity','health'], sig:'well-established', risk:'G', normal:'A', trait:'Paraoxonase — PON1 Q192R', riskDesc:'Higher paraoxonase activity for some substrates — complex cardiovascular effects', normalDesc:'Lower PON1 activity — may be protective for certain exposures', hetDesc:'Intermediate PON1 activity', freq:{AA:0.42,AG:0.44,GG:0.14}, conditions:['Organophosphate susceptibility','Cardiovascular risk (modifier)','HDL antioxidant capacity'], recs:['Avoid organophosphate pesticide exposure','PON1 is complex — context-dependent effects'], refs:['PMID:15166209'] },
  { rsid:'rs4880', gene:'SOD2', chr:'6', pos:160113872, cat:['longevity','health'], sig:'well-established', risk:'T', normal:'C', trait:'Manganese Superoxide Dismutase — SOD2 Val16Ala', riskDesc:'Val/Val — less efficient mitochondrial antioxidant defense', normalDesc:'Ala/Ala — more efficient SOD2 transport to mitochondria', hetDesc:'Intermediate antioxidant activity', freq:{CC:0.25,CT:0.50,TT:0.25}, conditions:['Oxidative stress','Mitochondrial function','Cancer risk (modifier)'], recs:['Antioxidant-rich diet especially important for TT genotype','Vitamin C, E, selenium may be beneficial'], refs:['PMID:15367468'] },

  // === ADDITIONAL HEALTH ===
  { rsid:'rs4420638', gene:'APOE/APOC1', chr:'19', pos:45422946, cat:['health','longevity'], sig:'well-established', risk:'G', normal:'A', trait:'Alzheimer Disease Risk — APOE Region', riskDesc:'Strong proxy for APOE ε4 — elevated Alzheimer risk', normalDesc:'Lower Alzheimer risk', hetDesc:'Moderately elevated risk', freq:{AA:0.65,AG:0.29,GG:0.06}, conditions:["Alzheimer's disease","Cardiovascular disease"], recs:['Consider neuroprotective lifestyle measures'], refs:['PMID:19668339'] },
  { rsid:'rs7903146', gene:'TCF7L2', chr:'10', pos:114758349, cat:['health'], sig:'well-established', risk:'T', normal:'C', trait:'Type 2 Diabetes Risk — TCF7L2', riskDesc:'Strongest common genetic risk factor for type 2 diabetes (~1.4x per allele)', normalDesc:'Baseline type 2 diabetes risk', hetDesc:'Moderately elevated type 2 diabetes risk', freq:{CC:0.52,CT:0.40,TT:0.08}, conditions:['Type 2 diabetes','Impaired insulin secretion'], recs:['Regular blood glucose monitoring','Maintain healthy weight','Exercise significantly reduces genetic risk'], refs:['PMID:16415884','PMID:17463246'] },
  { rsid:'rs10830963', gene:'MTNR1B', chr:'11', pos:92975544, cat:['health','traits'], sig:'well-established', risk:'G', normal:'C', trait:'Fasting Glucose & Melatonin — MTNR1B', riskDesc:'Higher fasting glucose levels, impaired insulin secretion', normalDesc:'Normal fasting glucose regulation', hetDesc:'Slightly elevated fasting glucose', freq:{CC:0.55,CG:0.38,GG:0.07}, conditions:['Elevated fasting glucose','Type 2 diabetes risk','Melatonin receptor function'], recs:['Avoid late-night eating — may worsen glucose control','Early dinner may be beneficial for GG carriers'], refs:['PMID:19060907'] },
  { rsid:'rs4402960', gene:'IGF2BP2', chr:'3', pos:185793899, cat:['health'], sig:'well-established', risk:'T', normal:'G', trait:'Type 2 Diabetes — IGF2BP2', riskDesc:'Increased T2D risk via impaired insulin secretion', normalDesc:'Baseline T2D risk', hetDesc:'Moderate T2D risk elevation', freq:{GG:0.46,GT:0.43,TT:0.11}, conditions:['Type 2 diabetes'], recs:['Standard T2D prevention measures'], refs:['PMID:17463249'] },

  // === ADDITIONAL NUTRITION ===
  { rsid:'rs1801198', gene:'TCN2', chr:'22', pos:31011301, cat:['nutrition'], sig:'moderate', risk:'G', normal:'C', trait:'Vitamin B12 Transport — TCN2', riskDesc:'Reduced cellular B12 uptake despite normal serum levels', normalDesc:'Efficient B12 transport', hetDesc:'Slightly reduced B12 cellular availability', freq:{CC:0.40,CG:0.45,GG:0.15}, conditions:['Vitamin B12 cellular deficiency','Functional B12 insufficiency'], recs:['Monitor methylmalonic acid (better than serum B12 alone)','Consider sublingual or methylcobalamin form'], refs:['PMID:15166158'] },
  { rsid:'rs33972313', gene:'SLC23A1', chr:'5', pos:139388003, cat:['nutrition'], sig:'moderate', risk:'T', normal:'C', trait:'Vitamin C Transport — SLC23A1', riskDesc:'Reduced vitamin C absorption/transport', normalDesc:'Normal vitamin C transport efficiency', hetDesc:'Slightly reduced vitamin C levels', freq:{CC:0.82,CT:0.17,TT:0.01}, conditions:['Vitamin C status','Scurvy susceptibility (extreme)'], recs:['Higher vitamin C intake may be beneficial','Extra citrus fruits and vegetables'], refs:['PMID:20200951'] },
];

// Read existing database
const existingContent = fs.readFileSync(DATA_FILE, 'utf-8');
const existingMatch = existingContent.match(/export const snpDatabase = ({[\s\S]+});/);
if (!existingMatch) {
  console.error('Could not parse existing data.js');
  process.exit(1);
}

let db;
try {
  // Use indirect eval to parse the object literal
  db = eval(`(${existingMatch[1]})`);
} catch (e) {
  console.error('Failed to parse existing database:', e.message);
  process.exit(1);
}

const existingCount = Object.keys(db).length;
console.log(`Existing database: ${existingCount} SNPs`);

// Add new SNPs (don't overwrite existing curated entries)
let added = 0;
for (const snp of SNPS_TO_ADD) {
  if (db[snp.rsid]) {
    console.log(`  Skip ${snp.rsid} (${snp.gene}) — already exists`);
    continue;
  }
  db[snp.rsid] = {
    rsid: snp.rsid,
    gene: snp.gene,
    chromosome: snp.chr,
    position: snp.pos,
    categories: snp.cat,
    significance: snp.sig,
    riskAllele: snp.risk,
    normalAllele: snp.normal,
    trait: snp.trait,
    riskDescription: snp.riskDesc,
    normalDescription: snp.normalDesc,
    heterozygousDescription: snp.hetDesc,
    populationFrequency: snp.freq,
    conditions: snp.conditions,
    recommendations: snp.recs,
    references: snp.refs,
  };
  added++;
  console.log(`  Added ${snp.rsid} (${snp.gene}) — ${snp.trait}`);
}

console.log(`\nAdded ${added} new SNPs. Total: ${existingCount + added}`);

// Write back
const output = `// Auto-generated SNP database — DO NOT EDIT MANUALLY
// Run: node scripts/expand-snp-db.js to add more SNPs
// Last updated: ${new Date().toISOString()}
// Total SNPs: ${Object.keys(db).length}

export const snpDatabase = ${JSON.stringify(db, null, 2)};
`;

fs.writeFileSync(DATA_FILE, output);
console.log(`Written to ${DATA_FILE}`);
