use crate::snp_database::{self, SnpInfo};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MatchedSnp {
    pub rsid: String,
    pub chromosome: String,
    pub position: u64,
    pub user_genotype: String,
    pub gene: String,
    pub trait_name: String,
    pub risk_allele: String,
    pub normal_allele: String,
    pub categories: Vec<String>,
    pub significance: String,
    pub risk_level: String,
    pub description: String,
    pub population_frequency: HashMap<String, f64>,
    pub conditions: Vec<String>,
    pub recommendations: Vec<String>,
    pub references: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CategorySummary {
    pub category: String,
    pub total: usize,
    pub high_risk: usize,
    pub moderate_risk: usize,
    pub low_risk: usize,
    pub normal: usize,
    pub protective: usize,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AnalysisResult {
    pub format: String,
    pub total_snps_parsed: usize,
    pub total_matched: usize,
    pub chromosomes: Vec<String>,
    pub findings: Vec<MatchedSnp>,
    pub categories: Vec<CategorySummary>,
}

fn determine_risk_level(user_genotype: &str, snp: &SnpInfo) -> (String, String) {
    let alleles: Vec<char> = user_genotype.chars().collect();
    if alleles.len() != 2 {
        return ("unknown".into(), "Unable to determine genotype".into());
    }

    let risk_count = alleles.iter().filter(|a| a.to_string() == snp.risk_allele).count();

    match risk_count {
        2 => ("high".into(), snp.risk_description.clone()),
        1 => ("moderate".into(), snp.heterozygous_description.clone()),
        0 => ("normal".into(), snp.normal_description.clone()),
        _ => ("unknown".into(), "Unusual genotype".into()),
    }
}

#[tauri::command]
pub async fn analyze_genetic_file(path: String) -> Result<AnalysisResult, String> {
    let parsed = crate::parser::parse_genetic_file(path).await?;

    let db = snp_database::get_all_snps();
    let mut findings = Vec::new();

    for (rsid, snp_info) in db.iter() {
        if let Some(user_snp) = parsed.snps.get(rsid) {
            let (risk_level, description) = determine_risk_level(&user_snp.genotype, snp_info);

            findings.push(MatchedSnp {
                rsid: rsid.clone(),
                chromosome: user_snp.chromosome.clone(),
                position: user_snp.position,
                user_genotype: user_snp.genotype.clone(),
                gene: snp_info.gene.clone(),
                trait_name: snp_info.trait_name.clone(),
                risk_allele: snp_info.risk_allele.clone(),
                normal_allele: snp_info.normal_allele.clone(),
                categories: snp_info.categories.clone(),
                significance: snp_info.significance.clone(),
                risk_level,
                description,
                population_frequency: snp_info.population_frequency.clone(),
                conditions: snp_info.conditions.clone(),
                recommendations: snp_info.recommendations.clone(),
                references: snp_info.references.clone(),
            });
        }
    }

    findings.sort_by(|a, b| {
        let order = |r: &str| match r {
            "high" => 0,
            "moderate" => 1,
            "low" => 2,
            "normal" => 3,
            "protective" => 4,
            _ => 5,
        };
        order(&a.risk_level).cmp(&order(&b.risk_level))
    });

    let mut cat_map: HashMap<String, CategorySummary> = HashMap::new();
    for finding in &findings {
        for cat in &finding.categories {
            let entry = cat_map.entry(cat.clone()).or_insert(CategorySummary {
                category: cat.clone(),
                total: 0,
                high_risk: 0,
                moderate_risk: 0,
                low_risk: 0,
                normal: 0,
                protective: 0,
            });
            entry.total += 1;
            match finding.risk_level.as_str() {
                "high" => entry.high_risk += 1,
                "moderate" => entry.moderate_risk += 1,
                "low" => entry.low_risk += 1,
                "normal" => entry.normal += 1,
                "protective" => entry.protective += 1,
                _ => {}
            }
        }
    }
    let categories: Vec<CategorySummary> = cat_map.into_values().collect();

    Ok(AnalysisResult {
        format: parsed.format,
        total_snps_parsed: parsed.total_snps,
        total_matched: findings.len(),
        chromosomes: parsed.chromosomes,
        findings,
        categories,
    })
}

#[tauri::command]
pub async fn get_snp_detail(rsid: String) -> Result<Option<serde_json::Value>, String> {
    if let Some(info) = snp_database::lookup_snp(&rsid) {
        serde_json::to_value(info).map(Some).map_err(|e| e.to_string())
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub async fn search_snps(query: String) -> Result<Vec<serde_json::Value>, String> {
    let results = snp_database::search_database(&query);
    results
        .iter()
        .map(|s| serde_json::to_value(s).map_err(|e| e.to_string()))
        .collect()
}
