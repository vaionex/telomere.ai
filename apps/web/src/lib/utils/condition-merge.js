/**
 * Condition name normalization map.
 * Maps duplicate/variant condition names to a single canonical name.
 * Applied during trait building to merge near-duplicate traits.
 */
export const CONDITION_MERGES = {
  // Alzheimer's — 4 variants → 1
  "Alzheimer disease": "Alzheimer's disease",
  "Alzheimer disease risk": "Alzheimer's disease",
  "Alzheimer risk": "Alzheimer's disease",
  "Late-onset Alzheimer's disease": "Alzheimer's disease",
  // Keep "Reduced Alzheimer's risk (protective)" separate — it's a different result

  // Parkinson's — 5 variants → 1
  "Parkinson disease risk": "Parkinson's disease",
  "Parkinson disease": "Parkinson's disease",
  "Parkinson disease (familial)": "Parkinson's disease",
  "Parkinson disease (30-75% lifetime risk)": "Parkinson's disease",
  "Parkinson disease risk (5x)": "Parkinson's disease",
  "Progressive supranuclear palsy": "Parkinson's disease", // related tauopathy

  // Obesity — 4 variants → 1
  "Obesity susceptibility": "Obesity",
  "Obesity risk": "Obesity",
  "Obesity tendency": "Obesity",

  // Cancer merges
  "Breast cancer risk": "Breast cancer",
  "Hereditary breast cancer": "Breast cancer",
  "Male breast cancer": "Breast cancer",
  "Lung cancer risk": "Lung cancer",
  "Lung cancer risk (smokers)": "Lung cancer",
  "Prostate cancer risk": "Prostate cancer",
  "Bladder cancer risk (occupational)": "Bladder cancer",
  "Colorectal cancer risk": "Colorectal cancer",
  "Cancer susceptibility variation": "Cancer susceptibility",
  "Cancer risk variation": "Cancer susceptibility",
  "Melanoma susceptibility": "Melanoma risk",

  // Cardiovascular
  "Cardiovascular disease risk": "Cardiovascular disease",
  "Coronary heart disease": "Coronary artery disease",
  "Heart disease risk": "Coronary artery disease",

  // Diabetes
  "Type 2 diabetes risk": "Type 2 diabetes",
  "Beta-cell dysfunction": "Type 2 diabetes",
  "Impaired insulin secretion": "Type 2 diabetes",
  "Elevated fasting glucose": "Type 2 diabetes",
  "Insulin resistance": "Insulin resistance",
  "Insulin sensitivity": "Insulin resistance",

  // Hypertension
  "Hypertension risk": "Hypertension",
  "Blood pressure variation": "Hypertension",

  // Alzheimer longevity
  // "Reduced Alzheimer's risk (protective)" stays separate

  // Aging
  "Accelerated aging risk": "Accelerated aging",
  "Biological aging": "Accelerated aging",
  "Cellular aging": "Accelerated aging",
  "Aging rate": "Accelerated aging",

  // Anxiety/Depression
  "Anxiety susceptibility": "Anxiety",
  "Anxiety tendency": "Anxiety",
  "Depression susceptibility": "Depression risk",

  // ADHD
  "ADHD association": "ADHD",
  "ADHD susceptibility": "ADHD",

  // Eye/skin/hair appearance
  "Eye color determination": "Eye color",
  "Fair skin tendency": "Fair skin",
  "Lighter skin pigmentation": "Fair skin",
  "Red/auburn hair": "Red hair",

  // Autoimmune
  "Autoimmune disease risk": "Autoimmune susceptibility",
  "Autoimmune thyroiditis": "Thyroid autoimmunity",

  // Inflammatory
  "Inflammatory response variation": "Inflammatory response",
  "Inflammatory disease susceptibility": "Inflammatory response",
  "Chronic inflammation": "Systemic inflammation",
  "Inflammaging": "Systemic inflammation",
  "Inflammation levels": "Systemic inflammation",

  // Homocysteine
  "Homocysteine elevation (with C677T)": "Elevated homocysteine",
  "Homocysteine elevation": "Elevated homocysteine",
  "Altered homocysteine metabolism": "Elevated homocysteine",

  // HDL
  "HDL cholesterol levels": "HDL cholesterol variation",

  // Cystic fibrosis
  "Cystic fibrosis (homozygous)": "Cystic fibrosis",
  "CF carrier status": "Cystic fibrosis",

  // Other carrier merges
  "Non-syndromic hearing loss (homozygous)": "Non-syndromic hearing loss",
  "Tay-Sachs disease (homozygous)": "Tay-Sachs disease",
  "Tay-Sachs disease carrier": "Tay-Sachs disease",
  "Tay-Sachs carrier": "Tay-Sachs disease",
  "Phenylketonuria (homozygous)": "Phenylketonuria",
  "PKU carrier": "Phenylketonuria",
  "Sickle cell disease (homozygous)": "Sickle cell disease",
  "Sickle cell trait (carrier)": "Sickle cell disease",
  "Spinal muscular atrophy (homozygous)": "Spinal muscular atrophy",
  "SMA carrier": "Spinal muscular atrophy",
  "MCAD deficiency (homozygous)": "MCAD deficiency",
  "Pompe disease (homozygous)": "Pompe disease",

  // Immune
  "Immune function variation": "Immune function",
  "Altered innate immunity": "Immune function",

  // Vitamin D
  "Lower 25(OH)D levels": "Vitamin D deficiency",
  "Lower total 25(OH)D levels": "Vitamin D deficiency",
  "Lower vitamin D levels": "Vitamin D deficiency",
  "Vitamin D deficiency susceptibility": "Vitamin D deficiency",
  "Reduced vitamin D synthesis": "Vitamin D deficiency",
  "Vitamin D requirements": "Vitamin D deficiency",
  "Vitamin D transport variation": "Vitamin D deficiency",
  "Altered vitamin D bioavailability": "Vitamin D deficiency",

  // Pain
  "Pain sensitivity variation": "Pain sensitivity",
  "Higher pain sensitivity": "Pain sensitivity",
  "Altered pain/anesthesia sensitivity": "Pain sensitivity",

  // Asthma
  "Asthma response": "Asthma",
  "Asthma treatment response": "Asthma",

  // Drug metabolism merges
  "NSAID toxicity risk": "NSAID toxicity",
  "NSAID adverse effects": "NSAID toxicity",
  "NSAID efficacy variation": "NSAID toxicity",
  "Thiopurine toxicity (azathioprine, 6-MP)": "Thiopurine toxicity",
  "CYP2D6 poor metabolizer": "CYP2D6 metabolism variation",
  "Intermediate CYP2D6 metabolism": "CYP2D6 metabolism variation",
  "Reduced CYP2D6 metabolism": "CYP2D6 metabolism variation",
  "Reduced metabolism of CYP2D6 substrates": "CYP2D6 metabolism variation",
  "Poor CYP2C19 metabolism": "CYP2C19 poor metabolizer",
  "Poor drug metabolism": "Reduced drug metabolism",

  // Warfarin
  "Warfarin dose sensitivity": "Warfarin sensitivity",
  "Warfarin hypersensitivity": "Warfarin sensitivity",

  // SSRI
  "SSRI response variation": "SSRI response",

  // Stress
  "Stress response": "Stress sensitivity",
  "Stress resilience variation": "Stress resistance",

  // Longevity
  "Longevity association": "Longevity",
  "Cardiovascular longevity": "Longevity",
  "Cardiovascular protection variation": "Longevity",

  // Obesity/metabolic
  "Increased appetite": "Obesity",
  "Reduced thermogenesis": "Obesity",

  // Telomere
  "Telomere shortening": "Shorter telomeres",
  "Telomere length variation": "Shorter telomeres",
  "Reduced telomerase": "Shorter telomeres",

  // Crohn/IBD
  "Crohn disease (protective)": "Crohn disease",
  "Ulcerative colitis (protective)": "Inflammatory bowel disease",

  // Iron
  "Iron overload": "Hereditary hemochromatosis",
  "Compound hemochromatosis risk": "Hereditary hemochromatosis",
  "Mild iron elevation": "Hereditary hemochromatosis",

  // Venous
  "Venous thrombosis risk": "Venous thromboembolism",
  "Deep vein thrombosis": "Venous thromboembolism",
  "Pulmonary embolism": "Venous thromboembolism",

  // Caffeine
  "Insomnia from caffeine": "Caffeine sensitivity",
  "Slow caffeine metabolism": "Caffeine sensitivity",
  "Heart attack risk with >3 cups coffee/day": "Caffeine sensitivity",

  // B12
  "Lower B12 levels": "Vitamin B12 deficiency risk",
  "Altered B12 transport": "Vitamin B12 deficiency risk",
  "Reduced B12 utilization": "Vitamin B12 deficiency risk",

  // Methylation
  "Altered methionine metabolism": "Reduced methylation capacity",

  // Sleep
  "Delayed sleep phase": "Evening chronotype",
  "Advanced sleep phase": "Morning chronotype",

  // Drug transport
  "Altered drug bioavailability": "Altered drug transport",
  "Drug disposition variation": "Altered drug transport",

  // Statin
  "Statin-induced myopathy": "Statin metabolism variation",
  "Simvastatin intolerance": "Statin metabolism variation",
  "Rhabdomyolysis risk": "Statin metabolism variation",

  // Fluoropyrimidine
  "Severe fluoropyrimidine toxicity": "Fluoropyrimidine toxicity",
  "DPD deficiency": "Fluoropyrimidine toxicity",

  // Misc
  "Carrier status": "Cystic fibrosis", // generic carrier → most common
  "Drug toxicity risk": "Increased drug sensitivity",
  "Drug resistance variation": "Cancer drug resistance",
  "Hormonal variation": "Estrogen level variation",
  "Estrogen metabolism": "Estrogen level variation",
  "Lipid metabolism": "Hyperlipidemia",
  "Elevated triglycerides": "Hyperlipidemia",
  "Drug metabolism variation": "Reduced drug metabolism",
  "Metabolic trait": "Metabolic regulation",
  "Obesity risk": "Obesity",

  // Height merges
  "Predicted shorter height": "Height variation",
  "Predicted taller height": "Height variation",
  "Earlier puberty timing": "Growth timing variation",

  // Obesity / body composition merges
  "Obesity susceptibility": "Obesity",
  "Higher body fat percentage": "Obesity",
  "Central adiposity tendency": "Obesity",
  "Reduced thermogenesis": "Obesity",

  // Nose shape
  "Nose shape variation": "Facial morphology",

  // Freckling
  "Increased freckling": "Freckling tendency",

  // Dyslexia
  "Dyslexia susceptibility": "Reading difficulty susceptibility",

  // Nicotine
  "Nicotine dependence susceptibility": "Nicotine dependence",

  // Sun sensitivity
  "Sun sensitivity": "Sun sensitivity / fair skin",
  "Fair skin tendency": "Sun sensitivity / fair skin",

  // Depression
  "Depression susceptibility": "Depression risk",

  // Cognitive
  "Higher general intelligence": "Cognitive performance variation",
  "Cortical thickness variation": "Cognitive performance variation",
  "Educational attainment variation": "Cognitive performance variation",
  "Mathematical ability variation": "Cognitive performance variation",

  // Insomnia / sleep
  "Insomnia susceptibility": "Insomnia risk",
  "Short sleep duration tendency": "Sleep duration variation",
};

/**
 * Normalize a condition name using the merge map.
 * Returns the canonical name, or the original if no merge exists.
 */
export function normalizeCondition(condition) {
  return CONDITION_MERGES[condition] || condition;
}
