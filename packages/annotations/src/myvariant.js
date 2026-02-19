const BASE_URL = 'https://myvariant.info/v1';

// Batch query — up to 1000 rsids at once
export async function batchAnnotate(rsids, fields = 'clinvar,gnomad,cadd,dbsnp,snpeff') {
  const chunks = chunkArray(rsids, 1000);
  const results = new Map();

  for (const chunk of chunks) {
    const response = await fetch(`${BASE_URL}/variant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `ids=${chunk.join(',')}&fields=${fields}`
    });
    const data = await response.json();
    for (const item of data) {
      if (item._id && !item.notfound) {
        results.set(item.query, parseAnnotation(item));
      }
    }
  }
  return results;
}

// Single variant query
export async function annotateVariant(rsid) {
  const fields = 'clinvar,gnomad,cadd,dbsnp,snpeff,dbnsfp';
  const response = await fetch(`${BASE_URL}/variant/${rsid}?fields=${fields}`);
  if (!response.ok) return null;
  const data = await response.json();
  return parseAnnotation(data);
}

// Parse the raw MyVariant response into our format
function parseAnnotation(data) {
  return {
    rsid: data.dbsnp?.rsid || data._id,
    gene: data.dbsnp?.gene?.symbol || data.clinvar?.gene?.symbol || null,
    chromosome: data.dbsnp?.chrom || null,
    position: data.dbsnp?.hg38?.start || null,

    // ClinVar clinical significance
    clinvar: data.clinvar ? {
      significance: data.clinvar.rcv?.[0]?.clinical_significance || data.clinvar.clinical_significance || null,
      conditions: extractConditions(data.clinvar),
      reviewStatus: data.clinvar.rcv?.[0]?.review_status || null,
    } : null,

    // gnomAD population frequencies
    frequencies: data.gnomad ? {
      alleleFrequency: data.gnomad.af?.af || null,
      afr: data.gnomad.af?.af_afr || null,
      eur: data.gnomad.af?.af_nfe || null,
      eas: data.gnomad.af?.af_eas || null,
      amr: data.gnomad.af?.af_amr || null,
      sas: data.gnomad.af?.af_sas || null,
    } : null,

    // CADD pathogenicity score
    cadd: data.cadd ? {
      phred: data.cadd.phred || null,
      rawScore: data.cadd.raw_score || null,
    } : null,

    // Predicted effects
    effects: data.snpeff?.ann ? extractEffects(data.snpeff.ann) : [],
  };
}

function extractConditions(clinvar) {
  if (!clinvar.rcv) return [];
  const rcvs = Array.isArray(clinvar.rcv) ? clinvar.rcv : [clinvar.rcv];
  return rcvs.map(r => r.conditions?.identifiers?.medgen || r.preferred_name).filter(Boolean);
}

function extractEffects(ann) {
  const anns = Array.isArray(ann) ? ann : [ann];
  return anns.slice(0, 5).map(a => ({
    effect: a.putative_impact || null,
    geneName: a.genename || null,
    hgvs: a.hgvs_p || null,
  }));
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
