/**
 * Pre-bundled PGS scoring data
 * Simplified from published PGS Catalog entries with real GWAS SNP-weight associations.
 * Offline-first: no external API calls needed.
 */
export const PGS_SCORES = {
  'PGS000001': {
    trait: 'Coronary Artery Disease',
    category: 'health',
    description: 'Polygenic risk for coronary artery disease based on common variants',
    variants: [
      { rsid: 'rs10455872', effectAllele: 'G', weight: 0.49 },
      { rsid: 'rs4977574', effectAllele: 'G', weight: 0.29 },
      { rsid: 'rs1333049', effectAllele: 'C', weight: 0.28 },
      { rsid: 'rs6725887', effectAllele: 'C', weight: 0.17 },
      { rsid: 'rs9349379', effectAllele: 'G', weight: 0.15 },
      { rsid: 'rs12526453', effectAllele: 'C', weight: 0.13 },
      { rsid: 'rs1746048', effectAllele: 'C', weight: 0.11 },
      { rsid: 'rs2505083', effectAllele: 'C', weight: 0.10 },
      { rsid: 'rs9982601', effectAllele: 'T', weight: 0.18 },
      { rsid: 'rs3184504', effectAllele: 'T', weight: 0.13 },
      { rsid: 'rs635634', effectAllele: 'T', weight: 0.11 },
      { rsid: 'rs11206510', effectAllele: 'T', weight: 0.15 },
      { rsid: 'rs17114036', effectAllele: 'A', weight: -0.19 },
      { rsid: 'rs264', effectAllele: 'G', weight: 0.09 },
      { rsid: 'rs4420638', effectAllele: 'G', weight: 0.16 },
    ]
  },
  'PGS000013': {
    trait: 'Type 2 Diabetes',
    category: 'health',
    description: 'Polygenic risk for type 2 diabetes',
    variants: [
      { rsid: 'rs7903146', effectAllele: 'T', weight: 0.34 },
      { rsid: 'rs1801282', effectAllele: 'C', weight: 0.14 },
      { rsid: 'rs5219', effectAllele: 'T', weight: 0.14 },
      { rsid: 'rs13266634', effectAllele: 'C', weight: 0.12 },
      { rsid: 'rs4402960', effectAllele: 'T', weight: 0.14 },
      { rsid: 'rs10811661', effectAllele: 'T', weight: 0.17 },
      { rsid: 'rs8050136', effectAllele: 'A', weight: 0.12 },
      { rsid: 'rs1111875', effectAllele: 'C', weight: 0.12 },
      { rsid: 'rs10946398', effectAllele: 'C', weight: 0.12 },
      { rsid: 'rs12779790', effectAllele: 'G', weight: 0.11 },
      { rsid: 'rs7756992', effectAllele: 'G', weight: 0.15 },
      { rsid: 'rs2237892', effectAllele: 'C', weight: 0.13 },
    ]
  },
  'PGS000018': {
    trait: 'Breast Cancer',
    category: 'health',
    description: 'Polygenic risk for breast cancer',
    variants: [
      { rsid: 'rs2981582', effectAllele: 'T', weight: 0.26 },
      { rsid: 'rs3803662', effectAllele: 'A', weight: 0.20 },
      { rsid: 'rs889312', effectAllele: 'C', weight: 0.13 },
      { rsid: 'rs3817198', effectAllele: 'C', weight: 0.07 },
      { rsid: 'rs13387042', effectAllele: 'A', weight: 0.12 },
      { rsid: 'rs13281615', effectAllele: 'G', weight: 0.08 },
      { rsid: 'rs4973768', effectAllele: 'T', weight: 0.11 },
      { rsid: 'rs6504950', effectAllele: 'G', weight: -0.08 },
      { rsid: 'rs10941679', effectAllele: 'G', weight: 0.12 },
      { rsid: 'rs2046210', effectAllele: 'A', weight: 0.09 },
    ]
  },
  'PGS000039': {
    trait: 'Body Mass Index',
    category: 'nutrition',
    description: 'Genetic predisposition for higher or lower BMI',
    variants: [
      { rsid: 'rs1558902', effectAllele: 'A', weight: 0.39 },
      { rsid: 'rs6567160', effectAllele: 'C', weight: 0.30 },
      { rsid: 'rs13021737', effectAllele: 'G', weight: 0.26 },
      { rsid: 'rs10938397', effectAllele: 'G', weight: 0.18 },
      { rsid: 'rs543874', effectAllele: 'G', weight: 0.24 },
      { rsid: 'rs2207139', effectAllele: 'G', weight: 0.19 },
      { rsid: 'rs3101336', effectAllele: 'C', weight: 0.16 },
      { rsid: 'rs7138803', effectAllele: 'A', weight: 0.12 },
      { rsid: 'rs12446632', effectAllele: 'G', weight: 0.16 },
      { rsid: 'rs987237', effectAllele: 'G', weight: 0.15 },
    ]
  },
  'PGS000058': {
    trait: "Alzheimer's Disease",
    category: 'longevity',
    description: "Polygenic risk for late-onset Alzheimer's disease",
    variants: [
      { rsid: 'rs429358', effectAllele: 'C', weight: 1.12 },
      { rsid: 'rs7412', effectAllele: 'T', weight: -0.67 },
      { rsid: 'rs6733839', effectAllele: 'T', weight: 0.17 },
      { rsid: 'rs10948363', effectAllele: 'G', weight: 0.10 },
      { rsid: 'rs9271192', effectAllele: 'C', weight: 0.10 },
      { rsid: 'rs11218343', effectAllele: 'C', weight: -0.17 },
      { rsid: 'rs28834970', effectAllele: 'C', weight: 0.10 },
      { rsid: 'rs10792832', effectAllele: 'A', weight: 0.14 },
      { rsid: 'rs9331896', effectAllele: 'C', weight: -0.13 },
      { rsid: 'rs983392', effectAllele: 'G', weight: -0.10 },
    ]
  },
  'PGS000073': {
    trait: 'Prostate Cancer',
    category: 'health',
    description: 'Polygenic risk for prostate cancer',
    variants: [
      { rsid: 'rs10993994', effectAllele: 'T', weight: 0.21 },
      { rsid: 'rs4242382', effectAllele: 'A', weight: 0.32 },
      { rsid: 'rs1447295', effectAllele: 'A', weight: 0.20 },
      { rsid: 'rs16901979', effectAllele: 'A', weight: 0.39 },
      { rsid: 'rs6983267', effectAllele: 'G', weight: 0.18 },
      { rsid: 'rs1859962', effectAllele: 'G', weight: 0.18 },
      { rsid: 'rs2735839', effectAllele: 'G', weight: -0.20 },
      { rsid: 'rs7931342', effectAllele: 'G', weight: 0.14 },
      { rsid: 'rs10896449', effectAllele: 'G', weight: 0.13 },
      { rsid: 'rs11649743', effectAllele: 'G', weight: 0.12 },
    ]
  },
  'PGS000296': {
    trait: 'Atrial Fibrillation',
    category: 'health',
    description: 'Polygenic risk for atrial fibrillation',
    variants: [
      { rsid: 'rs2200733', effectAllele: 'T', weight: 0.40 },
      { rsid: 'rs10033464', effectAllele: 'T', weight: 0.24 },
      { rsid: 'rs6843082', effectAllele: 'G', weight: 0.14 },
      { rsid: 'rs3807989', effectAllele: 'G', weight: 0.13 },
      { rsid: 'rs7164883', effectAllele: 'G', weight: 0.10 },
      { rsid: 'rs2106261', effectAllele: 'T', weight: 0.10 },
      { rsid: 'rs6838973', effectAllele: 'T', weight: 0.09 },
      { rsid: 'rs3903239', effectAllele: 'C', weight: 0.08 },
    ]
  },
  'PGS000328': {
    trait: 'Schizophrenia',
    category: 'health',
    description: 'Polygenic risk for schizophrenia',
    variants: [
      { rsid: 'rs1233578', effectAllele: 'G', weight: 0.12 },
      { rsid: 'rs2007044', effectAllele: 'G', weight: 0.10 },
      { rsid: 'rs115329265', effectAllele: 'A', weight: 0.15 },
      { rsid: 'rs4648845', effectAllele: 'T', weight: 0.08 },
      { rsid: 'rs2851447', effectAllele: 'G', weight: 0.09 },
      { rsid: 'rs12966547', effectAllele: 'G', weight: 0.07 },
      { rsid: 'rs2514218', effectAllele: 'C', weight: 0.10 },
      { rsid: 'rs11191580', effectAllele: 'T', weight: 0.09 },
    ]
  },
  'PGS000334': {
    trait: 'Major Depressive Disorder',
    category: 'health',
    description: 'Polygenic risk for major depression',
    variants: [
      { rsid: 'rs1432639', effectAllele: 'G', weight: 0.03 },
      { rsid: 'rs2422321', effectAllele: 'A', weight: 0.04 },
      { rsid: 'rs10514299', effectAllele: 'T', weight: 0.05 },
      { rsid: 'rs1518395', effectAllele: 'C', weight: 0.03 },
      { rsid: 'rs2568958', effectAllele: 'A', weight: 0.03 },
      { rsid: 'rs12552', effectAllele: 'G', weight: 0.04 },
      { rsid: 'rs11209948', effectAllele: 'A', weight: 0.03 },
      { rsid: 'rs2179744', effectAllele: 'C', weight: 0.03 },
    ]
  },
  'PGS000662': {
    trait: 'Height',
    category: 'traits',
    description: 'Genetic contribution to adult height',
    variants: [
      { rsid: 'rs1042725', effectAllele: 'C', weight: 0.29 },
      { rsid: 'rs3791679', effectAllele: 'A', weight: 0.24 },
      { rsid: 'rs6060369', effectAllele: 'T', weight: 0.22 },
      { rsid: 'rs11107116', effectAllele: 'G', weight: 0.18 },
      { rsid: 'rs6830062', effectAllele: 'G', weight: 0.17 },
      { rsid: 'rs4911494', effectAllele: 'T', weight: 0.15 },
      { rsid: 'rs3760318', effectAllele: 'G', weight: 0.14 },
      { rsid: 'rs8756', effectAllele: 'A', weight: 0.13 },
      { rsid: 'rs724016', effectAllele: 'G', weight: 0.20 },
      { rsid: 'rs2274432', effectAllele: 'C', weight: 0.12 },
    ]
  }
};
