use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io::{BufRead, BufReader};
use std::fs::File;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SnpEntry {
    pub rsid: String,
    pub chromosome: String,
    pub position: u64,
    pub genotype: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ParseResult {
    pub format: String,
    pub total_snps: usize,
    pub chromosomes: Vec<String>,
    pub snps: HashMap<String, SnpEntry>,
}

fn detect_format(first_lines: &[String]) -> &'static str {
    for line in first_lines {
        let l = line.to_lowercase();
        if l.contains("23andme") { return "twentythree"; }
        if l.contains("ancestrydna") || l.contains("ancestry") { return "ancestry"; }
        if l.starts_with("##fileformat=vcf") { return "vcf"; }
        if l.starts_with("\"rsid\"") || l.contains("myheritage") { return "myheritage"; }
        if !l.starts_with('#') && l.split('\t').count() == 4 {
            let parts: Vec<&str> = l.split('\t').collect();
            if parts[0].starts_with("rs") && parts[3].len() <= 2 {
                return "twentythree";
            }
        }
        if !l.starts_with('#') && l.split('\t').count() == 5 {
            return "ancestry";
        }
    }
    "unknown"
}

fn sort_chromosomes(chroms: std::collections::HashSet<String>) -> Vec<String> {
    let mut chromosomes: Vec<String> = chroms.into_iter().collect();
    chromosomes.sort_by(|a, b| {
        let na = a.parse::<u32>().unwrap_or(99);
        let nb = b.parse::<u32>().unwrap_or(99);
        na.cmp(&nb)
    });
    chromosomes
}

fn parse_twentythree(reader: BufReader<File>) -> ParseResult {
    let mut snps = HashMap::new();
    let mut chroms = std::collections::HashSet::new();

    for line in reader.lines().flatten() {
        if line.starts_with('#') || line.is_empty() { continue; }
        let parts: Vec<&str> = line.split('\t').collect();
        if parts.len() < 4 { continue; }
        let rsid = parts[0].to_string();
        if !rsid.starts_with("rs") && !rsid.starts_with('i') { continue; }
        let chrom = parts[1].to_string();
        let position = parts[2].parse::<u64>().unwrap_or(0);
        let genotype = parts[3].to_string();
        if genotype == "--" || genotype.is_empty() { continue; }
        chroms.insert(chrom.clone());
        snps.insert(rsid.clone(), SnpEntry { rsid, chromosome: chrom, position, genotype });
    }

    ParseResult {
        format: "twentythree".into(),
        total_snps: snps.len(),
        chromosomes: sort_chromosomes(chroms),
        snps,
    }
}

fn parse_ancestry(reader: BufReader<File>) -> ParseResult {
    let mut snps = HashMap::new();
    let mut chroms = std::collections::HashSet::new();

    for line in reader.lines().flatten() {
        if line.starts_with('#') || line.is_empty() { continue; }
        let parts: Vec<&str> = line.split('\t').collect();
        if parts.len() < 5 { continue; }
        let rsid = parts[0].to_string();
        if !rsid.starts_with("rs") { continue; }
        let chrom = parts[1].to_string();
        let position = parts[2].parse::<u64>().unwrap_or(0);
        let allele1 = parts[3];
        let allele2 = parts[4];
        if allele1 == "0" || allele2 == "0" { continue; }
        let genotype = format!("{}{}", allele1, allele2);
        chroms.insert(chrom.clone());
        snps.insert(rsid.clone(), SnpEntry { rsid, chromosome: chrom, position, genotype });
    }

    ParseResult {
        format: "ancestry".into(),
        total_snps: snps.len(),
        chromosomes: sort_chromosomes(chroms),
        snps,
    }
}

fn parse_vcf(reader: BufReader<File>) -> ParseResult {
    let mut snps = HashMap::new();
    let mut chroms = std::collections::HashSet::new();

    for line in reader.lines().flatten() {
        if line.starts_with('#') || line.is_empty() { continue; }
        let parts: Vec<&str> = line.split('\t').collect();
        if parts.len() < 10 { continue; }
        let chrom = parts[0].replace("chr", "").to_string();
        let position = parts[1].parse::<u64>().unwrap_or(0);
        let rsid = parts[2].to_string();
        let ref_allele = parts[3];
        let alt_allele = parts[4];

        let sample = parts[9];
        let gt = sample.split(':').next().unwrap_or(".");
        let genotype = match gt {
            "0/0" | "0|0" => format!("{}{}", ref_allele, ref_allele),
            "0/1" | "0|1" | "1/0" | "1|0" => format!("{}{}", ref_allele, alt_allele),
            "1/1" | "1|1" => format!("{}{}", alt_allele, alt_allele),
            _ => continue,
        };

        if rsid != "." {
            chroms.insert(chrom.clone());
            snps.insert(rsid.clone(), SnpEntry { rsid, chromosome: chrom, position, genotype });
        }
    }

    ParseResult {
        format: "vcf".into(),
        total_snps: snps.len(),
        chromosomes: sort_chromosomes(chroms),
        snps,
    }
}

fn parse_myheritage(reader: BufReader<File>) -> ParseResult {
    let mut snps = HashMap::new();
    let mut chroms = std::collections::HashSet::new();

    for line in reader.lines().flatten() {
        if line.starts_with('#') || line.is_empty() { continue; }
        let clean = line.replace('"', "");
        let parts: Vec<&str> = clean.split(',').collect();
        if parts.len() < 4 { continue; }
        let rsid = parts[0].to_string();
        if !rsid.starts_with("rs") { continue; }
        let chrom = parts[1].to_string();
        let position = parts[2].parse::<u64>().unwrap_or(0);
        let genotype = parts[3].trim().to_string();
        if genotype == "--" || genotype.is_empty() { continue; }
        chroms.insert(chrom.clone());
        snps.insert(rsid.clone(), SnpEntry { rsid, chromosome: chrom, position, genotype });
    }

    ParseResult {
        format: "myheritage".into(),
        total_snps: snps.len(),
        chromosomes: sort_chromosomes(chroms),
        snps,
    }
}

#[tauri::command]
pub async fn parse_genetic_file(path: String) -> Result<ParseResult, String> {
    // Read first 20 lines for format detection
    let detect_file = File::open(&path).map_err(|e| format!("Failed to open file: {}", e))?;
    let detect_reader = BufReader::new(detect_file);
    let first_lines: Vec<String> = detect_reader.lines().flatten().take(20).collect();

    let format = detect_format(&first_lines);

    let file = File::open(&path).map_err(|e| format!("Failed to open file: {}", e))?;
    let reader = BufReader::with_capacity(1024 * 1024, file);

    match format {
        "twentythree" => Ok(parse_twentythree(reader)),
        "ancestry" => Ok(parse_ancestry(reader)),
        "vcf" => Ok(parse_vcf(reader)),
        "myheritage" => Ok(parse_myheritage(reader)),
        _ => Err("Unknown file format. Supported: 23andMe, AncestryDNA, VCF, MyHeritage".to_string()),
    }
}
