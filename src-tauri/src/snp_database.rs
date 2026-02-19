use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SnpInfo {
    pub rsid: String,
    pub gene: String,
    pub chromosome: String,
    pub position: u64,
    pub categories: Vec<String>,
    pub significance: String,
    pub risk_allele: String,
    pub normal_allele: String,
    pub trait_name: String,
    pub risk_description: String,
    pub normal_description: String,
    pub heterozygous_description: String,
    pub population_frequency: HashMap<String, f64>,
    pub conditions: Vec<String>,
    pub recommendations: Vec<String>,
    pub references: Vec<String>,
}

macro_rules! snp {
    ($rsid:expr, $gene:expr, $chr:expr, $pos:expr, $cats:expr, $sig:expr,
     $risk:expr, $normal:expr, $trait_name:expr,
     $risk_desc:expr, $normal_desc:expr, $het_desc:expr,
     $freqs:expr, $conds:expr, $recs:expr, $refs:expr) => {
        SnpInfo {
            rsid: $rsid.into(),
            gene: $gene.into(),
            chromosome: $chr.into(),
            position: $pos,
            categories: $cats.iter().map(|s: &&str| s.to_string()).collect(),
            significance: $sig.into(),
            risk_allele: $risk.into(),
            normal_allele: $normal.into(),
            trait_name: $trait_name.into(),
            risk_description: $risk_desc.into(),
            normal_description: $normal_desc.into(),
            heterozygous_description: $het_desc.into(),
            population_frequency: $freqs.iter().map(|(k, v): &(&str, f64)| (k.to_string(), *v)).collect(),
            conditions: $conds.iter().map(|s: &&str| s.to_string()).collect(),
            recommendations: $recs.iter().map(|s: &&str| s.to_string()).collect(),
            references: $refs.iter().map(|s: &&str| s.to_string()).collect(),
        }
    };
}

lazy_static! {
    pub static ref SNP_DB: HashMap<String, SnpInfo> = {
        let mut db = HashMap::new();

        // ============================================================
        // LONGEVITY & TELOMERE (15 SNPs)
        // ============================================================

        db.insert("rs2736100".into(), snp!(
            "rs2736100", "TERT", "5", 1286516,
            &["longevity"], "well-established", "C", "A",
            "Telomere Length — TERT",
            "Associated with shorter telomere length, potentially accelerated cellular aging",
            "Associated with longer telomere length and potentially slower cellular aging",
            "Intermediate telomere length association",
            &[("AA", 0.25), ("AC", 0.50), ("CC", 0.25)],
            &["Telomere length variation", "Cellular aging rate"],
            &["Consider lifestyle factors that support telomere health", "Regular exercise and stress management"],
            &["PMID:19412176", "PMID:21483790"]
        ));

        db.insert("rs7726159".into(), snp!(
            "rs7726159", "TERT", "5", 1287194,
            &["longevity"], "well-established", "C", "A",
            "Telomere Length — TERT promoter",
            "Associated with shorter telomeres and increased cancer susceptibility",
            "Longer telomere length, lower cancer risk from this variant",
            "Intermediate effect on telomere length",
            &[("AA", 0.36), ("AC", 0.48), ("CC", 0.16)],
            &["Telomere length", "Cancer susceptibility"],
            &["Antioxidant-rich diet supports telomere maintenance"],
            &["PMID:21483790", "PMID:23535729"]
        ));

        db.insert("rs2853669".into(), snp!(
            "rs2853669", "TERT", "5", 1295235,
            &["longevity"], "moderate", "C", "T",
            "TERT Promoter Variant",
            "Reduced TERT promoter activity, shorter telomeres",
            "Normal TERT promoter activity",
            "Mildly reduced TERT expression",
            &[("TT", 0.30), ("TC", 0.48), ("CC", 0.22)],
            &["Telomere maintenance", "TERT expression"],
            &["Stress reduction and adequate sleep support telomerase activity"],
            &["PMID:22426869"]
        ));

        db.insert("rs12696304".into(), snp!(
            "rs12696304", "TERC", "3", 169764643,
            &["longevity"], "well-established", "G", "C",
            "Telomere Length — TERC",
            "Shorter telomere length via reduced telomerase RNA component",
            "Normal telomere length maintenance",
            "Intermediate telomere length",
            &[("CC", 0.42), ("CG", 0.44), ("GG", 0.14)],
            &["Telomere length", "Telomerase RNA component"],
            &["Maintain healthy lifestyle to support telomere integrity"],
            &["PMID:20585627", "PMID:21483790"]
        ));

        db.insert("rs10936599".into(), snp!(
            "rs10936599", "OBFC1", "10", 105676086,
            &["longevity"], "well-established", "C", "T",
            "Telomere Length — OBFC1",
            "Associated with shorter telomeres",
            "Associated with longer telomeres",
            "Intermediate telomere length effect",
            &[("TT", 0.25), ("TC", 0.50), ("CC", 0.25)],
            &["Telomere length regulation"],
            &["Regular cardiovascular exercise supports telomere health"],
            &["PMID:20585627"]
        ));

        db.insert("rs2802292".into(), snp!(
            "rs2802292", "FOXO3", "6", 108973560,
            &["longevity"], "well-established", "T", "G",
            "Longevity — FOXO3",
            "Common genotype, no longevity advantage",
            "G allele strongly associated with exceptional longevity in multiple populations",
            "One copy of the longevity-associated allele, moderate benefit",
            &[("TT", 0.56), ("TG", 0.37), ("GG", 0.07)],
            &["Longevity association", "Insulin/IGF-1 signaling"],
            &["Caloric moderation supports FOXO3 pathway activation"],
            &["PMID:18765803", "PMID:19197348"]
        ));

        db.insert("rs429358".into(), snp!(
            "rs429358", "APOE", "19", 44908684,
            &["longevity", "health"], "well-established", "C", "T",
            "APOE ε4 — Alzheimer's & Cardiovascular Risk",
            "APOE ε4 carrier — significantly elevated risk for late-onset Alzheimer's disease and cardiovascular disease",
            "Non-ε4 genotype — baseline population risk for Alzheimer's",
            "One copy of ε4 — moderately elevated Alzheimer's risk (3x baseline)",
            &[("TT", 0.60), ("TC", 0.30), ("CC", 0.10)],
            &["Late-onset Alzheimer's disease", "Cardiovascular disease", "Longevity (negative)"],
            &["Regular cardiovascular exercise is strongly protective", "Mediterranean diet associated with reduced risk", "DHA/omega-3 supplementation may be beneficial", "Regular cognitive assessment after age 50"],
            &["PMID:8346443", "PMID:19668339", "PMID:24259556"]
        ));

        db.insert("rs7412".into(), snp!(
            "rs7412", "APOE", "19", 44908822,
            &["longevity", "health"], "well-established", "T", "C",
            "APOE ε2 — Longevity & Lipid Metabolism",
            "APOE ε2 homozygous — rare, risk of type III hyperlipoproteinemia",
            "Common genotype, baseline cardiovascular risk",
            "One ε2 copy — generally cardioprotective, associated with longevity",
            &[("CC", 0.77), ("CT", 0.21), ("TT", 0.02)],
            &["Longevity association", "Type III hyperlipoproteinemia", "Lipid metabolism"],
            &["ε2 carriers generally have favorable lipid profiles", "Monitor lipids if ε2/ε2 homozygous"],
            &["PMID:8346443", "PMID:17474819"]
        ));

        db.insert("rs5882".into(), snp!(
            "rs5882", "CETP", "16", 57017319,
            &["longevity", "health"], "moderate", "G", "A",
            "Longevity — CETP I405V",
            "Lower HDL cholesterol, standard cardiovascular risk",
            "Higher HDL cholesterol, associated with exceptional longevity",
            "Intermediate HDL levels",
            &[("AA", 0.36), ("AG", 0.48), ("GG", 0.16)],
            &["HDL cholesterol levels", "Cardiovascular health", "Longevity"],
            &["Regular exercise raises HDL regardless of genotype"],
            &["PMID:14532325", "PMID:18451330"]
        ));

        db.insert("rs1800795".into(), snp!(
            "rs1800795", "IL6", "7", 22766645,
            &["longevity", "health"], "moderate", "C", "G",
            "Inflammation — IL-6 Promoter",
            "Higher IL-6 expression, increased systemic inflammation",
            "Lower IL-6 levels, reduced chronic inflammation",
            "Intermediate IL-6 expression",
            &[("GG", 0.25), ("GC", 0.50), ("CC", 0.25)],
            &["Chronic inflammation", "Cardiovascular disease risk", "Longevity"],
            &["Anti-inflammatory diet (omega-3, turmeric)", "Regular moderate exercise reduces IL-6"],
            &["PMID:9989409", "PMID:15114530"]
        ));

        db.insert("rs662".into(), snp!(
            "rs662", "PON1", "7", 94937446,
            &["longevity", "health"], "moderate", "A", "G",
            "Oxidative Stress — PON1 Q192R",
            "Reduced paraoxonase activity, decreased LDL protection",
            "Higher paraoxonase activity, better LDL oxidation protection",
            "Intermediate paraoxonase activity",
            &[("GG", 0.50), ("GA", 0.40), ("AA", 0.10)],
            &["LDL oxidation", "Cardiovascular disease", "Organophosphate metabolism"],
            &["Antioxidant-rich diet", "Avoid organophosphate pesticide exposure"],
            &["PMID:9603939", "PMID:16267138"]
        ));

        db.insert("rs4880".into(), snp!(
            "rs4880", "SOD2", "6", 160113872,
            &["longevity", "health"], "well-established", "T", "C",
            "Oxidative Stress — SOD2 A16V",
            "Reduced mitochondrial antioxidant defense, increased oxidative stress",
            "Efficient mitochondrial superoxide dismutase, good oxidative stress protection",
            "Intermediate SOD2 activity",
            &[("CC", 0.25), ("CT", 0.50), ("TT", 0.25)],
            &["Oxidative stress", "Mitochondrial function", "Cancer risk"],
            &["Antioxidant supplementation (vitamin C, E) may help TT genotype", "CoQ10 supplementation supports mitochondrial function"],
            &["PMID:10733994", "PMID:15726595"]
        ));

        db.insert("rs1001179".into(), snp!(
            "rs1001179", "CAT", "11", 34460128,
            &["longevity"], "moderate", "T", "C",
            "Catalase Activity — CAT",
            "Reduced catalase expression, less hydrogen peroxide detoxification",
            "Normal catalase activity",
            "Slightly reduced catalase expression",
            &[("CC", 0.65), ("CT", 0.30), ("TT", 0.05)],
            &["Oxidative stress defense", "Hydrogen peroxide metabolism"],
            &["Dietary catalase sources: fruits and vegetables"],
            &["PMID:12815718"]
        ));

        db.insert("rs7895833".into(), snp!(
            "rs7895833", "SIRT1", "10", 69644213,
            &["longevity"], "moderate", "G", "A",
            "Longevity — SIRT1",
            "Reduced SIRT1 expression, less caloric restriction benefit",
            "Higher SIRT1 expression, enhanced cellular stress response",
            "Intermediate SIRT1 activity",
            &[("AA", 0.55), ("AG", 0.38), ("GG", 0.07)],
            &["Caloric restriction response", "Cellular aging", "NAD+ metabolism"],
            &["Intermittent fasting may activate SIRT1 pathway", "NAD+ precursors (NMN, NR) under research"],
            &["PMID:22882745"]
        ));

        db.insert("rs1042522".into(), snp!(
            "rs1042522", "TP53", "17", 7676154,
            &["longevity", "health"], "well-established", "C", "G",
            "Cancer Defense — TP53 P72R",
            "Pro72 variant — more efficient apoptosis but may accelerate aging",
            "Arg72 variant — enhanced DNA repair, may favor longevity",
            "Heterozygous — balanced apoptosis and DNA repair",
            &[("GG", 0.40), ("GC", 0.45), ("CC", 0.15)],
            &["Cancer susceptibility", "Apoptosis efficiency", "Longevity"],
            &["Regular cancer screening recommended", "Antioxidant-rich diet"],
            &["PMID:12640109", "PMID:19367580"]
        ));

        // ============================================================
        // HEALTH & DISEASE RISK (25 SNPs)
        // ============================================================

        db.insert("rs1333049".into(), snp!(
            "rs1333049", "CDKN2B-AS1", "9", 22125503,
            &["health"], "well-established", "C", "G",
            "Coronary Artery Disease — 9p21",
            "Significantly elevated coronary artery disease risk (~1.6x for CC)",
            "Baseline coronary artery disease risk",
            "Moderately elevated CAD risk (~1.3x)",
            &[("GG", 0.25), ("GC", 0.50), ("CC", 0.25)],
            &["Coronary artery disease", "Myocardial infarction"],
            &["Regular cardiovascular screening", "Maintain healthy lipid levels", "Don't smoke"],
            &["PMID:17478679", "PMID:17554300"]
        ));

        db.insert("rs10757278".into(), snp!(
            "rs10757278", "CDKN2B-AS1", "9", 22124477,
            &["health"], "well-established", "G", "A",
            "Heart Disease Risk — 9p21.3",
            "Increased risk of coronary heart disease and myocardial infarction",
            "Baseline heart disease risk from this locus",
            "Moderately elevated heart disease risk",
            &[("AA", 0.30), ("AG", 0.48), ("GG", 0.22)],
            &["Coronary heart disease", "Myocardial infarction"],
            &["Regular cardiovascular exercise", "Heart-healthy diet"],
            &["PMID:17478679"]
        ));

        db.insert("rs4977574".into(), snp!(
            "rs4977574", "CDKN2B-AS1", "9", 22098574,
            &["health"], "well-established", "G", "A",
            "Coronary Artery Disease — 9p21 Region",
            "Elevated CAD risk from 9p21 haplotype",
            "Lower risk from this 9p21 variant",
            "Intermediate CAD risk",
            &[("AA", 0.28), ("AG", 0.49), ("GG", 0.23)],
            &["Coronary artery disease"],
            &["Lipid panel monitoring", "Statin therapy discussion with physician if multiple risk factors"],
            &["PMID:17554300", "PMID:19198609"]
        ));

        db.insert("rs7903146".into(), snp!(
            "rs7903146", "TCF7L2", "10", 114758349,
            &["health"], "well-established", "T", "C",
            "Type 2 Diabetes Risk — TCF7L2",
            "Strongest known common genetic risk factor for type 2 diabetes (~1.4x per allele)",
            "Baseline type 2 diabetes risk from this gene",
            "Moderately elevated type 2 diabetes risk (~1.4x)",
            &[("CC", 0.52), ("CT", 0.40), ("TT", 0.08)],
            &["Type 2 diabetes", "Impaired insulin secretion"],
            &["Regular blood glucose monitoring", "Maintain healthy weight", "Regular exercise significantly reduces genetic risk", "Mediterranean or low-glycemic diet"],
            &["PMID:16415884", "PMID:17463246"]
        ));

        db.insert("rs1801282".into(), snp!(
            "rs1801282", "PPARG", "3", 12393125,
            &["health"], "well-established", "G", "C",
            "Type 2 Diabetes Protection — PPARG Pro12Ala",
            "Standard PPARG activity, baseline diabetes risk",
            "Ala12 variant — reduced diabetes risk, improved insulin sensitivity",
            "One Ala12 copy — moderate diabetes protection",
            &[("CC", 0.75), ("CG", 0.23), ("GG", 0.02)],
            &["Type 2 diabetes", "Insulin sensitivity", "Adipogenesis"],
            &["G allele carriers may benefit more from dietary fat reduction"],
            &["PMID:10612833", "PMID:17259405"]
        ));

        db.insert("rs10811661".into(), snp!(
            "rs10811661", "CDKN2A/2B", "9", 22134094,
            &["health"], "well-established", "T", "C",
            "Type 2 Diabetes Risk — CDKN2A/2B",
            "Increased type 2 diabetes risk (~1.2x per allele)",
            "Baseline diabetes risk",
            "Slightly elevated diabetes risk",
            &[("CC", 0.15), ("CT", 0.45), ("TT", 0.40)],
            &["Type 2 diabetes", "Beta cell function"],
            &["Monitor fasting glucose", "Regular physical activity"],
            &["PMID:17463248", "PMID:17554260"]
        ));

        db.insert("rs2187668".into(), snp!(
            "rs2187668", "HLA-DQ2.5", "6", 32713854,
            &["health"], "well-established", "T", "C",
            "Celiac Disease Risk — HLA-DQ2.5",
            "HLA-DQ2.5 positive — major genetic risk factor for celiac disease",
            "HLA-DQ2.5 negative — very low celiac disease risk",
            "HLA-DQ2.5 heterozygous — elevated celiac risk, especially with DQ8",
            &[("CC", 0.75), ("CT", 0.22), ("TT", 0.03)],
            &["Celiac disease", "Gluten sensitivity", "Autoimmune disorders"],
            &["Consider celiac screening if symptoms present", "Gluten-free diet if diagnosed"],
            &["PMID:18311140", "PMID:20190752"]
        ));

        db.insert("rs9939609".into(), snp!(
            "rs9939609", "FTO", "16", 53820527,
            &["health", "nutrition"], "well-established", "A", "T",
            "Obesity Risk — FTO",
            "Higher BMI on average (+3 kg), increased obesity risk",
            "Baseline obesity risk from this gene",
            "Slightly elevated BMI on average (+1.5 kg)",
            &[("TT", 0.37), ("AT", 0.46), ("AA", 0.17)],
            &["Obesity risk", "BMI variation", "Type 2 diabetes risk (indirect)"],
            &["Regular physical activity especially important", "High-protein diet may counteract FTO effect"],
            &["PMID:17434869", "PMID:23290989"]
        ));

        db.insert("rs334".into(), snp!(
            "rs334", "HBB", "11", 5227002,
            &["carrier", "health"], "well-established", "T", "A",
            "Sickle Cell Trait/Disease — HBB",
            "Sickle cell disease — two copies cause severe hemolytic anemia",
            "Normal hemoglobin, no sickle cell risk",
            "Sickle cell trait carrier — generally asymptomatic, provides malaria resistance",
            &[("AA", 0.92), ("AT", 0.07), ("TT", 0.01)],
            &["Sickle cell disease", "Sickle cell trait", "Malaria resistance (carriers)"],
            &["Carriers: genetic counseling before family planning", "Carriers: inform healthcare providers for surgical/anesthesia contexts", "TT: requires specialized hematologic care"],
            &["PMID:20301551"]
        ));

        db.insert("rs6025".into(), snp!(
            "rs6025", "F5", "1", 169519049,
            &["health"], "well-established", "T", "C",
            "Factor V Leiden — Thrombophilia",
            "Homozygous Factor V Leiden — very high thrombosis risk (50-80x)",
            "Normal Factor V — baseline clotting risk",
            "Heterozygous Factor V Leiden — elevated thrombosis risk (5-7x)",
            &[("CC", 0.95), ("CT", 0.048), ("TT", 0.002)],
            &["Deep vein thrombosis", "Pulmonary embolism", "Thrombophilia"],
            &["Avoid prolonged immobility", "Discuss with doctor before oral contraceptives or HRT", "Compression stockings for long flights"],
            &["PMID:7989540", "PMID:19357397"]
        ));

        db.insert("rs1799963".into(), snp!(
            "rs1799963", "F2", "11", 46761055,
            &["health"], "well-established", "A", "G",
            "Prothrombin G20210A — Thrombosis Risk",
            "Elevated prothrombin levels, 3-5x increased venous thrombosis risk",
            "Normal prothrombin levels",
            "Mildly elevated prothrombin, ~2.5x thrombosis risk",
            &[("GG", 0.97), ("GA", 0.028), ("AA", 0.002)],
            &["Venous thromboembolism", "Stroke risk"],
            &["Inform healthcare providers", "Exercise and hydration reduce clotting risk"],
            &["PMID:8652298"]
        ));

        db.insert("rs1799971".into(), snp!(
            "rs1799971", "OPRM1", "6", 154360797,
            &["health", "pharma"], "well-established", "G", "A",
            "Opioid Sensitivity — OPRM1 A118G",
            "Reduced opioid receptor binding — may need higher doses for pain relief, higher addiction risk",
            "Normal opioid receptor function",
            "Intermediate opioid sensitivity",
            &[("AA", 0.72), ("AG", 0.25), ("GG", 0.03)],
            &["Opioid response", "Pain sensitivity", "Addiction risk"],
            &["Inform anesthesiologist of genotype", "Consider non-opioid pain management"],
            &["PMID:9399694", "PMID:15590110"]
        ));

        db.insert("rs1800497".into(), snp!(
            "rs1800497", "ANKK1/DRD2", "11", 113400106,
            &["health"], "moderate", "T", "C",
            "Dopamine Receptor — DRD2/ANKK1 Taq1A",
            "Reduced dopamine D2 receptor density — reward deficiency, higher addiction susceptibility",
            "Normal dopamine D2 receptor density",
            "Mildly reduced D2 receptor density",
            &[("CC", 0.55), ("CT", 0.38), ("TT", 0.07)],
            &["Addiction susceptibility", "Reward processing", "Dopamine signaling"],
            &["Awareness of addiction vulnerability", "Regular exercise boosts dopamine naturally"],
            &["PMID:2234301", "PMID:17892549"]
        ));

        db.insert("rs1800629".into(), snp!(
            "rs1800629", "TNF", "6", 31575254,
            &["health"], "moderate", "A", "G",
            "TNF-alpha Inflammation",
            "Higher TNF-alpha expression, increased inflammatory response",
            "Normal TNF-alpha levels",
            "Mildly elevated TNF-alpha",
            &[("GG", 0.75), ("GA", 0.23), ("AA", 0.02)],
            &["Chronic inflammation", "Autoimmune disease susceptibility", "Sepsis risk"],
            &["Anti-inflammatory lifestyle", "Omega-3 fatty acids"],
            &["PMID:8563952"]
        ));

        db.insert("rs12255372".into(), snp!(
            "rs12255372", "TCF7L2", "10", 114808902,
            &["health"], "well-established", "T", "G",
            "Type 2 Diabetes — TCF7L2 (second variant)",
            "Elevated T2D risk",
            "Baseline risk",
            "Moderately elevated T2D risk",
            &[("GG", 0.55), ("GT", 0.38), ("TT", 0.07)],
            &["Type 2 diabetes"],
            &["Blood glucose monitoring", "Low-glycemic diet"],
            &["PMID:16415884"]
        ));

        db.insert("rs1800896".into(), snp!(
            "rs1800896", "IL10", "1", 206946897,
            &["health"], "moderate", "A", "G",
            "Anti-inflammatory Response — IL-10",
            "Lower IL-10 production, reduced anti-inflammatory capacity",
            "Higher IL-10 production, better inflammation regulation",
            "Intermediate IL-10 levels",
            &[("GG", 0.27), ("GA", 0.49), ("AA", 0.24)],
            &["Inflammatory regulation", "Autoimmune disease"],
            &["Anti-inflammatory diet supportive"],
            &["PMID:9553622"]
        ));

        db.insert("rs2228145".into(), snp!(
            "rs2228145", "IL6R", "1", 154426970,
            &["health"], "moderate", "C", "A",
            "IL-6 Signaling — IL6R Asp358Ala",
            "Altered IL-6 signaling, complex effects on inflammation",
            "Standard IL-6 receptor signaling",
            "Intermediate effect",
            &[("AA", 0.40), ("AC", 0.45), ("CC", 0.15)],
            &["Coronary heart disease", "Rheumatoid arthritis", "IL-6 signaling"],
            &["Monitor inflammatory markers"],
            &["PMID:22158537"]
        ));

        db.insert("rs1801394".into(), snp!(
            "rs1801394", "MTRR", "5", 7870860,
            &["health", "nutrition"], "moderate", "G", "A",
            "Methionine Synthase Reductase — MTRR A66G",
            "Reduced MTRR activity, impaired B12 regeneration",
            "Normal MTRR function",
            "Mildly reduced MTRR activity",
            &[("AA", 0.32), ("AG", 0.49), ("GG", 0.19)],
            &["Homocysteine metabolism", "B12 utilization", "Neural tube defects"],
            &["Adequate B12 intake", "Consider methylcobalamin form"],
            &["PMID:12375236"]
        ));

        db.insert("rs1805087".into(), snp!(
            "rs1805087", "MTR", "1", 236885200,
            &["health", "nutrition"], "moderate", "G", "A",
            "Methionine Synthase — MTR A2756G",
            "Altered methionine synthase, impacts homocysteine and methylation",
            "Normal methionine synthase function",
            "Mildly altered methionine synthase",
            &[("AA", 0.66), ("AG", 0.30), ("GG", 0.04)],
            &["Homocysteine levels", "Methylation cycle"],
            &["Ensure adequate folate and B12"],
            &["PMID:10090914"]
        ));

        db.insert("rs1695".into(), snp!(
            "rs1695", "GSTP1", "11", 67352689,
            &["health"], "moderate", "G", "A",
            "Detoxification — GSTP1 I105V",
            "Reduced glutathione S-transferase activity, impaired detox",
            "Normal GSTP1 enzyme activity, efficient Phase II detox",
            "Mildly reduced detoxification capacity",
            &[("AA", 0.48), ("AG", 0.42), ("GG", 0.10)],
            &["Detoxification capacity", "Chemical sensitivity", "Cancer risk"],
            &["Cruciferous vegetables support glutathione production", "N-acetyl cysteine (NAC) supplementation"],
            &["PMID:10987269"]
        ));

        db.insert("rs4680".into(), snp!(
            "rs4680", "COMT", "22", 19963748,
            &["health"], "well-established", "A", "G",
            "COMT Val158Met — Dopamine/Stress",
            "Met/Met (AA) — slow COMT, higher dopamine, better cognition but more stress vulnerability (worrier)",
            "Val/Val (GG) — fast COMT, lower dopamine, stress resilient but lower working memory (warrior)",
            "Val/Met — balanced dopamine metabolism",
            &[("GG", 0.25), ("GA", 0.50), ("AA", 0.25)],
            &["Stress response", "Cognitive performance", "Pain sensitivity", "Estrogen metabolism"],
            &["AA genotype: stress management techniques important", "GG genotype: cognitive challenges may enhance focus"],
            &["PMID:14615048", "PMID:17008817"]
        ));

        db.insert("rs53576".into(), snp!(
            "rs53576", "OXTR", "3", 8804371,
            &["traits", "health"], "moderate", "A", "G",
            "Empathy & Social Behavior — OXTR",
            "AA genotype — lower empathy scores, less social sensitivity",
            "GG genotype — higher empathy, greater social sensitivity and stress reactivity",
            "Intermediate social sensitivity",
            &[("GG", 0.40), ("GA", 0.44), ("AA", 0.16)],
            &["Social behavior", "Empathy", "Stress reactivity"],
            &["Social connection and community support beneficial for all genotypes"],
            &["PMID:19934046", "PMID:21928854"]
        ));

        db.insert("rs4420638".into(), snp!(
            "rs4420638", "APOC1", "19", 45422946,
            &["health", "longevity"], "well-established", "G", "A",
            "Alzheimer's & Lipid Risk — APOC1",
            "Elevated Alzheimer's and cardiovascular risk (LD with APOE ε4)",
            "Baseline risk",
            "Moderately elevated risk",
            &[("AA", 0.60), ("AG", 0.33), ("GG", 0.07)],
            &["Alzheimer's disease", "Lipid metabolism"],
            &["Cardiovascular risk management", "Cognitive screening"],
            &["PMID:19360597"]
        ));

        db.insert("rs1800544".into(), snp!(
            "rs1800544", "ADRA2A", "10", 112838947,
            &["health"], "moderate", "C", "G",
            "ADHD & Autonomic Function — ADRA2A",
            "Associated with ADHD susceptibility, altered norepinephrine signaling",
            "Typical adrenergic receptor function",
            "Mild effect on attention regulation",
            &[("GG", 0.45), ("GC", 0.42), ("CC", 0.13)],
            &["ADHD", "Autonomic nervous system"],
            &["Structured routines and exercise help attention"],
            &["PMID:10591883"]
        ));

        // ============================================================
        // PHARMACOGENOMICS (20 SNPs)
        // ============================================================

        db.insert("rs762551".into(), snp!(
            "rs762551", "CYP1A2", "15", 75041917,
            &["pharma", "nutrition"], "well-established", "C", "A",
            "Caffeine Metabolism — CYP1A2",
            "Slow caffeine metabolizer — caffeine stays in system longer, increased cardiovascular risk with high coffee intake",
            "Fast caffeine metabolizer — caffeine processed quickly, coffee may be cardioprotective",
            "Intermediate caffeine metabolism",
            &[("AA", 0.46), ("AC", 0.44), ("CC", 0.10)],
            &["Caffeine metabolism rate", "Coffee-related cardiovascular risk"],
            &["Slow metabolizers: limit to 1-2 cups coffee/day", "Avoid caffeine after noon if slow metabolizer"],
            &["PMID:16522833", "PMID:18349528"]
        ));

        db.insert("rs3892097".into(), snp!(
            "rs3892097", "CYP2D6", "22", 42523610,
            &["pharma"], "well-established", "A", "G",
            "Drug Metabolism — CYP2D6*4",
            "CYP2D6 poor metabolizer — many drugs ineffective or toxic at standard doses",
            "Normal CYP2D6 metabolism — standard drug dosing appropriate",
            "Intermediate CYP2D6 metabolism — may need dose adjustment",
            &[("GG", 0.72), ("GA", 0.25), ("AA", 0.03)],
            &["Codeine metabolism", "Tamoxifen activation", "Antidepressant metabolism", "Beta-blocker metabolism"],
            &["Codeine will be ineffective — use alternative analgesics", "Tamoxifen may not be activated — discuss alternatives", "Inform all prescribing physicians"],
            &["PMID:16958828", "PMID:19169314"]
        ));

        db.insert("rs1065852".into(), snp!(
            "rs1065852", "CYP2D6", "22", 42526694,
            &["pharma"], "well-established", "A", "G",
            "Drug Metabolism — CYP2D6*10",
            "Reduced CYP2D6 activity — common in East Asian populations",
            "Normal CYP2D6 function",
            "Slightly reduced CYP2D6 activity",
            &[("GG", 0.55), ("GA", 0.37), ("AA", 0.08)],
            &["Drug metabolism", "CYP2D6 substrate drugs"],
            &["May need dose reduction for CYP2D6 substrates"],
            &["PMID:16958828"]
        ));

        db.insert("rs4244285".into(), snp!(
            "rs4244285", "CYP2C19", "10", 96541616,
            &["pharma"], "well-established", "A", "G",
            "Clopidogrel Response — CYP2C19*2",
            "CYP2C19 poor metabolizer — clopidogrel (Plavix) will be ineffective, FDA boxed warning",
            "Normal CYP2C19 — standard clopidogrel activation",
            "Intermediate CYP2C19 — reduced clopidogrel efficacy",
            &[("GG", 0.73), ("GA", 0.24), ("AA", 0.03)],
            &["Clopidogrel (Plavix) response", "Proton pump inhibitor metabolism", "Antidepressant metabolism"],
            &["FDA boxed warning: poor metabolizers should use alternative antiplatelet", "Consider prasugrel or ticagrelor instead", "PPI dose adjustment may be needed"],
            &["PMID:19106084", "PMID:20083681"]
        ));

        db.insert("rs12248560".into(), snp!(
            "rs12248560", "CYP2C19", "10", 96521657,
            &["pharma"], "well-established", "T", "C",
            "CYP2C19 Ultrarapid Metabolizer — *17",
            "CYP2C19 ultrarapid metabolizer — increased drug activation, clopidogrel may be more effective but higher bleeding risk",
            "Normal CYP2C19 metabolism",
            "Rapid CYP2C19 metabolism",
            &[("CC", 0.60), ("CT", 0.34), ("TT", 0.06)],
            &["Clopidogrel enhanced response", "Proton pump inhibitor reduced efficacy", "Voriconazole reduced efficacy"],
            &["May need lower doses of CYP2C19-activated prodrugs", "PPIs may be less effective"],
            &["PMID:17643090", "PMID:20083681"]
        ));

        db.insert("rs9923231".into(), snp!(
            "rs9923231", "VKORC1", "16", 31107689,
            &["pharma"], "well-established", "T", "C",
            "Warfarin Sensitivity — VKORC1",
            "High warfarin sensitivity — requires significantly lower doses (FDA-labeled)",
            "Standard warfarin metabolism — typical dosing",
            "Intermediate warfarin sensitivity — may need dose adjustment",
            &[("CC", 0.37), ("CT", 0.45), ("TT", 0.18)],
            &["Warfarin dose requirement", "Bleeding risk with anticoagulants"],
            &["Inform prescribing physician before starting warfarin", "FDA recommends genotype-guided dosing"],
            &["PMID:15930419", "PMID:17906972"]
        ));

        db.insert("rs4149056".into(), snp!(
            "rs4149056", "SLCO1B1", "12", 21331549,
            &["pharma"], "well-established", "C", "T",
            "Statin Myopathy Risk — SLCO1B1",
            "High risk of statin-induced myopathy, especially with simvastatin (FDA-labeled)",
            "Normal statin transport — standard myopathy risk",
            "Intermediate myopathy risk — consider lower statin dose",
            &[("TT", 0.68), ("TC", 0.29), ("CC", 0.03)],
            &["Statin-induced myopathy", "Simvastatin toxicity"],
            &["Avoid high-dose simvastatin (80mg)", "Consider alternative statins (rosuvastatin, pravastatin)", "Report any muscle pain to physician immediately"],
            &["PMID:18650507", "PMID:21178985"]
        ));

        db.insert("rs1799853".into(), snp!(
            "rs1799853", "CYP2C9", "10", 96702047,
            &["pharma"], "well-established", "T", "C",
            "Drug Metabolism — CYP2C9*2",
            "Reduced CYP2C9 activity — affects warfarin, NSAIDs, sulfonylureas",
            "Normal CYP2C9 metabolism",
            "Mildly reduced CYP2C9 activity",
            &[("CC", 0.80), ("CT", 0.18), ("TT", 0.02)],
            &["Warfarin metabolism", "NSAID metabolism", "Sulfonylurea metabolism"],
            &["Lower warfarin doses likely needed", "Monitor for NSAID side effects"],
            &["PMID:14616350", "PMID:15175716"]
        ));

        db.insert("rs1057910".into(), snp!(
            "rs1057910", "CYP2C9", "10", 96741053,
            &["pharma"], "well-established", "C", "A",
            "Drug Metabolism — CYP2C9*3",
            "Severely reduced CYP2C9 activity — major impact on warfarin and NSAID metabolism",
            "Normal CYP2C9 metabolism",
            "Moderately reduced CYP2C9 activity",
            &[("AA", 0.86), ("AC", 0.13), ("CC", 0.01)],
            &["Warfarin sensitivity", "NSAID toxicity risk"],
            &["Significant warfarin dose reduction needed", "NSAID dose adjustment"],
            &["PMID:14616350"]
        ));

        db.insert("rs3918290".into(), snp!(
            "rs3918290", "DPYD", "1", 97915614,
            &["pharma"], "well-established", "A", "G",
            "5-FU Toxicity — DPYD*2A",
            "DPD deficient — life-threatening toxicity from fluoropyrimidines (5-FU, capecitabine). CONTRAINDICATED.",
            "Normal DPD activity — standard fluoropyrimidine metabolism",
            "Partial DPD deficiency — significantly increased 5-FU toxicity risk, dose reduction required",
            &[("GG", 0.97), ("GA", 0.028), ("AA", 0.002)],
            &["Fluoropyrimidine toxicity", "5-FU/capecitabine contraindication"],
            &["CRITICAL: Pre-treatment DPYD testing before 5-FU or capecitabine", "Heterozygous: 50% dose reduction minimum", "Homozygous: CONTRAINDICATED"],
            &["PMID:11129109", "PMID:24648345"]
        ));

        db.insert("rs8175347".into(), snp!(
            "rs8175347", "UGT1A1", "2", 234668879,
            &["pharma"], "well-established", "A", "G",
            "Gilbert's Syndrome / Irinotecan Toxicity — UGT1A1*28",
            "UGT1A1*28 homozygous — Gilbert's syndrome, high risk of irinotecan toxicity",
            "Normal bilirubin conjugation",
            "Intermediate UGT1A1 activity, mild bilirubin elevation possible",
            &[("GG", 0.45), ("GA", 0.42), ("AA", 0.13)],
            &["Gilbert's syndrome", "Irinotecan toxicity", "Bilirubin metabolism"],
            &["Irinotecan dose reduction if homozygous", "Mild jaundice during illness/fasting is benign"],
            &["PMID:15470219", "PMID:19384296"]
        ));

        db.insert("rs2740574".into(), snp!(
            "rs2740574", "CYP3A4", "7", 99784473,
            &["pharma"], "moderate", "G", "A",
            "Drug Metabolism — CYP3A4*1B",
            "Altered CYP3A4 expression — may affect metabolism of ~50% of drugs",
            "Normal CYP3A4 expression",
            "Mildly altered CYP3A4 activity",
            &[("AA", 0.82), ("AG", 0.16), ("GG", 0.02)],
            &["Broad drug metabolism", "Immunosuppressant dosing", "Statin metabolism"],
            &["Relevant for tacrolimus, cyclosporine dosing"],
            &["PMID:11306685"]
        ));

        db.insert("rs4986893".into(), snp!(
            "rs4986893", "CYP2C19", "10", 96540410,
            &["pharma"], "well-established", "A", "G",
            "Drug Metabolism — CYP2C19*3",
            "Non-functional CYP2C19 — poor metabolizer status (common in East Asians)",
            "Normal CYP2C19 function",
            "Intermediate CYP2C19 activity",
            &[("GG", 0.94), ("GA", 0.06), ("AA", 0.002)],
            &["Clopidogrel activation", "Proton pump inhibitor metabolism"],
            &["Alternative antiplatelet therapy if poor metabolizer"],
            &["PMID:19106084"]
        ));

        db.insert("rs28399504".into(), snp!(
            "rs28399504", "CYP2C19", "10", 96522463,
            &["pharma"], "well-established", "G", "A",
            "Drug Metabolism — CYP2C19*4",
            "Non-functional CYP2C19 allele",
            "Normal CYP2C19",
            "Reduced CYP2C19 function",
            &[("AA", 0.97), ("AG", 0.03), ("GG", 0.001)],
            &["CYP2C19 poor metabolizer"],
            &["Check composite CYP2C19 status with other variants"],
            &["PMID:19106084"]
        ));

        db.insert("rs1128503".into(), snp!(
            "rs1128503", "ABCB1", "7", 87138645,
            &["pharma"], "moderate", "T", "C",
            "Drug Transport — ABCB1/MDR1 C1236T",
            "Altered P-glycoprotein expression — may affect drug absorption/distribution",
            "Normal P-glycoprotein function",
            "Intermediate P-glycoprotein activity",
            &[("CC", 0.35), ("CT", 0.47), ("TT", 0.18)],
            &["Drug bioavailability", "Blood-brain barrier drug transport"],
            &["May affect digoxin, cyclosporine, and HIV protease inhibitor levels"],
            &["PMID:12844134"]
        ));

        db.insert("rs1045642".into(), snp!(
            "rs1045642", "ABCB1", "7", 87160618,
            &["pharma"], "moderate", "T", "C",
            "Drug Transport — ABCB1/MDR1 C3435T",
            "Reduced P-glycoprotein expression — increased drug bioavailability",
            "Normal P-glycoprotein — standard drug transport",
            "Intermediate P-glycoprotein activity",
            &[("CC", 0.32), ("CT", 0.48), ("TT", 0.20)],
            &["Drug absorption", "Digoxin levels", "Immunosuppressant dosing"],
            &["Drug level monitoring may be warranted for narrow therapeutic index drugs"],
            &["PMID:11001926", "PMID:12844134"]
        ));

        db.insert("rs4148323".into(), snp!(
            "rs4148323", "UGT1A1", "2", 234669144,
            &["pharma"], "moderate", "A", "G",
            "Bilirubin Metabolism — UGT1A1*6",
            "Reduced UGT1A1 activity (common in East Asians), neonatal jaundice and irinotecan sensitivity",
            "Normal bilirubin conjugation",
            "Mildly reduced bilirubin clearance",
            &[("GG", 0.80), ("GA", 0.18), ("AA", 0.02)],
            &["Neonatal jaundice", "Irinotecan toxicity"],
            &["Relevant for irinotecan dosing in East Asian patients"],
            &["PMID:10694594"]
        ));

        db.insert("rs9934438".into(), snp!(
            "rs9934438", "VKORC1", "16", 31104878,
            &["pharma"], "well-established", "T", "C",
            "Warfarin Sensitivity — VKORC1 (1173C>T)",
            "High warfarin sensitivity — lower dose needed",
            "Standard warfarin dosing",
            "Intermediate warfarin sensitivity",
            &[("CC", 0.38), ("CT", 0.45), ("TT", 0.17)],
            &["Warfarin dosing"],
            &["Genotype-guided warfarin dosing"],
            &["PMID:15930419"]
        ));

        db.insert("rs2279343".into(), snp!(
            "rs2279343", "CYP2B6", "19", 41515263,
            &["pharma"], "moderate", "A", "G",
            "Efavirenz Metabolism — CYP2B6",
            "Slow CYP2B6 metabolism — higher efavirenz levels, more CNS side effects",
            "Normal CYP2B6 function",
            "Intermediate CYP2B6 activity",
            &[("GG", 0.60), ("GA", 0.34), ("AA", 0.06)],
            &["Efavirenz metabolism", "Cyclophosphamide activation"],
            &["Efavirenz dose reduction may be needed"],
            &["PMID:15564879"]
        ));

        // ============================================================
        // NUTRIGENOMICS (25 SNPs)
        // ============================================================

        db.insert("rs1801133".into(), snp!(
            "rs1801133", "MTHFR", "1", 11856378,
            &["nutrition", "health"], "well-established", "T", "C",
            "MTHFR C677T — Methylation",
            "Significantly reduced MTHFR enzyme activity (~30% of normal), impaired folate metabolism, elevated homocysteine",
            "Normal MTHFR enzyme activity, efficient folate metabolism",
            "Mildly reduced MTHFR activity (~65% of normal), slightly elevated homocysteine",
            &[("CC", 0.44), ("CT", 0.42), ("TT", 0.14)],
            &["Elevated homocysteine", "Folate deficiency risk", "Neural tube defect risk", "Cardiovascular risk (mild)"],
            &["Consider methylfolate (5-MTHF) instead of folic acid", "Monitor homocysteine levels", "Adequate B12 intake important", "Leafy greens and folate-rich foods"],
            &["PMID:15060097", "PMID:22065156"]
        ));

        db.insert("rs1801131".into(), snp!(
            "rs1801131", "MTHFR", "1", 11854476,
            &["nutrition", "health"], "well-established", "C", "A",
            "MTHFR A1298C — Methylation",
            "Reduced MTHFR activity (less severe than C677T), impaired BH4 synthesis",
            "Normal MTHFR A1298 function",
            "Mildly reduced activity — more significant if combined with C677T heterozygosity",
            &[("AA", 0.46), ("AC", 0.43), ("CC", 0.11)],
            &["BH4 (tetrahydrobiopterin) synthesis", "Neurotransmitter production", "Folate metabolism"],
            &["Compound heterozygous (677CT + 1298AC) may need methylfolate", "Support BH4 pathway"],
            &["PMID:10958761", "PMID:22065156"]
        ));

        db.insert("rs4988235".into(), snp!(
            "rs4988235", "MCM6", "2", 136608646,
            &["nutrition", "traits"], "well-established", "C", "T",
            "Lactose Tolerance",
            "Lactose intolerant — lactase production decreases after childhood",
            "Lactose tolerant — continued lactase production into adulthood",
            "Likely lactose tolerant — one copy sufficient for lactase persistence",
            &[("TT", 0.35), ("CT", 0.42), ("CC", 0.23)],
            &["Lactose intolerance", "Lactase persistence"],
            &["CC genotype: consider lactose-free dairy alternatives", "Lactase enzyme supplements before dairy consumption"],
            &["PMID:11788828"]
        ));

        db.insert("rs671".into(), snp!(
            "rs671", "ALDH2", "12", 112241766,
            &["nutrition", "pharma"], "well-established", "A", "G",
            "Alcohol Flush Reaction — ALDH2",
            "Inactive ALDH2 enzyme — severe alcohol intolerance, facial flushing, elevated esophageal cancer risk with alcohol use",
            "Normal ALDH2 activity — typical alcohol metabolism",
            "Reduced ALDH2 activity — facial flushing with alcohol, increased acetaldehyde exposure",
            &[("GG", 0.72), ("GA", 0.24), ("AA", 0.04)],
            &["Alcohol flush reaction", "Esophageal cancer risk (with alcohol)", "Acetaldehyde toxicity"],
            &["A allele carriers: strongly avoid heavy alcohol consumption", "AA genotype: alcohol consumption significantly increases cancer risk"],
            &["PMID:19297401", "PMID:20548940"]
        ));

        db.insert("rs2228570".into(), snp!(
            "rs2228570", "VDR", "12", 48272895,
            &["nutrition"], "well-established", "T", "C",
            "Vitamin D Receptor — VDR FokI",
            "Less active VDR, may need higher vitamin D levels for same biological effect",
            "More active VDR, efficient vitamin D signaling",
            "Intermediate VDR activity",
            &[("CC", 0.35), ("CT", 0.48), ("TT", 0.17)],
            &["Vitamin D utilization", "Bone density", "Immune function"],
            &["TT genotype may benefit from higher vitamin D supplementation", "Regular vitamin D level testing"],
            &["PMID:10770229", "PMID:22125656"]
        ));

        db.insert("rs1800562".into(), snp!(
            "rs1800562", "HFE", "6", 26093141,
            &["nutrition", "health"], "well-established", "A", "G",
            "Hereditary Hemochromatosis — HFE C282Y",
            "Homozygous C282Y — high risk of iron overload (hemochromatosis)",
            "Normal iron absorption regulation",
            "Carrier — mildly elevated iron absorption, rarely symptomatic alone",
            &[("GG", 0.87), ("GA", 0.12), ("AA", 0.01)],
            &["Hereditary hemochromatosis", "Iron overload", "Liver disease"],
            &["Regular serum ferritin monitoring", "Avoid iron supplements unless deficient", "Avoid vitamin C with iron-rich meals (enhances absorption)", "Therapeutic phlebotomy if ferritin elevated"],
            &["PMID:8696339", "PMID:10484769"]
        ));

        db.insert("rs1799945".into(), snp!(
            "rs1799945", "HFE", "6", 26091179,
            &["nutrition", "health"], "well-established", "G", "C",
            "Iron Metabolism — HFE H63D",
            "Mildly increased iron absorption, risk compound with C282Y",
            "Normal iron metabolism from this variant",
            "Slightly elevated iron absorption",
            &[("CC", 0.72), ("CG", 0.25), ("GG", 0.03)],
            &["Iron metabolism", "Compound heterozygosity with C282Y"],
            &["Monitor ferritin if also C282Y carrier", "Generally benign alone"],
            &["PMID:8696339"]
        ));

        db.insert("rs7501331".into(), snp!(
            "rs7501331", "BCMO1", "16", 81264597,
            &["nutrition"], "moderate", "T", "C",
            "Beta-Carotene Conversion — BCMO1",
            "Reduced conversion of beta-carotene to vitamin A (~32% lower)",
            "Efficient beta-carotene to vitamin A conversion",
            "Mildly reduced beta-carotene conversion",
            &[("CC", 0.58), ("CT", 0.36), ("TT", 0.06)],
            &["Vitamin A status", "Beta-carotene conversion"],
            &["TT genotype: may need preformed vitamin A (retinol) rather than beta-carotene", "Include retinol-rich foods: liver, eggs, dairy"],
            &["PMID:19103647"]
        ));

        db.insert("rs33972313".into(), snp!(
            "rs33972313", "SLC23A1", "5", 139389813,
            &["nutrition"], "moderate", "T", "C",
            "Vitamin C Transport — SLC23A1",
            "Reduced vitamin C absorption, lower plasma vitamin C levels",
            "Normal vitamin C transport and absorption",
            "Mildly reduced vitamin C levels",
            &[("CC", 0.85), ("CT", 0.14), ("TT", 0.01)],
            &["Vitamin C status", "Scurvy risk (extreme)"],
            &["Higher vitamin C intake may be needed", "Citrus fruits and vegetables"],
            &["PMID:20200263"]
        ));

        db.insert("rs174546".into(), snp!(
            "rs174546", "FADS1", "11", 61597212,
            &["nutrition"], "well-established", "T", "C",
            "Omega-3/6 Metabolism — FADS1",
            "Reduced desaturase activity, less efficient omega-3/6 conversion",
            "Efficient fatty acid desaturation, good EPA/DHA synthesis from ALA",
            "Intermediate fatty acid conversion",
            &[("CC", 0.40), ("CT", 0.45), ("TT", 0.15)],
            &["Omega-3 fatty acid levels", "Inflammation regulation"],
            &["TT genotype: direct EPA/DHA supplementation more important than ALA", "Fish oil or algae-based omega-3 supplements"],
            &["PMID:21829377", "PMID:22965187"]
        ));

        db.insert("rs1801198".into(), snp!(
            "rs1801198", "TCN2", "22", 31011175,
            &["nutrition"], "moderate", "G", "C",
            "Vitamin B12 Transport — TCN2",
            "Reduced transcobalamin II binding, impaired cellular B12 delivery",
            "Normal B12 transport to cells",
            "Mildly reduced B12 cellular delivery",
            &[("CC", 0.40), ("CG", 0.45), ("GG", 0.15)],
            &["Vitamin B12 utilization", "Homocysteine levels"],
            &["Monitor B12 levels", "Sublingual or injectable B12 may be more effective"],
            &["PMID:11173004"]
        ));

        db.insert("rs4654748".into(), snp!(
            "rs4654748", "NBPF3", "1", 150229015,
            &["nutrition"], "moderate", "T", "C",
            "Vitamin B6 Status",
            "Lower circulating vitamin B6 levels",
            "Normal vitamin B6 levels",
            "Mildly reduced B6 levels",
            &[("CC", 0.30), ("CT", 0.48), ("TT", 0.22)],
            &["Vitamin B6 status", "Homocysteine metabolism"],
            &["May need higher B6 intake", "P5P (pyridoxal-5-phosphate) active form"],
            &["PMID:19744961"]
        ));

        db.insert("rs12934922".into(), snp!(
            "rs12934922", "BCMO1", "16", 81272070,
            &["nutrition"], "moderate", "T", "A",
            "Beta-Carotene Conversion — BCMO1 (second variant)",
            "Further reduced beta-carotene conversion when combined with rs7501331",
            "Normal conversion",
            "Mildly reduced conversion",
            &[("AA", 0.35), ("AT", 0.47), ("TT", 0.18)],
            &["Vitamin A conversion"],
            &["Consider preformed vitamin A sources"],
            &["PMID:19103647"]
        ));

        db.insert("rs602662".into(), snp!(
            "rs602662", "FUT2", "19", 49206674,
            &["nutrition"], "moderate", "A", "G",
            "Vitamin B12 Absorption — FUT2",
            "Non-secretor — lower B12 levels, altered gut microbiome",
            "Secretor — normal B12 absorption via intrinsic factor",
            "Intermediate B12 absorption",
            &[("GG", 0.45), ("GA", 0.42), ("AA", 0.13)],
            &["B12 absorption", "Gut microbiome composition"],
            &["Monitor B12 levels", "May benefit from B12 supplementation"],
            &["PMID:21129376"]
        ));

        db.insert("rs7946".into(), snp!(
            "rs7946", "PEMT", "17", 17409600,
            &["nutrition"], "moderate", "T", "C",
            "Choline Metabolism — PEMT",
            "Reduced phosphatidylcholine synthesis, higher dietary choline needs",
            "Normal endogenous choline production",
            "Intermediate choline needs",
            &[("CC", 0.30), ("CT", 0.50), ("TT", 0.20)],
            &["Choline status", "Liver health", "Fatty liver risk"],
            &["Increase dietary choline: eggs, liver, soybeans", "Especially important during pregnancy"],
            &["PMID:16702348"]
        ));

        db.insert("rs1544410".into(), snp!(
            "rs1544410", "VDR", "12", 48239835,
            &["nutrition"], "moderate", "A", "G",
            "Vitamin D Receptor — VDR BsmI",
            "Reduced vitamin D receptor activity, lower bone density risk",
            "Normal VDR signaling",
            "Intermediate VDR function",
            &[("GG", 0.35), ("GA", 0.48), ("AA", 0.17)],
            &["Bone density", "Vitamin D response"],
            &["Ensure adequate vitamin D and calcium"],
            &["PMID:10797420"]
        ));

        db.insert("rs7041".into(), snp!(
            "rs7041", "GC", "4", 72618334,
            &["nutrition"], "moderate", "G", "T",
            "Vitamin D Binding Protein — GC",
            "Lower vitamin D binding protein, reduced total 25(OH)D but may have normal free vitamin D",
            "Higher vitamin D binding protein levels",
            "Intermediate binding protein levels",
            &[("TT", 0.20), ("TG", 0.50), ("GG", 0.30)],
            &["Vitamin D transport", "25(OH)D levels"],
            &["Free vitamin D may be better biomarker than total"],
            &["PMID:20541252"]
        ));

        db.insert("rs1229984".into(), snp!(
            "rs1229984", "ADH1B", "4", 100239319,
            &["nutrition", "traits"], "well-established", "T", "C",
            "Alcohol Metabolism — ADH1B His48Arg",
            "Ultra-rapid alcohol metabolism — faster acetaldehyde production, protective against alcoholism",
            "Normal alcohol metabolism speed",
            "Faster-than-average alcohol metabolism",
            &[("CC", 0.70), ("CT", 0.25), ("TT", 0.05)],
            &["Alcohol metabolism rate", "Alcoholism protection"],
            &["T allele provides natural protection against alcohol overuse"],
            &["PMID:17718394", "PMID:19578367"]
        ));

        db.insert("rs2060793".into(), snp!(
            "rs2060793", "CYP2R1", "11", 14913764,
            &["nutrition"], "moderate", "A", "G",
            "Vitamin D Synthesis — CYP2R1",
            "Reduced 25-hydroxylation of vitamin D, lower circulating 25(OH)D",
            "Normal vitamin D activation",
            "Mildly reduced vitamin D 25-hydroxylation",
            &[("GG", 0.40), ("GA", 0.45), ("AA", 0.15)],
            &["Vitamin D synthesis", "25(OH)D levels"],
            &["Higher vitamin D supplementation may be needed"],
            &["PMID:20541252"]
        ));

        db.insert("rs4588".into(), snp!(
            "rs4588", "GC", "4", 72618323,
            &["nutrition"], "moderate", "A", "C",
            "Vitamin D Binding Protein — GC (Thr436Lys)",
            "Lower DBP and total 25(OH)D",
            "Normal vitamin D binding protein",
            "Intermediate DBP levels",
            &[("CC", 0.50), ("CA", 0.40), ("AA", 0.10)],
            &["Vitamin D transport"],
            &["Monitor vitamin D levels"],
            &["PMID:20541252"]
        ));

        // ============================================================
        // TRAITS (25 SNPs)
        // ============================================================

        db.insert("rs12913832".into(), snp!(
            "rs12913832", "HERC2/OCA2", "15", 28365618,
            &["traits"], "well-established", "G", "A",
            "Eye Color",
            "Brown eye color (dominant)",
            "Blue eye color",
            "Likely brown or green/hazel eye color",
            &[("AA", 0.26), ("AG", 0.37), ("GG", 0.37)],
            &["Eye color determination"],
            &[],
            &["PMID:18172690"]
        ));

        db.insert("rs1805007".into(), snp!(
            "rs1805007", "MC1R", "16", 89986117,
            &["traits", "health"], "well-established", "T", "C",
            "Red Hair & Skin Sensitivity — MC1R R151C",
            "MC1R variant — red/auburn hair, fair skin, increased melanoma risk, altered pain sensitivity",
            "Normal melanocortin-1 receptor — typical pigmentation",
            "Carrier — may have fair skin or reddish tints, slightly increased UV sensitivity",
            &[("CC", 0.85), ("CT", 0.14), ("TT", 0.01)],
            &["Hair color", "Skin pigmentation", "Melanoma risk", "Pain sensitivity"],
            &["Rigorous sun protection", "Regular dermatology screening", "Higher anesthesia requirements possible"],
            &["PMID:11260714", "PMID:18488028"]
        ));

        db.insert("rs1815739".into(), snp!(
            "rs1815739", "ACTN3", "11", 66560624,
            &["traits"], "well-established", "T", "C",
            "Muscle Fiber Type — ACTN3",
            "Absence of α-actinin-3 — endurance-oriented muscle fibers, reduced sprint/power capacity",
            "Normal α-actinin-3 — enhanced sprint and power performance capacity",
            "Intermediate muscle fiber composition, balanced performance",
            &[("CC", 0.30), ("CT", 0.50), ("TT", 0.20)],
            &["Sprint/power performance", "Endurance performance", "Muscle fiber composition"],
            &["TT genotype: may excel at endurance sports", "CC genotype: may have advantage in power/sprint sports"],
            &["PMID:12879365"]
        ));

        db.insert("rs2304672".into(), snp!(
            "rs2304672", "PER2", "2", 239186776,
            &["traits"], "moderate", "G", "C",
            "Chronotype — PER2",
            "Associated with evening preference (night owl tendency)",
            "Associated with morning preference (early bird tendency)",
            "Intermediate chronotype",
            &[("CC", 0.82), ("CG", 0.17), ("GG", 0.01)],
            &["Circadian rhythm", "Sleep preference", "Chronotype"],
            &["G carriers: may benefit from later schedules when possible", "Light therapy in morning can help shift rhythm"],
            &["PMID:11716671"]
        ));

        db.insert("rs713598".into(), snp!(
            "rs713598", "TAS2R38", "7", 141672604,
            &["traits", "nutrition"], "well-established", "G", "C",
            "Bitter Taste Perception — TAS2R38",
            "Non-taster — cannot taste PTC/PROP bitter compounds",
            "Super-taster — strong perception of bitter compounds",
            "Intermediate bitter taste sensitivity",
            &[("CC", 0.30), ("CG", 0.50), ("GG", 0.20)],
            &["Bitter taste perception", "Vegetable preference", "PTC/PROP sensitivity"],
            &["Non-tasters may prefer cruciferous vegetables (less bitter)", "Tasters may need vegetables prepared to reduce bitterness"],
            &["PMID:12595690"]
        ));

        db.insert("rs72921001".into(), snp!(
            "rs72921001", "OR6A2", "11", 124097642,
            &["traits"], "moderate", "A", "C",
            "Cilantro Aversion — OR6A2",
            "Likely perceives cilantro as soapy-tasting",
            "Normal cilantro perception — likely enjoys or is neutral to cilantro",
            "May have mild soapy perception of cilantro",
            &[("CC", 0.72), ("CA", 0.24), ("AA", 0.04)],
            &["Cilantro perception", "Olfactory receptor variation"],
            &["Crushing cilantro breaks down soapy-tasting aldehydes"],
            &["PMID:22927872"]
        ));

        db.insert("rs1801260".into(), snp!(
            "rs1801260", "CLOCK", "4", 56336108,
            &["traits"], "moderate", "G", "A",
            "Circadian Rhythm — CLOCK 3111T>C",
            "Evening chronotype, tendency to sleep later, potential sleep issues",
            "Morning chronotype, earlier sleep-wake preference",
            "Intermediate chronotype",
            &[("AA", 0.55), ("AG", 0.38), ("GG", 0.07)],
            &["Circadian rhythm", "Sleep timing", "Metabolic rhythm"],
            &["Consistent sleep schedule important", "Morning light exposure helps regulate rhythm"],
            &["PMID:9620771", "PMID:17998023"]
        ));

        db.insert("rs4950".into(), snp!(
            "rs4950", "LRP5", "11", 68188542,
            &["traits"], "moderate", "A", "G",
            "Height — LRP5",
            "Associated with reduced height",
            "Associated with taller stature",
            "Intermediate effect on height",
            &[("GG", 0.40), ("GA", 0.45), ("AA", 0.15)],
            &["Height variation"],
            &[],
            &["PMID:20881960"]
        ));

        db.insert("rs17822931".into(), snp!(
            "rs17822931", "ABCC11", "16", 48258198,
            &["traits"], "well-established", "T", "C",
            "Earwax Type & Body Odor — ABCC11",
            "Dry earwax, reduced body odor (common in East Asians)",
            "Wet earwax, typical body odor (common in Europeans/Africans)",
            "Wet earwax (dominant trait)",
            &[("CC", 0.50), ("CT", 0.35), ("TT", 0.15)],
            &["Earwax type", "Body odor", "Breast cancer risk (minor)"],
            &["TT genotype: reduced need for antiperspirant"],
            &["PMID:16444273"]
        ));

        db.insert("rs4481887".into(), snp!(
            "rs4481887", "PLCL1", "2", 198844555,
            &["traits"], "moderate", "A", "G",
            "Asparagus Anosmia",
            "Cannot smell asparagus metabolites in urine",
            "Can smell asparagus metabolites in urine",
            "May partially detect asparagus odor",
            &[("GG", 0.45), ("GA", 0.42), ("AA", 0.13)],
            &["Olfactory perception"],
            &[],
            &["PMID:27911036"]
        ));

        db.insert("rs1800955".into(), snp!(
            "rs1800955", "DRD4", "11", 637652,
            &["traits"], "moderate", "C", "T",
            "Novelty Seeking — DRD4 Promoter",
            "Higher novelty-seeking behavior tendency",
            "Baseline novelty-seeking behavior",
            "Mildly elevated novelty seeking",
            &[("TT", 0.35), ("TC", 0.47), ("CC", 0.18)],
            &["Personality trait", "Novelty seeking", "Dopamine D4 receptor"],
            &["Channel novelty-seeking into constructive exploration"],
            &["PMID:10521955"]
        ));

        db.insert("rs6265".into(), snp!(
            "rs6265", "BDNF", "11", 27679916,
            &["traits", "health"], "well-established", "T", "C",
            "Brain-Derived Neurotrophic Factor — BDNF Val66Met",
            "Met/Met — reduced activity-dependent BDNF secretion, impacts memory and neuroplasticity",
            "Val/Val — normal BDNF secretion, good activity-dependent neuroplasticity",
            "Val/Met — mildly reduced BDNF secretion",
            &[("CC", 0.60), ("CT", 0.34), ("TT", 0.06)],
            &["Memory function", "Neuroplasticity", "Depression susceptibility", "Exercise response"],
            &["Exercise strongly increases BDNF regardless of genotype", "Met carriers benefit especially from regular aerobic exercise"],
            &["PMID:12805220", "PMID:17192785"]
        ));

        db.insert("rs1800588".into(), snp!(
            "rs1800588", "LIPC", "15", 58724264,
            &["health", "traits"], "moderate", "T", "C",
            "HDL Cholesterol — LIPC",
            "Lower hepatic lipase activity, higher HDL cholesterol",
            "Normal hepatic lipase, standard HDL levels",
            "Intermediate HDL levels",
            &[("CC", 0.42), ("CT", 0.44), ("TT", 0.14)],
            &["HDL cholesterol levels"],
            &["T allele generally favorable for cardiovascular health"],
            &["PMID:12093772"]
        ));

        db.insert("rs7495174".into(), snp!(
            "rs7495174", "OCA2", "15", 28344238,
            &["traits"], "moderate", "A", "G",
            "Eye Color — OCA2",
            "Associated with darker eye color",
            "Associated with lighter eye color",
            "Intermediate pigmentation",
            &[("GG", 0.30), ("GA", 0.48), ("AA", 0.22)],
            &["Eye color", "Iris pigmentation"],
            &[],
            &["PMID:18172690"]
        ));

        db.insert("rs1426654".into(), snp!(
            "rs1426654", "SLC24A5", "15", 48426484,
            &["traits"], "well-established", "A", "G",
            "Skin Pigmentation — SLC24A5",
            "Lighter skin pigmentation (nearly fixed in Europeans)",
            "Darker skin pigmentation (ancestral allele)",
            "Intermediate skin pigmentation",
            &[("GG", 0.40), ("GA", 0.20), ("AA", 0.40)],
            &["Skin pigmentation", "Vitamin D synthesis"],
            &["Lighter skin: more sun protection needed", "Darker skin: vitamin D supplementation may be beneficial at higher latitudes"],
            &["PMID:16357253"]
        ));

        db.insert("rs182549".into(), snp!(
            "rs182549", "MCM6", "2", 136616754,
            &["traits", "nutrition"], "well-established", "T", "C",
            "Lactase Persistence — MCM6 (secondary marker)",
            "Lactose intolerant",
            "Lactose tolerant",
            "Likely lactose tolerant",
            &[("CC", 0.25), ("CT", 0.42), ("TT", 0.33)],
            &["Lactose tolerance"],
            &["CC: avoid large amounts of dairy or use lactase enzymes"],
            &["PMID:14614309"]
        ));

        db.insert("rs4680".into(), snp!(
            "rs4680", "COMT", "22", 19963748,
            &["traits", "health"], "well-established", "A", "G",
            "Warrior vs Worrier — COMT Val158Met",
            "Met/Met (AA) — slow COMT, higher dopamine/estrogen, better cognition under normal conditions but stress-sensitive",
            "Val/Val (GG) — fast COMT, lower dopamine, stress-resilient warrior type",
            "Val/Met — balanced dopamine metabolism",
            &[("GG", 0.25), ("GA", 0.50), ("AA", 0.25)],
            &["Stress response", "Cognitive style", "Estrogen metabolism"],
            &["AA: mindfulness and stress management especially beneficial", "GG: may benefit from stimulating cognitive challenges"],
            &["PMID:14615048"]
        ));

        db.insert("rs10246939".into(), snp!(
            "rs10246939", "TAS2R38", "7", 141672705,
            &["traits"], "well-established", "T", "C",
            "Bitter Taste — TAS2R38 (I296V)",
            "Non-taster haplotype",
            "Taster haplotype",
            "Intermediate bitter sensitivity",
            &[("CC", 0.30), ("CT", 0.48), ("TT", 0.22)],
            &["Bitter taste sensitivity"],
            &[],
            &["PMID:12595690"]
        ));

        // ============================================================
        // CARRIER STATUS (10 SNPs)
        // ============================================================

        db.insert("rs75527207".into(), snp!(
            "rs75527207", "CFTR", "7", 117559590,
            &["carrier"], "well-established", "T", "C",
            "Cystic Fibrosis Carrier — CFTR ΔF508",
            "Cystic fibrosis — severe lung and pancreatic disease",
            "Non-carrier for this CFTR variant",
            "CF carrier — asymptomatic but can pass to offspring",
            &[("CC", 0.96), ("CT", 0.038), ("TT", 0.001)],
            &["Cystic fibrosis", "Carrier status"],
            &["Carriers: genetic counseling before family planning", "Partner testing recommended"],
            &["PMID:20301428"]
        ));

        db.insert("rs80338939".into(), snp!(
            "rs80338939", "GJB2", "13", 20763612,
            &["carrier"], "well-established", "T", "C",
            "Hearing Loss — GJB2 35delG",
            "Homozygous — congenital non-syndromic hearing loss",
            "Normal hearing from this gene",
            "Carrier — normal hearing, can pass to offspring",
            &[("CC", 0.96), ("CT", 0.038), ("TT", 0.002)],
            &["Congenital hearing loss", "Connexin 26 deficiency"],
            &["Carriers: partner testing recommended", "Newborn hearing screening important"],
            &["PMID:10700184"]
        ));

        db.insert("rs1800429".into(), snp!(
            "rs1800429", "HEXA", "15", 72638892,
            &["carrier"], "well-established", "A", "G",
            "Tay-Sachs Carrier — HEXA",
            "Tay-Sachs disease — fatal neurodegenerative disorder in infancy",
            "Non-carrier",
            "Carrier — asymptomatic, genetic counseling advised",
            &[("GG", 0.97), ("GA", 0.029), ("AA", 0.001)],
            &["Tay-Sachs disease", "Carrier status"],
            &["Genetic counseling for carriers", "Partner testing especially in Ashkenazi Jewish population"],
            &["PMID:10330348"]
        ));

        db.insert("rs11549465".into(), snp!(
            "rs11549465", "EPAS1", "2", 46441523,
            &["carrier", "traits"], "moderate", "T", "C",
            "High-Altitude Adaptation — EPAS1 (HIF-2α)",
            "Enhanced erythropoietic response — advantageous at high altitude",
            "Normal oxygen sensing",
            "Intermediate altitude adaptation",
            &[("CC", 0.88), ("CT", 0.11), ("TT", 0.01)],
            &["Altitude adaptation", "Erythrocytosis"],
            &["May have enhanced endurance at altitude"],
            &["PMID:20838600"]
        ));

        db.insert("rs1800460".into(), snp!(
            "rs1800460", "TPMT", "6", 18130918,
            &["carrier", "pharma"], "well-established", "A", "G",
            "Thiopurine Sensitivity — TPMT*3B",
            "Homozygous — life-threatening toxicity from azathioprine/6-MP. CONTRAINDICATED at standard doses.",
            "Normal TPMT activity — standard thiopurine dosing",
            "Intermediate TPMT — reduced thiopurine dose required",
            &[("GG", 0.91), ("GA", 0.085), ("AA", 0.005)],
            &["Thiopurine drug toxicity", "Azathioprine metabolism", "6-mercaptopurine metabolism"],
            &["TPMT testing mandatory before thiopurine therapy", "Dose reduction for heterozygotes", "Alternative therapy for homozygotes"],
            &["PMID:10534324", "PMID:21270794"]
        ));

        db.insert("rs1142345".into(), snp!(
            "rs1142345", "TPMT", "6", 18130753,
            &["carrier", "pharma"], "well-established", "C", "T",
            "Thiopurine Sensitivity — TPMT*3C",
            "Reduced TPMT activity — thiopurine dose reduction needed",
            "Normal TPMT metabolism",
            "Intermediate TPMT activity",
            &[("TT", 0.93), ("TC", 0.066), ("CC", 0.004)],
            &["Thiopurine metabolism"],
            &["Pre-treatment TPMT genotyping recommended"],
            &["PMID:10534324"]
        ));

        db.insert("rs76151636".into(), snp!(
            "rs76151636", "GBA", "1", 155204849,
            &["carrier", "health"], "well-established", "A", "G",
            "Gaucher Disease Carrier — GBA N370S",
            "Gaucher disease type 1 (if homozygous or compound het)",
            "Non-carrier",
            "Gaucher carrier — also associated with elevated Parkinson's risk (5x)",
            &[("GG", 0.97), ("GA", 0.029), ("AA", 0.001)],
            &["Gaucher disease", "Parkinson's disease risk"],
            &["Carriers: genetic counseling", "Carriers: awareness of Parkinson's risk"],
            &["PMID:21980299"]
        ));

        // ============================================================
        // ADDITIONAL HEALTH SNPs (30+ more to reach 150)
        // ============================================================

        db.insert("rs2066844".into(), snp!(
            "rs2066844", "NOD2", "16", 50745926,
            &["health"], "well-established", "T", "C",
            "Crohn's Disease — NOD2 R702W",
            "Elevated Crohn's disease risk (3x per allele)",
            "Baseline Crohn's disease risk",
            "Moderately elevated Crohn's risk",
            &[("CC", 0.90), ("CT", 0.095), ("TT", 0.005)],
            &["Crohn's disease", "Inflammatory bowel disease"],
            &["Gut health: diverse fiber intake", "Probiotics may help"],
            &["PMID:11385576"]
        ));

        db.insert("rs2066845".into(), snp!(
            "rs2066845", "NOD2", "16", 50756540,
            &["health"], "well-established", "C", "G",
            "Crohn's Disease — NOD2 G908R",
            "Elevated Crohn's risk",
            "Baseline Crohn's risk",
            "Moderately elevated risk",
            &[("GG", 0.97), ("GC", 0.029), ("CC", 0.001)],
            &["Crohn's disease"],
            &["Anti-inflammatory diet"],
            &["PMID:11385576"]
        ));

        db.insert("rs5186".into(), snp!(
            "rs5186", "AGTR1", "3", 148459988,
            &["health"], "moderate", "C", "A",
            "Hypertension Risk — AGTR1 A1166C",
            "Higher angiotensin II receptor activity, elevated blood pressure risk",
            "Normal AGTR1 activity",
            "Mildly elevated hypertension risk",
            &[("AA", 0.60), ("AC", 0.35), ("CC", 0.05)],
            &["Hypertension", "Cardiovascular disease"],
            &["Regular blood pressure monitoring", "Reduce sodium intake", "ARBs may be particularly effective"],
            &["PMID:8012381"]
        ));

        db.insert("rs1801253".into(), snp!(
            "rs1801253", "ADRB1", "10", 115805056,
            &["health", "pharma"], "moderate", "G", "C",
            "Beta-Blocker Response — ADRB1 Arg389Gly",
            "Better response to beta-blockers but higher resting heart rate",
            "Reduced beta-blocker response",
            "Intermediate beta-blocker response",
            &[("CC", 0.28), ("CG", 0.50), ("GG", 0.22)],
            &["Beta-blocker response", "Heart rate", "Heart failure"],
            &["Arg389 (GG): may respond better to beta-blockers"],
            &["PMID:12135350"]
        ));

        db.insert("rs1800896".into(), snp!(
            "rs1800896", "IL10", "1", 206946897,
            &["health"], "moderate", "A", "G",
            "Anti-inflammatory Capacity — IL10",
            "Lower IL-10 production, reduced anti-inflammatory response",
            "Higher IL-10 production, better inflammation control",
            "Intermediate IL-10",
            &[("GG", 0.27), ("GA", 0.49), ("AA", 0.24)],
            &["Autoimmune susceptibility", "Inflammatory response"],
            &["Anti-inflammatory diet and lifestyle"],
            &["PMID:9553622"]
        ));

        db.insert("rs1800796".into(), snp!(
            "rs1800796", "IL6", "7", 22766246,
            &["health"], "moderate", "G", "C",
            "IL-6 — Inflammatory Variant (second)",
            "Altered IL-6 expression",
            "Normal IL-6 expression",
            "Intermediate IL-6 levels",
            &[("CC", 0.75), ("CG", 0.23), ("GG", 0.02)],
            &["Inflammation", "Cardiovascular risk"],
            &["Anti-inflammatory lifestyle"],
            &["PMID:15114530"]
        ));

        db.insert("rs1800871".into(), snp!(
            "rs1800871", "IL10", "1", 206946634,
            &["health"], "moderate", "T", "C",
            "IL-10 Promoter — Anti-inflammatory",
            "Lower IL-10, reduced anti-inflammatory capacity",
            "Higher IL-10 production",
            "Intermediate IL-10",
            &[("CC", 0.40), ("CT", 0.44), ("TT", 0.16)],
            &["Inflammatory regulation"],
            &["Omega-3 and turmeric support anti-inflammatory pathways"],
            &["PMID:9553622"]
        ));

        db.insert("rs10830963".into(), snp!(
            "rs10830963", "MTNR1B", "11", 92708710,
            &["health"], "well-established", "G", "C",
            "Fasting Glucose — MTNR1B",
            "Higher fasting glucose levels, increased diabetes risk with late eating",
            "Normal melatonin receptor signaling in pancreas",
            "Mildly elevated fasting glucose",
            &[("CC", 0.50), ("CG", 0.40), ("GG", 0.10)],
            &["Fasting glucose", "Type 2 diabetes", "Melatonin signaling"],
            &["Avoid eating close to bedtime", "Earlier dinner timing beneficial"],
            &["PMID:19060910", "PMID:23329952"]
        ));

        db.insert("rs780094".into(), snp!(
            "rs780094", "GCKR", "2", 27741237,
            &["health"], "moderate", "T", "C",
            "Triglycerides & Glucose — GCKR",
            "Higher triglycerides but lower fasting glucose (pleiotropic)",
            "Lower triglycerides",
            "Intermediate effect",
            &[("CC", 0.30), ("CT", 0.49), ("TT", 0.21)],
            &["Triglyceride levels", "Fasting glucose", "Metabolic syndrome"],
            &["Monitor lipid panel", "Low sugar diet"],
            &["PMID:18372903"]
        ));

        db.insert("rs1260326".into(), snp!(
            "rs1260326", "GCKR", "2", 27730940,
            &["health"], "moderate", "T", "C",
            "Metabolic Regulation — GCKR L446P",
            "Higher triglycerides, lower glucose",
            "Normal glucokinase regulation",
            "Intermediate metabolic effect",
            &[("CC", 0.28), ("CT", 0.50), ("TT", 0.22)],
            &["Triglycerides", "Glucose regulation"],
            &["Monitor metabolic panel"],
            &["PMID:20081858"]
        ));

        db.insert("rs964184".into(), snp!(
            "rs964184", "APOA5/ZPR1", "11", 116648917,
            &["health"], "well-established", "G", "C",
            "Triglycerides — APOA5",
            "Elevated triglycerides, increased cardiovascular risk",
            "Normal triglyceride levels",
            "Mildly elevated triglycerides",
            &[("CC", 0.70), ("CG", 0.27), ("GG", 0.03)],
            &["Triglycerides", "Cardiovascular disease"],
            &["Omega-3 fatty acids effective for triglyceride reduction", "Limit refined carbohydrates"],
            &["PMID:20686565"]
        ));

        db.insert("rs1801725".into(), snp!(
            "rs1801725", "CASR", "3", 122003757,
            &["health", "nutrition"], "moderate", "G", "T",
            "Calcium Sensing — CASR A986S",
            "Altered calcium sensing, mildly elevated serum calcium",
            "Normal calcium homeostasis",
            "Intermediate calcium sensing",
            &[("TT", 0.70), ("TG", 0.27), ("GG", 0.03)],
            &["Calcium homeostasis", "Hypercalcemia risk"],
            &["Monitor calcium levels"],
            &["PMID:15060088"]
        ));

        db.insert("rs1800875".into(), snp!(
            "rs1800875", "ACE", "17", 63488529,
            &["health", "traits"], "moderate", "C", "T",
            "ACE Activity — I/D Proxy",
            "Higher ACE activity, higher angiotensin II — power athlete advantage but hypertension risk",
            "Lower ACE activity — endurance athlete advantage",
            "Intermediate ACE activity",
            &[("TT", 0.25), ("TC", 0.50), ("CC", 0.25)],
            &["Blood pressure regulation", "Athletic performance", "Cardiovascular health"],
            &["D allele carriers: blood pressure monitoring important"],
            &["PMID:10767669"]
        ));

        db.insert("rs7412".into(), snp!(
            "rs7412", "APOE", "19", 44908822,
            &["longevity", "health"], "well-established", "T", "C",
            "APOE ε2 — Protective Longevity Variant",
            "APOE ε2/ε2 — rare type III hyperlipoproteinemia risk",
            "Common genotype, baseline risk",
            "One ε2 allele — generally cardioprotective, associated with longevity",
            &[("CC", 0.77), ("CT", 0.21), ("TT", 0.02)],
            &["Longevity", "Cardiovascular protection", "Type III hyperlipoproteinemia"],
            &["ε2 carriers generally have favorable cardiovascular outcomes"],
            &["PMID:8346443"]
        ));

        db.insert("rs7775228".into(), snp!(
            "rs7775228", "HLA-C", "6", 31268749,
            &["health"], "well-established", "T", "C",
            "Psoriasis Risk — HLA-C",
            "Elevated psoriasis risk (~4x)",
            "Baseline psoriasis risk",
            "Moderately elevated psoriasis risk",
            &[("CC", 0.75), ("CT", 0.22), ("TT", 0.03)],
            &["Psoriasis", "Autoimmune skin disease"],
            &["Vitamin D and omega-3 may help manage symptoms", "Stress management important"],
            &["PMID:20953190"]
        ));

        db.insert("rs2476601".into(), snp!(
            "rs2476601", "PTPN22", "1", 114377568,
            &["health"], "well-established", "A", "G",
            "Autoimmune Disease Risk — PTPN22 R620W",
            "Elevated risk for multiple autoimmune diseases (T1D, RA, lupus, thyroiditis)",
            "Baseline autoimmune risk",
            "Moderately elevated autoimmune risk",
            &[("GG", 0.83), ("GA", 0.16), ("AA", 0.01)],
            &["Type 1 diabetes", "Rheumatoid arthritis", "Lupus", "Autoimmune thyroiditis"],
            &["Regular thyroid screening", "Vitamin D supports immune regulation"],
            &["PMID:15208781", "PMID:17447842"]
        ));

        db.insert("rs3135388".into(), snp!(
            "rs3135388", "HLA-DRB1", "6", 32681049,
            &["health"], "well-established", "A", "G",
            "Multiple Sclerosis Risk — HLA-DRB1*15:01",
            "Elevated MS risk (~3x with HLA-DRB1*15:01 tag)",
            "Baseline MS risk",
            "Moderately elevated MS risk",
            &[("GG", 0.72), ("GA", 0.25), ("AA", 0.03)],
            &["Multiple sclerosis", "Autoimmune disease"],
            &["Vitamin D sufficiency may reduce risk", "Smoking avoidance important (synergistic risk)"],
            &["PMID:17660530"]
        ));

        db.insert("rs1799983".into(), snp!(
            "rs1799983", "NOS3", "7", 150696111,
            &["health"], "moderate", "T", "G",
            "Nitric Oxide — eNOS Glu298Asp",
            "Reduced nitric oxide production, endothelial dysfunction risk",
            "Normal eNOS function, healthy nitric oxide production",
            "Mildly reduced nitric oxide production",
            &[("GG", 0.45), ("GT", 0.43), ("TT", 0.12)],
            &["Endothelial function", "Hypertension", "Cardiovascular disease"],
            &["Beetroot juice and leafy greens boost nitric oxide", "Regular exercise improves endothelial function"],
            &["PMID:9482795"]
        ));

        db.insert("rs10811661".into(), snp!(
            "rs10811661", "CDKN2A/B", "9", 22134094,
            &["health"], "well-established", "T", "C",
            "Type 2 Diabetes — CDKN2A/B",
            "Elevated T2D risk",
            "Baseline risk",
            "Mildly elevated risk",
            &[("CC", 0.15), ("CT", 0.45), ("TT", 0.40)],
            &["Type 2 diabetes", "Beta cell function"],
            &["Regular glucose monitoring"],
            &["PMID:17463248"]
        ));

        db.insert("rs4402960".into(), snp!(
            "rs4402960", "IGF2BP2", "3", 185511687,
            &["health"], "well-established", "T", "G",
            "Type 2 Diabetes — IGF2BP2",
            "Elevated T2D risk (~1.14x per allele)",
            "Baseline T2D risk",
            "Mildly elevated risk",
            &[("GG", 0.50), ("GT", 0.40), ("TT", 0.10)],
            &["Type 2 diabetes", "Insulin signaling"],
            &["Physical activity and healthy weight"],
            &["PMID:17463249"]
        ));

        db.insert("rs13266634".into(), snp!(
            "rs13266634", "SLC30A8", "8", 118184783,
            &["health"], "well-established", "T", "C",
            "Type 2 Diabetes — SLC30A8 R325W",
            "Elevated T2D risk — affects zinc transport in beta cells",
            "Protective against T2D",
            "Intermediate T2D risk",
            &[("CC", 0.60), ("CT", 0.34), ("TT", 0.06)],
            &["Type 2 diabetes", "Zinc transport", "Insulin secretion"],
            &["Adequate zinc intake may support beta cell function"],
            &["PMID:17460697"]
        ));

        db.insert("rs4506565".into(), snp!(
            "rs4506565", "TCF7L2", "10", 114756041,
            &["health"], "well-established", "T", "A",
            "Type 2 Diabetes — TCF7L2 (third variant)",
            "Elevated T2D risk",
            "Baseline risk",
            "Moderate risk",
            &[("AA", 0.52), ("AT", 0.40), ("TT", 0.08)],
            &["Type 2 diabetes"],
            &["Weight management and exercise"],
            &["PMID:16415884"]
        ));

        db.insert("rs174547".into(), snp!(
            "rs174547", "FADS1", "11", 61597972,
            &["nutrition"], "well-established", "C", "T",
            "Omega-3/6 Fatty Acid Levels — FADS1",
            "Lower desaturase activity, lower AA but potentially less inflammation",
            "Higher desaturase activity, more efficient omega-3/6 conversion but higher arachidonic acid",
            "Intermediate desaturase activity",
            &[("TT", 0.35), ("TC", 0.47), ("CC", 0.18)],
            &["Fatty acid levels", "Inflammation"],
            &["Dietary omega-3 supplementation benefits CC genotype most"],
            &["PMID:21829377"]
        ));

        db.insert("rs1800012".into(), snp!(
            "rs1800012", "COL1A1", "17", 50201587,
            &["health"], "moderate", "T", "G",
            "Bone Fracture Risk — COL1A1 Sp1",
            "Increased osteoporosis and fracture risk",
            "Normal bone collagen structure",
            "Mildly increased fracture risk",
            &[("GG", 0.72), ("GT", 0.25), ("TT", 0.03)],
            &["Osteoporosis", "Fracture risk", "Bone density"],
            &["Weight-bearing exercise", "Adequate calcium and vitamin D"],
            &["PMID:8640224"]
        ));

        db.insert("rs4633".into(), snp!(
            "rs4633", "COMT", "22", 19963684,
            &["health"], "moderate", "T", "C",
            "COMT H62H — Dopamine & Estrogen Metabolism",
            "Slow COMT activity (high LD with Val158Met)",
            "Fast COMT activity",
            "Intermediate COMT",
            &[("CC", 0.25), ("CT", 0.50), ("TT", 0.25)],
            &["Dopamine levels", "Estrogen metabolism"],
            &["Consider in combination with rs4680"],
            &["PMID:14615048"]
        ));

        db.insert("rs4986790".into(), snp!(
            "rs4986790", "TLR4", "9", 120475302,
            &["health"], "moderate", "G", "A",
            "Innate Immunity — TLR4 Asp299Gly",
            "Reduced TLR4 signaling — lower inflammatory response but increased infection susceptibility",
            "Normal TLR4 function",
            "Intermediate TLR4 signaling",
            &[("AA", 0.88), ("AG", 0.11), ("GG", 0.01)],
            &["Innate immune response", "Sepsis susceptibility", "Atherosclerosis"],
            &["Generally protective against excessive inflammation"],
            &["PMID:10761931"]
        ));

        db.insert("rs1800470".into(), snp!(
            "rs1800470", "TGFB1", "19", 41858921,
            &["health"], "moderate", "C", "T",
            "TGF-β1 — Fibrosis & Immunity",
            "Higher TGF-β1 production, increased fibrosis risk",
            "Lower TGF-β1, reduced fibrosis tendency",
            "Intermediate TGF-β1 levels",
            &[("TT", 0.38), ("TC", 0.47), ("CC", 0.15)],
            &["Fibrosis risk", "Immune regulation", "Wound healing"],
            &["Anti-fibrotic lifestyle factors"],
            &["PMID:10208152"]
        ));

        db.insert("rs1799950".into(), snp!(
            "rs1799950", "BRCA1", "17", 43091983,
            &["health"], "well-established", "A", "G",
            "BRCA1 Q356R — Breast Cancer",
            "Variant of uncertain significance in BRCA1, potentially reduced DNA repair",
            "Normal BRCA1 function",
            "Heterozygous — discuss with genetic counselor",
            &[("GG", 0.92), ("GA", 0.075), ("AA", 0.005)],
            &["Breast cancer risk", "Ovarian cancer risk", "DNA repair"],
            &["Regular mammography screening", "Genetic counseling for family history"],
            &["PMID:17924331"]
        ));

        db.insert("rs1048943".into(), snp!(
            "rs1048943", "CYP1A1", "15", 75012985,
            &["health", "pharma"], "moderate", "G", "A",
            "Carcinogen Activation — CYP1A1*2C",
            "Increased activation of procarcinogens, higher lung cancer risk in smokers",
            "Normal CYP1A1 activity",
            "Intermediate carcinogen activation",
            &[("AA", 0.85), ("AG", 0.14), ("GG", 0.01)],
            &["Lung cancer risk (smokers)", "Carcinogen metabolism"],
            &["Absolutely avoid smoking", "Minimize exposure to polycyclic aromatic hydrocarbons"],
            &["PMID:15175697"]
        ));

        db.insert("rs80357906".into(), snp!(
            "rs80357906", "BRCA2", "13", 32914438,
            &["health", "carrier"], "well-established", "T", "C",
            "BRCA2 — Breast & Ovarian Cancer",
            "Pathogenic BRCA2 variant — high lifetime breast/ovarian cancer risk",
            "Normal BRCA2 function",
            "Carrier — significantly elevated cancer risk, screening essential",
            &[("CC", 0.995), ("CT", 0.005), ("TT", 0.0001)],
            &["Breast cancer", "Ovarian cancer", "Prostate cancer", "Pancreatic cancer"],
            &["Enhanced screening protocols", "Consider risk-reducing surgery discussion", "Genetic counseling for family"],
            &["PMID:17924331", "PMID:17529978"]
        ));

        db.insert("rs4646994".into(), snp!(
            "rs4646994", "ACE", "17", 63488529,
            &["health", "traits"], "well-established", "D", "I",
            "ACE Insertion/Deletion",
            "DD genotype — higher ACE activity, power sports advantage, hypertension risk",
            "II genotype — lower ACE, endurance advantage",
            "ID — intermediate ACE activity",
            &[("II", 0.25), ("ID", 0.50), ("DD", 0.25)],
            &["Blood pressure", "Athletic performance", "Heart failure prognosis"],
            &["DD: monitor blood pressure", "II: may excel at endurance sports"],
            &["PMID:10767669", "PMID:11705484"]
        ));

        db.insert("rs4149015".into(), snp!(
            "rs4149015", "SLCO1B1", "12", 21284127,
            &["pharma"], "moderate", "G", "A",
            "Statin Transport — SLCO1B1 Promoter",
            "Reduced hepatic statin uptake",
            "Normal statin transport",
            "Intermediate statin transport",
            &[("AA", 0.85), ("AG", 0.14), ("GG", 0.01)],
            &["Statin pharmacokinetics"],
            &["Consider statin selection carefully"],
            &["PMID:18650507"]
        ));

        db.insert("rs2032582".into(), snp!(
            "rs2032582", "ABCB1", "7", 87160618,
            &["pharma"], "moderate", "A", "G",
            "Drug Transport — ABCB1 G2677T/A",
            "Altered P-glycoprotein — affects drug efflux",
            "Normal P-glycoprotein function",
            "Intermediate drug transport",
            &[("GG", 0.40), ("GA", 0.42), ("AA", 0.18)],
            &["Drug bioavailability", "Chemotherapy resistance"],
            &["Therapeutic drug monitoring for narrow-index drugs"],
            &["PMID:12844134"]
        ));

        db.insert("rs1800566".into(), snp!(
            "rs1800566", "NQO1", "16", 69745145,
            &["health"], "moderate", "T", "C",
            "Detoxification — NQO1 Pro187Ser",
            "Absent NQO1 enzyme activity, reduced quinone detoxification",
            "Normal NQO1 activity",
            "Reduced NQO1 activity (~3x less)",
            &[("CC", 0.60), ("CT", 0.34), ("TT", 0.06)],
            &["Benzene toxicity", "Cancer susceptibility", "CoQ10 metabolism"],
            &["Avoid benzene exposure", "CoQ10 supplementation may help"],
            &["PMID:10526989"]
        ));

        db.insert("rs2243250".into(), snp!(
            "rs2243250", "IL4", "5", 132009154,
            &["health"], "moderate", "T", "C",
            "Allergy & Atopy — IL-4 Promoter",
            "Higher IL-4 production, increased allergy/asthma susceptibility",
            "Normal IL-4 levels",
            "Mildly elevated IL-4",
            &[("CC", 0.70), ("CT", 0.26), ("TT", 0.04)],
            &["Allergies", "Asthma", "Atopic dermatitis"],
            &["Identify and avoid allergens", "Anti-inflammatory diet"],
            &["PMID:9399905"]
        ));

        db.insert("rs1800469".into(), snp!(
            "rs1800469", "TGFB1", "19", 41860296,
            &["health"], "moderate", "A", "G",
            "TGF-β1 Promoter — Fibrosis & Immunity",
            "Altered TGF-β1 expression",
            "Normal TGF-β1 levels",
            "Intermediate TGF-β1",
            &[("GG", 0.40), ("GA", 0.45), ("AA", 0.15)],
            &["Fibrosis", "Immune regulation"],
            &["Regular health monitoring"],
            &["PMID:10208152"]
        ));

        db.insert("rs7574865".into(), snp!(
            "rs7574865", "STAT4", "2", 191099907,
            &["health"], "well-established", "T", "G",
            "Autoimmune Risk — STAT4",
            "Elevated risk for lupus, rheumatoid arthritis (~1.5x per allele)",
            "Baseline autoimmune risk",
            "Moderately elevated autoimmune risk",
            &[("GG", 0.60), ("GT", 0.34), ("TT", 0.06)],
            &["Systemic lupus erythematosus", "Rheumatoid arthritis"],
            &["Vitamin D and anti-inflammatory diet", "Regular autoantibody screening if symptomatic"],
            &["PMID:17804836"]
        ));

        db.insert("rs2395029".into(), snp!(
            "rs2395029", "HLA-B", "6", 31431272,
            &["pharma"], "well-established", "G", "T",
            "Abacavir Hypersensitivity — HLA-B*57:01 Tag",
            "HLA-B*57:01 positive — severe hypersensitivity to abacavir (HIV drug). CONTRAINDICATED.",
            "HLA-B*57:01 negative — abacavir safe to use",
            "May carry HLA-B*57:01 — confirmatory testing needed",
            &[("TT", 0.92), ("TG", 0.075), ("GG", 0.005)],
            &["Abacavir hypersensitivity", "HIV treatment"],
            &["MANDATORY testing before abacavir prescription", "FDA black box warning"],
            &["PMID:18192170"]
        ));

        db.insert("rs12979860".into(), snp!(
            "rs12979860", "IFNL4", "19", 39248147,
            &["health", "pharma"], "well-established", "C", "T",
            "Hepatitis C Treatment Response — IFNL4",
            "Less favorable HCV treatment response",
            "CC genotype — best interferon-based HCV treatment response, higher spontaneous clearance",
            "Intermediate HCV treatment response",
            &[("CC", 0.36), ("CT", 0.48), ("TT", 0.16)],
            &["Hepatitis C treatment", "HCV spontaneous clearance"],
            &["Direct-acting antivirals now preferred regardless of genotype"],
            &["PMID:19684573"]
        ));

        db.insert("rs1800750".into(), snp!(
            "rs1800750", "TNF", "6", 31575015,
            &["health"], "moderate", "G", "A",
            "TNF-alpha Promoter — Inflammation",
            "Altered TNF-alpha expression",
            "Normal TNF-alpha regulation",
            "Intermediate TNF-alpha levels",
            &[("AA", 0.95), ("AG", 0.049), ("GG", 0.001)],
            &["Inflammation", "Sepsis risk"],
            &["Anti-inflammatory lifestyle"],
            &["PMID:8563952"]
        ));

        db.insert("rs3211371".into(), snp!(
            "rs3211371", "CYP2D6", "22", 42522613,
            &["pharma"], "moderate", "T", "C",
            "Drug Metabolism — CYP2D6*6",
            "Reduced CYP2D6 function",
            "Normal CYP2D6",
            "Mildly reduced CYP2D6",
            &[("CC", 0.92), ("CT", 0.075), ("TT", 0.005)],
            &["CYP2D6 substrate drugs"],
            &["Consider in composite CYP2D6 metabolizer status"],
            &["PMID:16958828"]
        ));

        db.insert("rs1805008".into(), snp!(
            "rs1805008", "MC1R", "16", 89986144,
            &["traits", "health"], "well-established", "T", "C",
            "Red Hair & Fair Skin — MC1R R160W",
            "MC1R variant — increased melanoma risk, fair skin",
            "Normal MC1R function",
            "Carrier — mildly increased UV sensitivity",
            &[("CC", 0.88), ("CT", 0.11), ("TT", 0.01)],
            &["Hair color", "Melanoma risk", "Skin sensitivity"],
            &["Sun protection essential", "Regular skin checks"],
            &["PMID:11260714"]
        ));

        db.insert("rs1805009".into(), snp!(
            "rs1805009", "MC1R", "16", 89986546,
            &["traits", "health"], "well-established", "C", "G",
            "Red Hair — MC1R D294H",
            "Strong red hair variant, fair skin, high melanoma risk",
            "Normal pigmentation",
            "Carrier — possible fair skin or reddish tints",
            &[("GG", 0.95), ("GC", 0.048), ("CC", 0.002)],
            &["Hair color", "Melanoma risk"],
            &["Rigorous sun protection"],
            &["PMID:11260714"]
        ));

        db.insert("rs1800547".into(), snp!(
            "rs1800547", "MAPT", "17", 46018291,
            &["health"], "moderate", "A", "G",
            "Tau Protein — MAPT H1/H2",
            "H1/H1 — elevated risk for progressive supranuclear palsy and Parkinson's",
            "H2 haplotype — reduced neurodegenerative risk",
            "Intermediate risk",
            &[("GG", 0.60), ("GA", 0.33), ("AA", 0.07)],
            &["Progressive supranuclear palsy", "Parkinson's disease", "Frontotemporal dementia"],
            &["Neuroprotective lifestyle: exercise, sleep, social engagement"],
            &["PMID:11585133"]
        ));

        db.insert("rs2230199".into(), snp!(
            "rs2230199", "C3", "19", 6718150,
            &["health"], "moderate", "G", "C",
            "Complement System — C3 R102G",
            "Altered complement activation, associated with age-related macular degeneration",
            "Normal complement C3 function",
            "Intermediate AMD risk",
            &[("CC", 0.78), ("CG", 0.20), ("GG", 0.02)],
            &["Age-related macular degeneration", "Complement activation"],
            &["Regular eye exams after age 50", "Lutein and zeaxanthin supplementation"],
            &["PMID:17554261"]
        ));

        db.insert("rs10490924".into(), snp!(
            "rs10490924", "ARMS2", "10", 124214448,
            &["health"], "well-established", "T", "G",
            "Macular Degeneration — ARMS2 A69S",
            "Significantly elevated AMD risk (~2.7x per allele)",
            "Baseline AMD risk",
            "Moderately elevated AMD risk",
            &[("GG", 0.50), ("GT", 0.40), ("TT", 0.10)],
            &["Age-related macular degeneration"],
            &["AREDS2 supplements (lutein, zeaxanthin, zinc)", "Regular retinal screening", "Don't smoke"],
            &["PMID:16936732"]
        ));

        db.insert("rs1061170".into(), snp!(
            "rs1061170", "CFH", "1", 196659237,
            &["health"], "well-established", "C", "T",
            "Macular Degeneration — CFH Y402H",
            "Significantly elevated AMD risk (~2.5x per allele)",
            "Baseline AMD risk",
            "Moderately elevated AMD risk (~2.5x)",
            &[("TT", 0.40), ("TC", 0.44), ("CC", 0.16)],
            &["Age-related macular degeneration", "Complement factor H"],
            &["AREDS2 supplements", "Annual dilated eye exams after 50", "Smoking cessation"],
            &["PMID:15870199", "PMID:15761121"]
        ));

        db.insert("rs1800932".into(), snp!(
            "rs1800932", "NAT2", "8", 18257579,
            &["pharma"], "moderate", "G", "A",
            "Drug Acetylation — NAT2",
            "Slow acetylator — increased isoniazid/sulfonamide toxicity risk",
            "Rapid acetylator",
            "Intermediate acetylation",
            &[("AA", 0.45), ("AG", 0.42), ("GG", 0.13)],
            &["Isoniazid metabolism", "Sulfonamide toxicity", "Drug-induced lupus"],
            &["Monitor for isoniazid hepatotoxicity"],
            &["PMID:16792833"]
        ));

        db.insert("rs4803419".into(), snp!(
            "rs4803419", "COBLL1", "2", 165539871,
            &["health"], "moderate", "C", "T",
            "Waist-Hip Ratio — COBLL1",
            "Associated with higher waist-hip ratio (central adiposity)",
            "Normal fat distribution",
            "Mildly increased central adiposity tendency",
            &[("TT", 0.42), ("TC", 0.44), ("CC", 0.14)],
            &["Central obesity", "Metabolic risk"],
            &["Core exercise and whole-food diet"],
            &["PMID:20935629"]
        ));

        db.insert("rs4148323".into(), snp!(
            "rs4148323", "UGT1A1", "2", 234669144,
            &["pharma"], "moderate", "A", "G",
            "Bilirubin — UGT1A1*6 (East Asian variant)",
            "Reduced UGT1A1, neonatal jaundice and irinotecan sensitivity",
            "Normal bilirubin conjugation",
            "Mildly reduced bilirubin clearance",
            &[("GG", 0.80), ("GA", 0.18), ("AA", 0.02)],
            &["Neonatal jaundice", "Irinotecan toxicity"],
            &["Irinotecan dose adjustment in East Asian patients"],
            &["PMID:10694594"]
        ));

        db.insert("rs16969968".into(), snp!(
            "rs16969968", "CHRNA5", "15", 78882925,
            &["health"], "well-established", "A", "G",
            "Nicotine Dependence — CHRNA5",
            "Increased nicotine dependence risk, heavier smoking",
            "Lower nicotine dependence risk",
            "Intermediate dependence risk",
            &[("GG", 0.55), ("GA", 0.37), ("AA", 0.08)],
            &["Nicotine dependence", "Lung cancer risk", "COPD"],
            &["Never start smoking", "Enhanced smoking cessation support if smoker", "Lung cancer screening if smoking history"],
            &["PMID:18385739", "PMID:20418890"]
        ));

        db.insert("rs2910164".into(), snp!(
            "rs2910164", "MIR146A", "5", 160485411,
            &["health"], "moderate", "C", "G",
            "MicroRNA-146a — Cancer & Immunity",
            "Altered miR-146a expression, associated with various cancer risks",
            "Normal miR-146a expression",
            "Intermediate miR-146a levels",
            &[("GG", 0.40), ("GC", 0.45), ("CC", 0.15)],
            &["Cancer susceptibility", "Immune regulation"],
            &["Regular health screening"],
            &["PMID:18230685"]
        ));

        db
    };
}

pub fn lookup_snp(rsid: &str) -> Option<&SnpInfo> {
    SNP_DB.get(rsid)
}

pub fn get_all_snps() -> &'static HashMap<String, SnpInfo> {
    &SNP_DB
}

pub fn search_database(query: &str) -> Vec<&SnpInfo> {
    let q = query.to_lowercase();
    SNP_DB
        .values()
        .filter(|snp| {
            snp.rsid.to_lowercase().contains(&q)
                || snp.gene.to_lowercase().contains(&q)
                || snp.trait_name.to_lowercase().contains(&q)
                || snp.conditions.iter().any(|c| c.to_lowercase().contains(&q))
        })
        .collect()
}
