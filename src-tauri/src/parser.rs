use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use std::io::{BufRead, BufReader, Read};
use std::fs::File;
use flate2::read::GzDecoder;

use crate::snp_database;

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
    pub total_lines_scanned: usize,
    pub chromosomes: Vec<String>,
    pub snps: HashMap<String, SnpEntry>,
    pub is_wgs: bool,
}

fn detect_format(first_bytes: &[u8], first_lines: &[String]) -> &'static str {
    // Check for gzip magic bytes
    if first_bytes.len() >= 2 && first_bytes[0] == 0x1f && first_bytes[1] == 0x8b {
        return "gzip";
    }
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

fn detect_format_from_lines(first_lines: &[String]) -> &'static str {
    for line in first_lines {
        let l = line.to_lowercase();
        if l.contains("23andme") { return "twentythree"; }
        if l.contains("ancestrydna") || l.contains("ancestry") { return "ancestry"; }
        if l.starts_with("##fileformat=vcf") { return "vcf"; }
        if l.starts_with("\"rsid\"") || l.contains("myheritage") { return "myheritage"; }
    }
    "unknown"
}

fn sort_chromosomes(chroms: HashSet<String>) -> Vec<String> {
    let mut chromosomes: Vec<String> = chroms.into_iter().collect();
    chromosomes.sort_by(|a, b| {
        let na = a.parse::<u32>().unwrap_or(99);
        let nb = b.parse::<u32>().unwrap_or(99);
        na.cmp(&nb)
    });
    chromosomes
}

fn parse_twentythree(reader: impl BufRead) -> ParseResult {
    let mut snps = HashMap::new();
    let mut chroms = HashSet::new();

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
        total_lines_scanned: snps.len(),
        chromosomes: sort_chromosomes(chroms),
        snps,
        is_wgs: false,
    }
}

fn parse_ancestry(reader: impl BufRead) -> ParseResult {
    let mut snps = HashMap::new();
    let mut chroms = HashSet::new();

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
        total_lines_scanned: snps.len(),
        chromosomes: sort_chromosomes(chroms),
        snps,
        is_wgs: false,
    }
}

/// Streaming VCF parser optimized for whole-genome sequencing files.
/// Instead of loading all ~5M variants into memory, we only keep the ones
/// that match our curated SNP database. This makes 4GB+ files feasible
/// with <100MB memory usage.
fn parse_vcf_streaming(reader: impl BufRead) -> ParseResult {
    // Build a lookup set of rsIDs we care about
    let known_snps = snp_database::get_all_snps();
    let known_rsids: HashSet<&str> = known_snps.keys().map(|s| s.as_str()).collect();

    // Also build a position-based lookup for VCFs that use "." as rsID
    // (common in WGS — many variants have chr:pos but no rsID assigned)
    // Format: "chr:pos" → rsid
    let mut position_to_rsid: HashMap<String, String> = HashMap::new();
    for (rsid, info) in known_snps.iter() {
        if !info.chromosome.is_empty() && info.position > 0 {
            let key = format!("{}:{}", info.chromosome, info.position);
            position_to_rsid.insert(key, rsid.clone());
        }
    }

    let mut matched_snps = HashMap::new();
    let mut chroms = HashSet::new();
    let mut total_lines: usize = 0;
    let mut is_wgs = false;

    for line in reader.lines().flatten() {
        if line.starts_with('#') || line.is_empty() { continue; }
        total_lines += 1;

        // WGS files typically have >1M variant lines
        if total_lines > 1_000_000 {
            is_wgs = true;
        }

        let parts: Vec<&str> = line.splitn(11, '\t').collect();
        if parts.len() < 10 { continue; }

        let raw_chrom = parts[0];
        let chrom = if raw_chrom.starts_with("chr") {
            &raw_chrom[3..]
        } else {
            raw_chrom
        };
        let position = parts[1].parse::<u64>().unwrap_or(0);
        let rsid_field = parts[2];
        let ref_allele = parts[3];
        let alt_allele = parts[4];

        // Skip multi-allelic sites for simplicity (e.g., "A,G")
        if alt_allele.contains(',') { continue; }

        // Check if this variant is one we care about — by rsID or by position
        let matched_rsid = if rsid_field != "." && known_rsids.contains(rsid_field) {
            Some(rsid_field.to_string())
        } else {
            let pos_key = format!("{}:{}", chrom, position);
            position_to_rsid.get(&pos_key).cloned()
        };

        let rsid = match matched_rsid {
            Some(r) => r,
            None => continue, // Skip — not in our database
        };

        // Parse genotype from sample column
        let sample = parts[9];
        let gt = sample.split(':').next().unwrap_or(".");
        let genotype = match gt {
            "0/0" | "0|0" => format!("{}{}", ref_allele, ref_allele),
            "0/1" | "0|1" | "1/0" | "1|0" => format!("{}{}", ref_allele, alt_allele),
            "1/1" | "1|1" => format!("{}{}", alt_allele, alt_allele),
            _ => continue,
        };

        chroms.insert(chrom.to_string());
        matched_snps.insert(rsid.clone(), SnpEntry {
            rsid,
            chromosome: chrom.to_string(),
            position,
            genotype,
        });
    }

    ParseResult {
        format: if is_wgs { "vcf-wgs" } else { "vcf" }.into(),
        total_snps: matched_snps.len(),
        total_lines_scanned: total_lines,
        chromosomes: sort_chromosomes(chroms),
        snps: matched_snps,
        is_wgs,
    }
}

fn parse_myheritage(reader: impl BufRead) -> ParseResult {
    let mut snps = HashMap::new();
    let mut chroms = HashSet::new();

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
        total_lines_scanned: snps.len(),
        chromosomes: sort_chromosomes(chroms),
        snps,
        is_wgs: false,
    }
}

/// Creates a buffered reader, handling both plain text and gzipped files.
fn open_file(path: &str) -> Result<(Box<dyn BufRead>, bool), String> {
    let file = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;

    // Read first 2 bytes to check for gzip magic
    let mut header = [0u8; 2];
    let file = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;
    {
        let mut peek = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;
        use std::io::Read;
        let _ = peek.read(&mut header);
    }

    let is_gzip = header[0] == 0x1f && header[1] == 0x8b;

    if is_gzip {
        // .vcf.gz / .gz files — decompress on the fly
        let decoder = GzDecoder::new(file);
        Ok((Box::new(BufReader::with_capacity(4 * 1024 * 1024, decoder)), true))
    } else {
        // Plain text — use large buffer for streaming
        Ok((Box::new(BufReader::with_capacity(4 * 1024 * 1024, file)), false))
    }
}

#[tauri::command]
pub async fn parse_genetic_file(path: String) -> Result<ParseResult, String> {
    // Open with gzip detection
    let (reader, is_gzip) = open_file(&path)?;

    // Read first 20 lines for format detection
    // We need to re-open for this since we consumed the reader
    let (detect_reader, _) = open_file(&path)?;
    let first_lines: Vec<String> = detect_reader.lines().flatten().take(20).collect();

    let format = if is_gzip {
        // For gzipped files, detect from decompressed content
        detect_format_from_lines(&first_lines)
    } else {
        detect_format_from_lines(&first_lines)
    };

    // Re-open for actual parsing (we consumed the detect reader)
    let (parse_reader, _) = open_file(&path)?;

    match format {
        "twentythree" => Ok(parse_twentythree(parse_reader)),
        "ancestry" => Ok(parse_ancestry(parse_reader)),
        "vcf" => Ok(parse_vcf_streaming(parse_reader)),
        "myheritage" => Ok(parse_myheritage(parse_reader)),
        _ => Err(format!(
            "Unknown file format. Supported: 23andMe (.txt), AncestryDNA (.txt), VCF (.vcf, .vcf.gz), MyHeritage (.csv). \
             Detected gzip: {}. First line: {}",
            is_gzip,
            first_lines.first().unwrap_or(&"(empty)".to_string())
        )),
    }
}
