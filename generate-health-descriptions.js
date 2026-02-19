#!/usr/bin/env node
// Generator script for health category trait descriptions
// Each condition gets a unique, biologically specific 500+ word description

const fs = require('fs');

const CONDITIONS = {
  "apoe-expression-variation": {
    name: "APOE expression variation",
    genes: "APOE",
    summary: "APOE expression variation reflects differences in apolipoprotein E production that influence cholesterol transport, neuroinflammation, and amyloid clearance throughout the brain and cardiovascular system.",
    details: `## Understanding APOE Expression Variation

APOE expression variation describes genetic differences that alter how much apolipoprotein E protein your cells produce and how effectively it functions across multiple organ systems. Apolipoprotein E is a 299-amino-acid glycoprotein primarily synthesized in the liver (accounting for roughly 75% of peripheral production) and by astrocytes within the central nervous system. This protein serves as a critical ligand for low-density lipoprotein receptors (LDLR) and LDL receptor-related protein 1 (LRP1), mediating the cellular uptake of cholesterol-rich lipoprotein particles from the bloodstream and interstitial fluid.

### The Molecular Biology of APOE

The APOE gene resides on chromosome 19q13.32 within a gene cluster that also includes APOC1, APOC2, and APOC4. Three common alleles — ε2, ε3, and ε4 — arise from two single-nucleotide polymorphisms: rs429358 (determining the cysteine-to-arginine substitution at position 112) and rs7412 (governing the cysteine-to-arginine change at position 158). These substitutions fundamentally alter the protein's three-dimensional folding, receptor-binding affinity, and lipid-association properties. The ε4 isoform binds preferentially to very-low-density lipoprotein (VLDL) particles rather than high-density lipoprotein (HDL), shifting the balance of cholesterol redistribution toward pro-atherogenic pathways.

Beyond the canonical alleles, regulatory variants in the APOE promoter region — including rs405509 (the -219G/T polymorphism) — modulate transcriptional activity by 20-40%, directly affecting circulating apoE protein concentrations. The APOE ε4 promoter haplotype has been associated with reduced transcription factor binding at the APOE/APOC1 intergenic regulatory element, diminishing astrocyte-derived apoE production in the brain by approximately 30-50% compared to ε3 carriers.

### How Expression Variation Affects Health

In the brain, apoE produced by astrocytes is the primary vehicle for redistributing cholesterol and phospholipids to neurons, which require these lipids for synaptic membrane remodeling, axonal growth, and myelin repair. When APOE expression is reduced — whether through regulatory variants or the inherent instability of the ε4 isoform — neurons experience relative cholesterol deprivation. This drives compensatory upregulation of endogenous cholesterol synthesis via the SREBP2/HMGCR pathway, increasing neuronal metabolic burden and vulnerability to oxidative stress.

Simultaneously, apoE plays a pivotal role in amyloid-beta (Aβ) clearance. ApoE facilitates Aβ transport across the blood-brain barrier via LRP1 and mediates microglial phagocytosis of amyloid deposits. The ε4 isoform clears Aβ 2-3 times less efficiently than ε3, while also promoting Aβ oligomerization and fibril formation. Reduced APOE expression compounds this deficit, accelerating amyloid plaque accumulation years before clinical symptoms emerge.

In the cardiovascular system, expression variation influences remnant lipoprotein clearance. Lower apoE levels impair the hepatic uptake of chylomicron remnants and intermediate-density lipoproteins (IDL), leading to postprandial hyperlipidemia and increased exposure of arterial walls to atherogenic particles. This contributes to endothelial dysfunction, foam cell formation, and progressive atherosclerotic plaque development.

### What Risk Levels Mean for APOE Expression

**Elevated risk** indicates you carry variants associated with significantly reduced APOE expression or the ε4 allele (or both), placing you at increased susceptibility for both neurodegenerative and cardiovascular pathology. Homozygous ε4/ε4 carriers face 8-12 times greater Alzheimer's risk and accelerated coronary artery disease progression. Regulatory variants compounding ε4 status can shift disease onset earlier by 5-8 years.

**Moderate risk** typically reflects heterozygous ε3/ε4 status or ε3/ε3 with unfavorable regulatory variants. Lifetime Alzheimer's risk is approximately 2-3 times baseline, and cardiovascular risk is modestly elevated, particularly with concurrent metabolic risk factors.

**Typical risk** means your APOE genotype and expression profile support efficient cholesterol redistribution and amyloid clearance. The ε3/ε3 genotype (present in ~60% of most populations) and favorable regulatory variants provide a strong foundation, though environmental factors remain influential.

### Actionable Strategies for APOE Expression Variation

Dietary intervention is particularly impactful for APOE variant carriers. The MIND diet — combining Mediterranean and DASH dietary patterns — has demonstrated 53% Alzheimer's risk reduction in rigorous adherence, with even moderate adherence conferring 35% reduction. For ε4 carriers specifically, limiting saturated fat intake below 13g daily and replacing with monounsaturated fats (olive oil, avocado) reduces LDL cholesterol more dramatically than in non-carriers, reflecting the isoform's preferential VLDL binding.

DHA (docosahexaenoic acid) supplementation at 1-2g daily supports neuronal membrane integrity and may partially compensate for impaired apoE-mediated cholesterol delivery to neurons. Regular aerobic exercise (150+ minutes weekly at moderate-to-vigorous intensity) upregulates APOE expression in astrocytes by 40-60% through BDNF-mediated signaling, partially offsetting genetic expression deficits.

Sleep optimization is critical — during deep slow-wave sleep, the glymphatic system clears interstitial solutes including Aβ at rates 10-20 times higher than during wakefulness. ε4 carriers with disrupted sleep architecture show accelerated amyloid accumulation on PET imaging. Targeting 7-8 hours with emphasis on sleep continuity (avoiding fragmentation) provides measurable neuroprotection.

For personalized guidance on managing APOE-related risks through precision nutrition and lifestyle intervention, visit [healthpro.ai](https://healthpro.ai/conditions/apoe-expression-variation) to explore genomics-informed health optimization strategies.`
  },

  "age-related-hearing-loss": {
    name: "Age-related hearing loss",
    genes: "GRM7",
    summary: "Age-related hearing loss (presbycusis) involves progressive degeneration of cochlear hair cells and auditory neurons, influenced by GRM7 variants affecting glutamate signaling in the inner ear.",
    details: `## Understanding Age-Related Hearing Loss

Age-related hearing loss, clinically termed presbycusis, represents the gradual, irreversible deterioration of auditory function that affects approximately one-third of adults over age 65 and two-thirds of those over 70. Unlike noise-induced hearing loss, which primarily damages the stereocilia of outer hair cells through mechanical trauma, presbycusis involves a complex, multifactorial degeneration encompassing sensory hair cells, stria vascularis (the metabolic engine of the cochlea), spiral ganglion neurons, and the central auditory processing pathways in the temporal cortex.

### The Molecular Biology of GRM7 and Cochlear Function

The GRM7 gene on chromosome 3p26.1 encodes metabotropic glutamate receptor 7 (mGluR7), a Group III metabotropic receptor that functions as a presynaptic autoreceptor at glutamatergic synapses throughout the nervous system, including the critical synapse between inner hair cells and type I spiral ganglion afferent neurons. This synapse — the first neural relay in the auditory pathway — uses glutamate as its primary neurotransmitter, released from ribbon synapses in the inner hair cell base in response to stereocilia deflection by basilar membrane vibration.

mGluR7 is a Gi/Go-coupled receptor that, when activated by glutamate binding, reduces cAMP production via adenylyl cyclase inhibition, decreases presynaptic calcium influx through N-type and P/Q-type voltage-gated calcium channels, and ultimately dampens glutamate release. This negative feedback loop is essential for preventing glutamate excitotoxicity — a pathological process where excessive glutamate receptor activation leads to lethal calcium influx into postsynaptic neurons.

The key variant rs11928865 in GRM7 (a T>C substitution in the intronic regulatory region) reduces mGluR7 expression by approximately 25-35%, weakening this protective autoreceptor brake. Without adequate mGluR7 function, glutamate accumulates in the synaptic cleft during sustained auditory stimulation, chronically overactivating postsynaptic AMPA and NMDA receptors on spiral ganglion dendrites. The resulting calcium overload activates calpains (calcium-dependent proteases), mitochondrial permeability transition, and caspase cascades that progressively destroy cochlear synapses — a phenomenon recently termed "cochlear synaptopathy" or "hidden hearing loss."

### The Cascade of Presbycusis

Cochlear aging proceeds through several interconnected pathways. Strial presbycusis involves degeneration of the stria vascularis — the three-cell-layer epithelium lining the lateral cochlear wall that maintains the endocochlear potential (+80mV to +100mV) essential for hair cell mechanotransduction. As marginal, intermediate, and basal cells of the stria deteriorate, endocochlear potential drops, reducing the electrochemical driving force for potassium ions through hair cell transduction channels. This manifests as a flat or gently sloping audiometric pattern.

Sensory presbycusis involves direct loss of outer hair cells, beginning at the cochlear base (high-frequency region) and progressing apically. Outer hair cells amplify basilar membrane motion by 40-60 dB through prestin-mediated electromotility — a unique piezoelectric property where the motor protein prestin (encoded by SLC26A5) contracts and elongates the cell body at acoustic frequencies up to 70 kHz. Loss of outer hair cells eliminates this cochlear amplifier, producing the characteristic high-frequency hearing loss with recruitment (abnormal loudness growth).

Neural presbycusis — accelerated by GRM7 dysfunction — involves loss of spiral ganglion neurons and their myelinated axonal projections through the modiolus. The human cochlea contains approximately 30,000 spiral ganglion neurons at birth; by age 80, 20-40% are typically lost, with GRM7 risk variants potentially accelerating this by 10-15 years equivalent.

### What Risk Levels Mean for Hearing Loss

**Elevated risk** indicates GRM7 variants that significantly impair glutamate homeostasis at cochlear synapses. Individuals may experience measurable high-frequency hearing loss (>25 dB at 4-8 kHz) a decade earlier than population average, with speech-in-noise discrimination declining disproportionately to pure-tone thresholds due to cochlear synaptopathy.

**Moderate risk** suggests partial GRM7 impairment. Hearing changes follow a typical trajectory but with reduced resilience to noise exposure, ototoxic medications (aminoglycosides, cisplatin, loop diuretics), and metabolic insults (diabetes, cardiovascular disease).

**Typical risk** means GRM7 function is well-preserved. Standard age-related changes still occur, but the timeline is closer to population average, and the cochlea demonstrates better recovery from acoustic insults.

### Actionable Strategies

Noise exposure management is paramount — cumulative lifetime noise dose is the strongest modifiable risk factor. Using hearing protection at >85 dB environments (concerts, power tools, motorcycles) preserves the cochlear structures that GRM7 variants make more vulnerable. The "60/60 rule" for personal audio devices (60% volume, 60-minute sessions) provides practical daily protection.

Cardiovascular health directly impacts strial function because the stria vascularis is among the most metabolically active tissues in the body, requiring robust blood supply through the spiral modiolar artery. Regular aerobic exercise, blood pressure control, and statin therapy (when indicated) preserve cochlear microvascular perfusion. Magnesium supplementation (400mg daily) has demonstrated otoprotective effects by antagonizing NMDA receptor-mediated calcium influx — directly counteracting GRM7-related excitotoxic vulnerability.

Annual audiometric screening starting at age 50 (rather than the standard 65) is advisable for those with elevated genetic risk, enabling early detection and intervention with hearing aids or assistive devices before central auditory processing adaptations entrench.

For comprehensive hearing health strategies informed by your genetic profile, visit [healthpro.ai](https://healthpro.ai/conditions/age-related-hearing-loss).`
  },

  "age-related-macular-degeneration": {
    name: "Age-related macular degeneration",
    genes: "ARMS2, CFH",
    summary: "Age-related macular degeneration (AMD) involves progressive destruction of the macula's photoreceptors and retinal pigment epithelium, driven by complement dysregulation (CFH) and mitochondrial dysfunction (ARMS2).",
    details: `## Understanding Age-Related Macular Degeneration

Age-related macular degeneration (AMD) is the leading cause of irreversible central vision loss in individuals over 50 in developed nations, affecting approximately 196 million people worldwide. The disease targets the macula — a 5.5mm-diameter region of the central retina containing the highest density of cone photoreceptors (199,000 per mm² at the foveal center) — progressively destroying the sharp, high-resolution vision required for reading, driving, and facial recognition. AMD progresses through distinct stages: early AMD (medium drusen, 63-124μm), intermediate AMD (large drusen >125μm or pigmentary changes), and late AMD (either geographic atrophy or neovascular/"wet" AMD).

### The Genetics: CFH and ARMS2

**CFH (Complement Factor H):** The CFH gene on chromosome 1q31.3 encodes complement factor H, a 155-kDa plasma glycoprotein comprising 20 short consensus repeat (SCR) domains that serves as the primary soluble regulator of the alternative complement pathway. Factor H acts as a cofactor for complement factor I-mediated cleavage of C3b to iC3b, accelerates the decay of the C3 convertase (C3bBb), and competes with factor B for C3b binding — all mechanisms that prevent runaway complement activation on host cell surfaces.

The landmark variant rs1061170 (Y402H, a tyrosine-to-histidine substitution in SCR domain 7) disrupts factor H's ability to bind glycosaminoglycans (heparan sulfate, dermatan sulfate) on the surface of the retinal pigment epithelium (RPE) and Bruch's membrane. SCR7 is the critical domain for surface recognition — the H402 variant reduces heparin-binding affinity by 3-fold and C-reactive protein binding by 2.5-fold. This means complement activation proceeds relatively unchecked on RPE surfaces, generating membrane attack complexes (C5b-9) that damage RPE cells and trigger chronic subretinal inflammation.

Homozygous 402H carriers face 5-7 times greater AMD risk; heterozygotes face 2-4 times increased risk. The variant's population frequency is approximately 34% in Europeans, making it one of the most impactful common disease-associated variants known.

**ARMS2 (Age-Related Maculopathy Susceptibility 2):** Located on chromosome 10q26.13, ARMS2 encodes a 12-kDa protein of 107 amino acids whose precise function remains debated but is localized to mitochondria in photoreceptor inner segments and RPE cells. The risk variant rs10490924 (A69S, alanine-to-serine at position 69) appears to destabilize the ARMS2 protein and is in strong linkage disequilibrium with a deletion/insertion polymorphism (del443ins54) in the ARMS2 3'-UTR that introduces an mRNA instability motif, reducing ARMS2 expression by approximately 60-80%.

The leading hypothesis positions ARMS2 as a complement regulator on mitochondrial surfaces — its loss may leave mitochondrial membranes exposed to complement-mediated damage, particularly in the extraordinarily metabolically active photoreceptor-RPE complex, which processes more membrane material daily (through photoreceptor outer segment phagocytosis) than any other cell system in the body.

### Drusen Formation and Disease Progression

The hallmark pathological feature of early AMD is drusen — extracellular deposits accumulating between the RPE basal lamina and Bruch's membrane. Proteomic analysis reveals drusen contain complement components (C3 fragments, C5b-9, factor H, vitronectin), oxidized lipids, apolipoproteins (apoE, apoB), amyloid-beta, and crystallins. CFH variants accelerate drusen formation by permitting complement activation products to accumulate in the sub-RPE space.

As drusen coalesce, they physically separate RPE cells from their choroidal blood supply, creating zones of RPE hypoxia. RPE cells respond by upregulating vascular endothelial growth factor (VEGF-A), which in susceptible individuals triggers choroidal neovascularization — the growth of abnormal, leaky blood vessels from the choriocapillaris through Bruch's membrane into the sub-RPE or subretinal space. These fragile vessels hemorrhage and leak plasma, causing acute vision loss characteristic of wet AMD.

### Risk Level Implications

**Elevated risk** — carrying risk alleles at both CFH and ARMS2 — produces a multiplicative effect, with combined odds ratios reaching 50-fold for late AMD. These individuals may develop clinical AMD 10-15 years earlier than average and should begin comprehensive retinal monitoring by age 40.

**Moderate risk** typically reflects a single-locus risk genotype. AMD development follows a more typical timeline but with higher likelihood of progression from intermediate to late stages.

**Typical risk** indicates protective or neutral genotypes at both loci, with AMD risk driven primarily by age, smoking status, and dietary factors.

### Actionable Strategies

The AREDS2 formulation (vitamin C 500mg, vitamin E 400IU, lutein 10mg, zeaxanthin 2mg, zinc 80mg, copper 2mg) reduced progression to late AMD by 25% in the landmark trial. Lutein and zeaxanthin are macular pigment carotenoids that filter damaging blue light (400-500nm) and quench singlet oxygen — directly protecting against the photo-oxidative stress that CFH variants leave unopposed.

Smoking cessation is the single most impactful modifiable factor — smokers face 2-4× greater AMD risk through combined oxidative stress, reduced macular pigment density, and complement activation. A diet rich in dark leafy greens (kale, spinach — 20+ mg lutein per serving), omega-3 fatty acids (2 servings of fatty fish weekly), and low glycemic index foods supports retinal health at the molecular level.

Home monitoring with an Amsler grid (detecting metamorphopsia — straight lines appearing wavy) enables early detection of wet AMD conversion, when anti-VEGF injection therapy (ranibizumab, aflibercept, faricimab) is most effective.

For personalized retinal health strategies based on your CFH and ARMS2 genotypes, visit [healthpro.ai](https://healthpro.ai/conditions/age-related-macular-degeneration).`
  },

  "alcohol-flush-reaction": {
    name: "Alcohol flush reaction",
    genes: "ADH1B, ALDH2",
    summary: "Alcohol flush reaction results from rapid ethanol oxidation (ADH1B) combined with impaired acetaldehyde clearance (ALDH2), causing toxic acetaldehyde accumulation that triggers facial flushing, tachycardia, and nausea.",
    details: `## Understanding Alcohol Flush Reaction

Alcohol flush reaction — colloquially known as "Asian glow" due to its high prevalence in East Asian populations — is a physiological response to ethanol consumption characterized by facial erythema (reddening), tachycardia, headache, nausea, and general discomfort. Far from being merely cosmetic, this reaction signals dangerous accumulation of acetaldehyde, a Group 1 carcinogen classified by the International Agency for Research on Cancer (IARC), in the bloodstream at concentrations 6-20 times higher than those experienced by unaffected individuals after equivalent alcohol intake.

### The Two-Step Ethanol Metabolism Pathway

Ethanol metabolism proceeds through two sequential oxidative reactions, primarily in hepatocytes. In the first step, alcohol dehydrogenase (ADH) enzymes in the cytosol oxidize ethanol (CH₃CH₂OH) to acetaldehyde (CH₃CHO), reducing NAD⁺ to NADH. In the second step, aldehyde dehydrogenase 2 (ALDH2) in the mitochondrial matrix further oxidizes acetaldehyde to acetate (CH₃COO⁻), which enters the TCA cycle or is exported for peripheral tissue metabolism.

**ADH1B:** The ADH1B gene on chromosome 4q23 encodes the β subunit of alcohol dehydrogenase, which assembles into homodimeric (ββ) or heterodimeric (αβ, βγ) enzymes. The variant rs1229984 produces the ADH1B*2 allele (Arg48His substitution), which increases ethanol oxidation velocity approximately 40-fold compared to the ADH1B*1 reference enzyme (Vmax of ~340 min⁻¹ versus ~9 min⁻¹ at pH 7.5). This creates a metabolic bottleneck by generating acetaldehyde far faster than downstream ALDH2 can clear it.

The ADH1B*2 allele reaches frequencies of 70-90% in Japanese, Chinese, and Korean populations, 40-60% in Southeast Asian groups, and less than 10% in European and African populations. A rarer variant, ADH1B*3 (Arg370Cys, rs2066702), found predominantly in populations of African descent, also accelerates ethanol oxidation but through a different structural mechanism involving altered coenzyme binding.

**ALDH2:** The ALDH2 gene on chromosome 12q24.12 encodes the mitochondrial aldehyde dehydrogenase responsible for over 90% of acetaldehyde elimination. The variant rs671 (Glu504Lys, historically called Glu487Lys using mature protein numbering) produces the ALDH2*2 allele, which generates a catalytically crippled enzyme. Because ALDH2 functions as a homotetramer, even one defective subunit (in heterozygotes) disrupts the entire complex — a dominant-negative effect. ALDH2*1/*2 heterozygotes retain only 10-30% of normal enzymatic activity, while ALDH2*2/*2 homozygotes have essentially zero functional ALDH2.

The Lys504 substitution destabilizes the enzyme's structure by disrupting a critical hydrogen bond network in the dimer interface, reducing NAD⁺ cofactor binding affinity 200-fold and lowering the tetramer's thermostability from ~55°C to ~42°C. This variant affects approximately 540 million people worldwide — roughly 36% of East Asians, making it arguably the most common enzyme deficiency in humans.

### The Acetaldehyde Toxicity Cascade

When acetaldehyde accumulates beyond the body's clearance capacity, it triggers multiple pathological cascades. Acetaldehyde is a potent vasodilator — it stimulates mast cell degranulation and histamine release, directly relaxes vascular smooth muscle, and activates endothelial nitric oxide production. This produces the characteristic facial flushing, warmth, and tachycardia within minutes of alcohol consumption.

At the molecular level, acetaldehyde forms covalent adducts with proteins (particularly hemoglobin, albumin, and collagen), DNA (generating N²-ethylidene-deoxyguanosine, which can rearrange to the mutagenic N²-ethyl-deoxyguanosine), and lipids. These adducts trigger immune responses, impair protein function, and introduce DNA mutations. The esophageal squamous epithelium is particularly vulnerable because it expresses high levels of ADH but minimal ALDH2, creating a local acetaldehyde "hot zone."

### Cancer Risk: A Critical Consideration

ALDH2-deficient individuals who drink regularly face dramatically elevated cancer risks. Esophageal squamous cell carcinoma risk increases 6-10 fold in ALDH2*1/*2 heterozygotes who consume moderate alcohol (>14 drinks/week), and the combination of ALDH2*2 with ADH1B*1 (slower ethanol oxidation, prolonging overall exposure) further amplifies risk. Head and neck cancers, gastric cancer, and colorectal cancer risks are also significantly elevated.

### What Risk Levels Mean

**Elevated risk** — carrying ALDH2*2 (especially homozygous) with or without ADH1B*2 — represents the highest-risk genotype for acetaldehyde-mediated organ damage. Even moderate alcohol consumption produces sustained toxic acetaldehyde levels. Complete alcohol avoidance is the strongest recommendation.

**Moderate risk** — ALDH2*1/*2 heterozygosity or ADH1B*2 without ALDH2 deficiency — produces noticeable flush reactions serving as a warning signal. Limiting consumption to one drink or fewer per occasion with food substantially reduces acetaldehyde exposure.

**Typical risk** — wild-type ALDH2 and ADH1B — supports efficient ethanol metabolism, though alcohol still carries dose-dependent health risks through other mechanisms.

### Actionable Insights

There is no safe level of alcohol consumption for ALDH2*2 homozygotes — the cancer risk is unacceptable at any regular intake. For heterozygotes, if alcohol is consumed, strategies include: eating before drinking (slowing gastric absorption), strict quantity limits (one standard drink maximum), avoiding spirits in favor of lower-concentration beverages, and supplementing with N-acetylcysteine (NAC) which supports glutathione-mediated acetaldehyde detoxification as a secondary pathway.

Importantly, over-the-counter antihistamines (famotidine, ranitidine) can mask flushing symptoms without reducing acetaldehyde levels — this is dangerous because it removes the body's warning signal while carcinogenic exposure continues unabated.

For personalized alcohol metabolism guidance based on your ADH1B and ALDH2 genotypes, visit [healthpro.ai](https://healthpro.ai/conditions/alcohol-flush-reaction).`
  },

  "allergic-diseases": {
    name: "Allergic diseases",
    genes: "IL4R, IL13",
    summary: "Allergic diseases arise from dysregulated Th2 immune responses driven by IL-4 receptor and IL-13 signaling variants that amplify IgE production, eosinophil recruitment, and mucosal inflammation.",
    details: `## Understanding Allergic Diseases

Allergic diseases — encompassing allergic asthma, allergic rhinitis, atopic dermatitis (eczema), food allergies, and anaphylaxis — represent a spectrum of immune hypersensitivity conditions affecting over 300 million people worldwide. These conditions share a common immunological foundation: aberrant activation of type 2 helper T cell (Th2) pathways that drive excessive immunoglobulin E (IgE) production, eosinophilic tissue infiltration, mast cell degranulation, and epithelial barrier disruption. The genetic architecture of atopy (the predisposition to allergic sensitization) is highly polygenic, but variants in IL4R and IL13 occupy central positions in the molecular cascade.

### IL4R: The Master Switch of Allergic Immunity

The IL4R gene on chromosome 16p12.1 encodes the interleukin-4 receptor alpha chain (IL-4Rα), a 140-kDa type I transmembrane protein that serves as the shared signaling subunit for both the type I IL-4 receptor (IL-4Rα/γc, expressed on hematopoietic cells) and the type II IL-4 receptor (IL-4Rα/IL-13Rα1, expressed on non-hematopoietic cells including airway epithelium, smooth muscle, and fibroblasts). This dual receptor system makes IL-4Rα the convergence point for both IL-4 and IL-13 signaling — arguably the two most important cytokines in allergic inflammation.

Upon IL-4 binding, IL-4Rα undergoes conformational changes that activate the associated Janus kinases JAK1 (bound to IL-4Rα) and JAK3 (bound to γc chain), which phosphorylate tyrosine residues on the receptor's intracellular domain. These phosphotyrosines serve as docking sites for STAT6, which upon phosphorylation dimerizes, translocates to the nucleus, and activates transcription of genes essential for allergic responses: germline Cε transcription (enabling IgE class switching in B cells), GATA3 (the master Th2 transcription factor), eotaxins (CCL11, CCL24, CCL26 for eosinophil recruitment), and mucin genes (MUC5AC, MUC5B).

The variant rs1805010 (Ile50Val in the extracellular domain) enhances IL-4 binding affinity and amplifies STAT6 phosphorylation by approximately 30-50%, lowering the threshold for Th2 pathway activation. The variant rs1801275 (Gln576Arg in the intracellular signaling domain) increases IL-4Rα signaling by reducing the receptor's association with inhibitory phosphatases, prolonging STAT6 activation. Individuals carrying both gain-of-function variants exhibit significantly elevated total serum IgE (often >200 IU/mL) and heightened allergic sensitization to environmental allergens.

### IL13: Amplifying Tissue Remodeling

IL13 on chromosome 5q31.1 encodes interleukin-13, a 12-kDa cytokine produced primarily by Th2 cells, type 2 innate lymphoid cells (ILC2s), mast cells, and basophils. IL-13 signals through the type II IL-4 receptor (IL-4Rα/IL-13Rα1), activating the same JAK1/TYK2/STAT6 cascade. However, IL-13's primary biological role is distinct from IL-4's: while IL-4 drives initial Th2 differentiation and IgE class switching, IL-13 orchestrates the tissue-level manifestations of allergy — goblet cell metaplasia, mucus hypersecretion, subepithelial fibrosis, airway hyperresponsiveness, and smooth muscle hypertrophy.

The critical variant rs20541 (Arg130Gln, historically called Arg110Gln) in the IL13 coding region alters the protein's interaction with its decoy receptor IL-13Rα2. Normal IL-13 is scavenged by IL-13Rα2, which binds IL-13 with 50-fold higher affinity than the signaling receptor but lacks an intracellular signaling domain — functioning as a molecular sink. The Gln130 variant reduces IL-13Rα2 binding by 40%, effectively increasing the pool of "free" IL-13 available to activate signaling receptors on target tissues.

### The Allergic Cascade in Action

Allergic sensitization begins when dendritic cells in mucosal epithelia sample environmental proteins (pollen, dust mite feces, animal dander, food proteins). In genetically predisposed individuals with amplified IL-4R signaling, dendritic cells preferentially activate Th2 differentiation over tolerogenic pathways. The resulting Th2 cells produce IL-4, driving B cell IgE class switching. Allergen-specific IgE molecules bind to high-affinity FcεRI receptors on mast cell and basophil surfaces, "arming" these cells.

Upon re-exposure, multivalent allergen crosslinks surface-bound IgE, triggering FcεRI aggregation and explosive degranulation — releasing preformed mediators (histamine, tryptase, TNF-α) within seconds and synthesizing lipid mediators (PGD2, LTC4, LTD4) and cytokines (IL-4, IL-5, IL-13) over minutes to hours. This early-phase and late-phase response produces the clinical symptoms: sneezing, itching, bronchoconstriction, edema, and mucus secretion.

### Risk Level Interpretation

**Elevated risk** indicates gain-of-function variants at both IL4R and IL13, creating a potent allergic predisposition. Total IgE levels are typically above the 75th percentile, and polysensitization (positive skin-prick tests to multiple allergen classes) is common. Atopic march — progression from eczema in infancy to allergic rhinitis and asthma in childhood — is more likely.

**Moderate risk** suggests variants at one locus. Allergic sensitization occurs but may be limited in scope, often affecting one target organ (e.g., rhinitis without asthma).

**Typical risk** means IL4R and IL13 signaling operates within normal parameters, though environmental factors (early allergen exposure, microbiome composition, pollution) still influence allergy development.

### Practical Recommendations

Allergen avoidance remains foundational — HEPA filtration (removing particles >0.3μm with 99.97% efficiency), encasing mattresses and pillows, maintaining indoor humidity below 50% (inhibiting dust mite reproduction), and NASAL saline irrigation reduce allergen exposure at mucosal surfaces. For individuals with elevated genetic risk, early introduction of allergenic foods (peanut, egg) between 4-6 months — as demonstrated in the LEAP trial — reduces food allergy development by 70-86%.

Targeted immunotherapy (subcutaneous or sublingual) addresses the immunological root by inducing regulatory T cells that produce IL-10 and TGF-β, counteracting the Th2 skew. Biologic therapies targeting the IL-4Rα subunit (dupilumab) are now available for moderate-to-severe atopic dermatitis and asthma, directly blocking the signaling amplified by genetic variants.

Learn more about managing genetic allergic predisposition at [healthpro.ai](https://healthpro.ai/conditions/allergic-diseases).`
  },

  "allergic-rhinitis": {
    name: "Allergic rhinitis",
    genes: "IL4R, IL4",
    summary: "Allergic rhinitis involves chronic nasal mucosal inflammation driven by IL-4 and IL-4 receptor signaling that amplifies local IgE production and eosinophilic infiltration in nasal turbinate tissue.",
    details: `## Understanding Allergic Rhinitis

Allergic rhinitis affects approximately 400 million people globally and represents far more than a nuisance condition — it significantly impairs quality of life, sleep quality, cognitive performance, and workplace productivity, costing an estimated $11.2 billion annually in the United States alone in direct and indirect costs. The condition involves chronic IgE-mediated inflammation of the nasal mucosa triggered by aeroallergens including pollen (seasonal rhinitis), house dust mite proteins (Der p 1, Der p 2), animal dander (Fel d 1 from cats, Can f 1 from dogs), and mold spores (Alternaria alternata, Aspergillus fumigatus).

### IL4 and IL4R: The Nasal Inflammatory Axis

**IL4:** The IL4 gene on chromosome 5q31.1 encodes interleukin-4, a 15-kDa glycoprotein produced primarily by Th2 cells, basophils, mast cells, and eosinophils. IL-4 is the canonical Th2-polarizing cytokine and the most potent inducer of IgE class switch recombination in B lymphocytes. The variant rs2243250 (-590C>T) in the IL4 promoter region increases transcriptional activity by 2-3 fold by creating a stronger binding site for the transcription factor NFAT (nuclear factor of activated T cells), which synergizes with AP-1 to drive IL4 gene expression following T cell receptor activation.

The functional consequence is elevated IL-4 production by T cells activated in nasal-associated lymphoid tissue (NALT), the organized immune structures in the nasal mucosa where allergen-specific immune responses are initiated. Increased local IL-4 drives three key processes: (1) enhanced IgE class switching in germinal center B cells, producing more allergen-specific IgE; (2) upregulation of VCAM-1 on nasal mucosal endothelium, facilitating eosinophil and basophil recruitment via VLA-4 integrin; and (3) increased expression of IL-4Rα on epithelial cells, creating a positive feedback loop that amplifies tissue responsiveness to both IL-4 and IL-13.

**IL4R:** As described for allergic diseases broadly, IL-4Rα gain-of-function variants (rs1805010, rs1801275) lower the signaling threshold, meaning even normal IL-4 concentrations produce enhanced downstream effects. When combined with IL4 promoter variants that increase cytokine production, the result is a dramatically amplified allergic response in the nasal mucosa — more IgE, more eosinophils, more mast cell activation, and more tissue edema.

### Nasal Mucosa-Specific Pathophysiology

The nasal mucosa presents unique features that make it particularly susceptible to allergic inflammation. The subepithelial tissue of the inferior and middle turbinates contains one of the body's densest populations of mast cells — approximately 7,000-12,000 per mm³, many already armed with allergen-specific IgE on their FcεRI receptors. Upon allergen contact, mast cell degranulation releases histamine (which acts on H1 receptors to cause itching, sneezing via trigeminal nerve stimulation, and vasodilation), leukotrienes (LTC4, LTD4 causing sustained vascular permeability and edema), and prostaglandin D2 (activating the CRTH2 receptor on Th2 cells and eosinophils for further recruitment).

The nasal turbinate vasculature includes large venous sinusoids (capacitance vessels) under autonomic control. Histamine and other inflammatory mediators cause engorgement of these sinusoids, producing rapid nasal obstruction that can reduce airflow by 50-80% within minutes. Unlike bronchial smooth muscle constriction, nasal obstruction is primarily vascular — a critical distinction for treatment approaches.

The late-phase response (4-8 hours post-exposure) involves eosinophil infiltration driven by IL-5, eotaxins (CCL11/CCL24/CCL26), and RANTES (CCL5). Eosinophils release major basic protein (MBP), eosinophil cationic protein (ECP), and eosinophil peroxidase, damaging the nasal epithelium and perpetuating inflammation. This tissue damage disrupts the epithelial barrier, allowing easier allergen penetration and creating a self-sustaining inflammatory cycle.

### Genetic Risk Interpretation

**Elevated risk** with combined IL4 and IL4R gain-of-function variants indicates a nasal mucosa primed for intense allergic responses. Polysensitization is common, symptoms are often perennial rather than purely seasonal, and the condition frequently coexists with other atopic manifestations. Total nasal symptom scores are typically in the moderate-to-severe range.

**Moderate risk** suggests one gene contributing to heightened response. Symptoms may be predominantly seasonal and responsive to first-line pharmacotherapy.

**Typical risk** means standard IL-4/IL-4R signaling; allergic rhinitis may still develop from environmental factors but tends to be milder and more amenable to avoidance measures alone.

### Evidence-Based Management Strategies

Intranasal corticosteroids (fluticasone, mometasone, budesonide) remain the most effective monotherapy because they suppress multiple inflammatory pathways — reducing IL-4, IL-5, and IL-13 production; decreasing eosinophil survival; stabilizing mast cells; and restoring epithelial barrier integrity. For genetically predisposed individuals, consistent daily use during allergen seasons (rather than as-needed) provides superior symptom control.

Second-generation antihistamines (cetirizine, loratadine, fexofenadine) address histamine-mediated symptoms but do not significantly impact the eosinophilic late-phase response amplified by IL-4/IL4R variants. Adding a leukotriene receptor antagonist (montelukast) provides complementary coverage by blocking LTD4-mediated vascular permeability.

For individuals with severe, refractory symptoms and confirmed IgE-mediated sensitization, allergen immunotherapy (AIT) represents the only treatment that modifies the underlying immunological disease process. Subcutaneous immunotherapy (SCIT) or sublingual immunotherapy (SLIT) over 3-5 years induces allergen-specific regulatory T cells, shifts antibody profiles from IgE to IgG4 (blocking antibodies), and produces sustained tolerance that persists years after discontinuation. The genetic basis of your allergic predisposition — rather than contradicting immunotherapy — actually identifies you as a strong candidate for this approach, since AIT directly counteracts the Th2 skew that your variants amplify.

Nasal saline irrigation with isotonic or hypertonic solutions (using a neti pot or squeeze bottle) mechanically removes allergens and inflammatory mediators from the mucosal surface, reduces mediator concentrations, and improves mucociliary clearance. When performed twice daily, saline irrigation can reduce medication requirements by 30-50%.

For a comprehensive, genotype-informed approach to allergic rhinitis management, visit [healthpro.ai](https://healthpro.ai/conditions/allergic-rhinitis).`
  },

  "altered-gut-microbiome": {
    name: "Altered gut microbiome",
    genes: "FUT2",
    summary: "FUT2 non-secretor status eliminates fucosylated glycan expression on intestinal epithelial surfaces, fundamentally reshaping microbial community composition and host-microbe metabolic interactions.",
    details: `## Understanding Altered Gut Microbiome Through FUT2 Genetics

The human gut microbiome comprises approximately 38 trillion microorganisms — bacteria, archaea, fungi, and viruses — collectively encoding over 3 million genes (compared to ~20,000 human genes). This microbial ecosystem profoundly influences immune development, nutrient metabolism, neurotransmitter production, and barrier function. While diet, antibiotics, and geography shape the microbiome, your FUT2 genotype exerts one of the strongest known genetic influences on gut microbial community structure, affecting which species can colonize your intestinal epithelium.

### FUT2: The Secretor Gene

The FUT2 gene on chromosome 19q13.33 encodes galactoside 2-alpha-L-fucosyltransferase 2, an enzyme that catalyzes the transfer of fucose from GDP-fucose to terminal galactose residues on glycan chains expressed by epithelial cells throughout the gastrointestinal tract, respiratory tract, and other mucosal surfaces. The resulting α(1,2)-fucosylated structures include the H antigen, Lewis b (Leb), and Lewis y (Ley) — the same carbohydrate determinants that define ABO blood group expression on mucosal surfaces (as opposed to red blood cells, which use FUT1).

The critical variant rs601338 (G428A, Trp143Stop) introduces a premature stop codon that completely abolishes FUT2 enzymatic activity. Homozygotes for this nonsense mutation (A/A genotype, approximately 20% of Europeans, 0-5% of East Asians) are termed "non-secretors" — they lack fucosylated glycans on all mucosal surfaces. This is not merely a subtle biochemical difference; it eliminates an entire category of carbohydrate structures that have co-evolved with the gut microbiome over millions of years.

### How Fucosylation Shapes the Microbiome

Fucosylated glycans on the intestinal epithelial surface and in mucus (where secreted mucins like MUC2 are heavily glycosylated) serve as both attachment sites and carbon sources for specific bacterial species. Bifidobacterium bifidum, Bifidobacterium longum, and certain Lactobacillus strains express dedicated fucosidase enzymes (GH29 and GH95 family) that cleave α(1,2)-fucose from host glycans, using it as a preferred carbon source through the L-fucose utilization pathway (fucose → fucose-1-phosphate → fuculose-1-phosphate → lactaldehyde + DHAP).

In non-secretors lacking these fucosylated structures, Bifidobacterium abundance is reduced by 50-80% in multiple cohort studies. This is significant because Bifidobacteria are keystone species that produce short-chain fatty acids (particularly acetate and lactate), lower luminal pH (inhibiting pathobiont growth), strengthen tight junctions via direct signaling to epithelial cells, and train the developing immune system toward balanced Th1/Th2/Treg responses.

Non-secretors show compensatory increases in Bacteroides, Prevotella, and Ruminococcus species that utilize alternative glycan structures (sialylated and sulfated mucins). However, this shift reduces butyrate production — butyrate being the primary energy source for colonocytes, the principal inducer of regulatory T cell differentiation in the gut, and a critical epigenetic regulator through histone deacetylase (HDAC) inhibition.

### Health Implications of Microbiome Alteration

The downstream effects of FUT2-mediated microbiome alteration are surprisingly broad:

**Vitamin B12 metabolism:** Non-secretors consistently show lower serum vitamin B12 levels (by 20-30 pg/mL on average), likely because Bifidobacteria — depleted in non-secretors — produce B12 analogs that facilitate B12 absorption in the terminal ileum.

**Inflammatory bowel disease:** Non-secretor status is a confirmed risk factor for Crohn's disease (OR ~1.5), likely through reduced butyrate availability, impaired epithelial barrier function, and altered immune education. The reduced fucosylated mucus layer in non-secretors may also compromise the "mucus barrier" that physically separates microbes from the epithelial surface.

**Metabolic health:** Microbiome composition influences bile acid metabolism, SCFA production, and the gut-liver axis. Non-secretor microbiome profiles are associated with altered bile acid profiles (reduced secondary bile acids like deoxycholic acid and lithocholic acid that activate the FXR and TGR5 receptors regulating glucose homeostasis).

**Immune development:** Early-life microbiome composition — strongly influenced by FUT2 status through breast milk oligosaccharide fucosylation and infant gut colonization patterns — shapes the trajectory of immune maturation. Non-secretor mothers produce breast milk with reduced 2'-fucosyllactose (2'FL), the most abundant human milk oligosaccharide, which serves as the primary prebiotic for infant Bifidobacterium colonization.

### Risk Level Interpretation

**Elevated risk** (homozygous non-secretor, A/A) indicates complete absence of mucosal fucosylation. Expect significantly altered microbiome composition with reduced Bifidobacteria and increased susceptibility to specific infections and inflammatory conditions.

**Moderate risk** (heterozygous secretor, G/A) retains partial FUT2 activity — typically sufficient for normal fucosylated glycan expression, though at somewhat reduced levels. Microbiome composition is generally similar to full secretors.

**Typical risk** (homozygous secretor, G/G) ensures full fucosylation capacity and optimal glycan availability for beneficial microbial colonization.

### Targeted Microbiome Optimization

Non-secretors benefit from targeted prebiotic strategies to compensate for absent fucosylated glycan substrates. Specific Bifidobacterium strains that can utilize non-fucosylated glycans (B. longum subsp. longum, B. adolescentis) may colonize more successfully than fucose-dependent strains. Supplementation with galacto-oligosaccharides (GOS) at 5-10g daily provides alternative substrates for Bifidobacteria.

Dietary fermentable fibers — inulin (chicory root, jerusalem artichoke), resistant starch (cooled potatoes, green bananas), and beta-glucans (oats, mushrooms) — support butyrate-producing bacteria (Faecalibacterium prausnitzii, Roseburia intestinalis) through cross-feeding networks, partially compensating for reduced Bifidobacterium-derived acetate/lactate.

Regular consumption of naturally fermented foods (sauerkraut, kimchi, kefir, traditional yogurt) introduces diverse Lactobacillus species that can establish stable colonization patterns complementary to the non-secretor microbiome landscape.

For personalized microbiome optimization strategies based on your FUT2 secretor status, visit [healthpro.ai](https://healthpro.ai/conditions/altered-gut-microbiome).`
  },

  "altered-innate-immunity": {
    name: "Altered innate immunity",
    genes: "TLR4",
    summary: "TLR4 variants alter the innate immune system's primary sensor for bacterial lipopolysaccharide, modifying sepsis susceptibility, inflammatory responses, and gut-immune barrier function.",
    details: `## Understanding Altered Innate Immunity

The innate immune system is the body's first line of defense — an evolutionarily ancient surveillance network that detects and responds to microbial threats within minutes, long before the adaptive immune system can mount antigen-specific responses. Altered innate immunity due to TLR4 (Toll-like receptor 4) variants affects the sensitivity, magnitude, and quality of this critical defense system, with consequences spanning infectious disease susceptibility, chronic inflammatory conditions, and even metabolic health.

### TLR4: The Lipopolysaccharide Sentinel

The TLR4 gene on chromosome 9q33.1 encodes Toll-like receptor 4, a 95-kDa type I transmembrane protein expressed on the surface of monocytes, macrophages, dendritic cells, neutrophils, intestinal epithelial cells, and endothelial cells. TLR4 is the primary pattern recognition receptor for lipopolysaccharide (LPS, also called endotoxin) — the major glycolipid component of the outer membrane of all Gram-negative bacteria, including E. coli, Salmonella, Klebsiella, Pseudomonas, and Neisseria species.

LPS recognition by TLR4 involves an elegant multi-protein cascade. Circulating LPS-binding protein (LBP) first extracts LPS monomers from bacterial membranes or micelles, transferring them to membrane-bound or soluble CD14, which then loads the lipid A moiety of LPS into the hydrophobic pocket of MD-2 (also known as LY96), a small accessory protein permanently associated with TLR4's extracellular domain. The LPS-MD-2 complex induces TLR4 dimerization, bringing together two TLR4/MD-2 heterodimers into a symmetric "M-shaped" signaling platform.

TLR4 dimerization activates two distinct signaling arms. The MyD88-dependent pathway (via the adaptor proteins TIRAP and MyD88) rapidly activates NF-κB and MAPK cascades, driving production of pro-inflammatory cytokines (TNF-α, IL-1β, IL-6, IL-8) within 30-60 minutes. The TRIF-dependent pathway (via TRAM and TRIF adaptors), activated after TLR4 internalization into endosomes, induces type I interferons (IFN-α, IFN-β) and a secondary wave of NF-κB-dependent gene expression.

### Key TLR4 Variants and Their Effects

The two most studied functional polymorphisms are rs4986790 (Asp299Gly) and rs4986791 (Thr399Ile), which are in strong linkage disequilibrium and frequently co-inherited. The Asp299Gly substitution occurs in TLR4's extracellular leucine-rich repeat domain, altering the receptor's three-dimensional structure in a region that influences MD-2 interaction and LPS-induced conformational changes.

Functional studies using transfected cell lines and primary human monocytes demonstrate that the 299Gly variant reduces NF-κB activation by 40-60% following LPS stimulation at physiological concentrations (1-100 ng/mL). TNF-α and IL-6 secretion are proportionally reduced. However, the phenotype is dose-dependent — at very high LPS concentrations (mimicking severe bacteremia), signaling differences narrow.

The 299Gly/399Ile haplotype affects approximately 6-10% of European populations, with lower frequencies in Asian and African populations. The persistence of these "hypo-responsive" alleles suggests balancing selection — reduced TLR4 signaling may protect against excessive inflammation (septic shock, atherosclerosis) while moderately increasing susceptibility to certain infections.

### Clinical Implications of Altered TLR4 Signaling

**Infectious susceptibility:** Carriers of Asp299Gly show a 2-fold increased risk of Gram-negative bacteremia and possibly increased susceptibility to severe malaria, respiratory syncytial virus (RSV) infection in infants, and urinary tract infections. The compromised early cytokine response may delay neutrophil recruitment and macrophage activation during critical initial hours of infection.

**Sepsis paradox:** While reduced TLR4 signaling impairs initial pathogen detection, it may paradoxically protect against the extreme inflammatory cascade of septic shock — a condition where the immune response itself causes more damage than the infection. Some studies show improved sepsis survival in 299Gly carriers, suggesting their moderated cytokine response avoids the catastrophic "cytokine storm."

**Atherosclerosis:** TLR4 on endothelial cells and macrophages responds to oxidized LDL and endogenous damage-associated molecular patterns (DAMPs) as well as bacterial LPS. The 299Gly variant is associated with reduced carotid intima-media thickness and lower atherosclerotic burden, likely through attenuated macrophage inflammatory activation in arterial plaques.

**Gut immunity:** Intestinal epithelial TLR4 maintains the delicate balance between microbial tolerance and pathogen defense. Altered TLR4 signaling affects epithelial tight junction regulation, antimicrobial peptide (defensin) production, and the crosstalk between epithelial cells and lamina propria immune cells.

### What Risk Levels Mean

**Elevated risk** for altered innate immunity indicates TLR4 hypo-responsiveness (carrying Asp299Gly and/or Thr399Ile variants). Your initial inflammatory response to Gram-negative bacteria is blunted, potentially delaying effective immune clearance. However, this same alteration may confer relative protection against chronic inflammatory conditions driven by TLR4 overactivation.

**Moderate risk** reflects heterozygous status with partial reduction in TLR4 signaling capacity.

**Typical risk** means standard TLR4 responsiveness — robust early pathogen detection but potentially greater susceptibility to inflammation-driven conditions if exposed to chronic TLR4 stimulation.

### Actionable Recommendations

Prioritize infection prevention through standard hygiene practices, prompt medical attention for urinary or respiratory infections, and awareness that your first-response inflammatory signaling may be less aggressive than average. Vaccinations are particularly important — by stimulating adaptive immunity, vaccines provide an alternative defense pathway that does not depend on optimal innate sensing.

Gut barrier support through dietary fiber (30+ g/day), fermented foods, and adequate zinc (15mg daily, essential for intestinal epithelial tight junction integrity and TLR4-independent antimicrobial peptide production) helps maintain mucosal defense. Avoiding unnecessary antibiotic courses preserves commensal bacteria that contribute to colonization resistance.

Regular exercise at moderate intensity (avoiding extreme exertion, which can transiently impair mucosal immunity) supports overall immune surveillance through enhanced natural killer cell activity, improved neutrophil function, and reduced systemic inflammation.

Explore personalized immune health strategies at [healthpro.ai](https://healthpro.ai/conditions/altered-innate-immunity).`
  },

  "alzheimer-disease": {
    name: "Alzheimer disease",
    genes: "BIN1, ABCA7, PICALM, CLU, MS4A6A, SLC24A4, CR1",
    summary: "Alzheimer disease susceptibility involves multiple genetic loci affecting amyloid processing, tau phosphorylation, neuroinflammation, and synaptic vesicle recycling across distinct but converging neurodegeneration pathways.",
    details: `## Understanding Alzheimer Disease: A Multi-Gene Perspective

Alzheimer disease (AD) is the most common neurodegenerative disorder, affecting approximately 55 million people worldwide and projected to triple by 2050. Beyond the well-known APOE ε4 association, genome-wide association studies (GWAS) involving over 400,000 participants have identified dozens of additional risk loci. The seven genes analyzed here — BIN1, ABCA7, PICALM, CLU, MS4A6A, SLC24A4, and CR1 — represent some of the strongest GWAS signals and collectively illuminate the biological pathways that drive Alzheimer neurodegeneration.

### Gene-by-Gene Molecular Mechanisms

**BIN1 (Bridging Integrator 1):** Located on chromosome 2q14.3, BIN1 is the second-strongest genetic risk factor for late-onset AD after APOE. BIN1 encodes an amphiphysin family protein with BAR (Bin-Amphiphysin-Rvs) domain-mediated membrane curvature sensing abilities. In neurons, BIN1 is critical for clathrin-mediated endocytosis at synaptic terminals, facilitating synaptic vesicle recycling after neurotransmitter release. The AD-associated variant rs6733839 increases BIN1 expression in microglia by 1.5-2 fold, shifting the balance toward excessive tau propagation — BIN1 physically interacts with tau protein via its SH3 domain, and overexpression accelerates tau spreading between neurons through endocytic pathways. BIN1 also regulates BACE1 (β-secretase) trafficking, influencing amyloid precursor protein (APP) processing.

**ABCA7 (ATP-Binding Cassette Transporter A7):** On chromosome 19p13.3, ABCA7 encodes a phospholipid translocase that mediates the transport of phosphatidylserine and phosphatidylcholine across cell membranes. In microglia, ABCA7 is essential for phagocytic clearance of apoptotic cells and, critically, amyloid-beta (Aβ) deposits. The loss-of-function variant rs3764650 reduces ABCA7 expression, impairing microglial Aβ phagocytosis by 30-40%. ABCA7 knockout mice develop 3-fold greater amyloid plaque burden. ABCA7 also regulates APP processing — reduced ABCA7 shifts APP cleavage toward the amyloidogenic pathway by increasing BACE1-mediated β-secretase cleavage.

**PICALM (Phosphatidylinositol-Binding Clathrin Assembly Protein):** Chromosome 11q14.2. PICALM is a clathrin adaptor protein essential for clathrin-mediated endocytosis in endothelial cells of the blood-brain barrier (BBB). It mediates transcytosis of Aβ bound to LRP1 from brain interstitium across the BBB into blood — a major Aβ clearance route. The AD-risk variant rs3851179 reduces PICALM expression in cerebral endothelial cells, diminishing this "clearance highway." Additionally, PICALM modulates autophagosome formation, and reduced PICALM impairs autophagic clearance of tau aggregates.

**CLU (Clusterin/Apolipoprotein J):** Chromosome 8p21.1. CLU encodes clusterin, a 75-80 kDa secreted glycoprotein that acts as an extracellular chaperone — binding misfolded proteins (including Aβ) to prevent their aggregation and facilitate receptor-mediated endocytosis for lysosomal degradation. Clusterin-Aβ complexes are cleared via megalin (LRP2) on brain endothelial cells. The variant rs11136000 reduces CLU expression, diminishing this chaperone-mediated clearance. Clusterin also modulates complement activation — reduced clusterin removes a brake on the terminal complement cascade, increasing membrane attack complex formation on neurons.

**MS4A6A (Membrane-Spanning 4-Domain A6A):** Chromosome 11q12.2. MS4A6A belongs to a family of tetraspanin-like proteins expressed primarily in myeloid cells. While its precise function remains under investigation, MS4A6A is enriched in microglia and appears to modulate their activation state. The variant rs983392 alters MS4A6A expression and is associated with differences in soluble TREM2 levels in cerebrospinal fluid — TREM2 being the key receptor governing microglial transition from homeostatic to disease-associated phenotypes. Altered MS4A6A expression may shift microglial polarization toward chronically activated, neurotoxic states.

**SLC24A4 (Solute Carrier Family 24 Member 4):** Chromosome 14q32.12. SLC24A4 encodes a potassium-dependent sodium-calcium exchanger (NCKX4) that extrudes calcium from cells using the sodium gradient. In neurons, calcium homeostasis is fundamental to synaptic plasticity, and chronic calcium dysregulation is a hallmark of AD pathogenesis. The variant rs10498633 may alter calcium handling in neurons and dendritic cells, affecting both synaptic function and immune cell activation.

**CR1 (Complement Receptor 1):** Chromosome 1q32.2. CR1 encodes a 200-kDa transmembrane glycoprotein expressed on erythrocytes, monocytes, neutrophils, and glomerular podocytes. On red blood cells, CR1 captures C3b-opsonized immune complexes — including Aβ-complement complexes — and transports them to hepatic and splenic macrophages for destruction ("immune adherence clearance"). The AD-risk variant rs6656401 associates with lower erythrocyte CR1 density, reducing peripheral Aβ clearance capacity by an estimated 20-30%. Since 40-60% of brain-derived Aβ is cleared into the peripheral circulation, impaired erythrocyte-mediated clearance allows Aβ to accumulate.

### Converging Pathways

These seven genes illuminate four major pathogenic axes in AD: (1) **Amyloid clearance** (ABCA7, CLU, PICALM, CR1) — multiple redundant mechanisms for removing Aβ, each partially compromised by risk variants; (2) **Neuroinflammation** (CR1, MS4A6A, CLU) — dysregulated complement and microglial activation driving chronic neuronal damage; (3) **Endosomal/vesicular trafficking** (BIN1, PICALM) — disrupted intracellular sorting affecting both APP processing and tau propagation; (4) **Calcium/ion homeostasis** (SLC24A4) — fundamental cellular physiology underlying synaptic function.

### Risk Level Implications

**Elevated risk** with multiple unfavorable variants across these loci reflects compounded impairment across several clearance and inflammatory pathways simultaneously. This polygenic burden — quantifiable through a polygenic risk score — stratifies late-onset AD risk more precisely than any single locus except APOE ε4.

**Moderate risk** indicates some pathway impairment that may be partially compensated by intact mechanisms at other loci.

**Typical risk** means these major GWAS loci are not contributing substantial additional risk, though APOE status, rare variants, and environmental factors remain relevant.

### Neuroprotective Strategies

Cognitive reserve — built through education, intellectually stimulating activities, social engagement, and multilingualism — provides resilience against AD pathology. Individuals with high cognitive reserve can tolerate greater amyloid and tau burden before clinical symptoms emerge.

The FINGER trial demonstrated that multi-domain lifestyle intervention (aerobic exercise, cognitive training, nutritional guidance, vascular risk management) improved or maintained cognitive function over 2 years. For those with elevated polygenic risk, aggressive cardiovascular risk factor management (blood pressure <130/80, statin therapy for hyperlipidemia, tight glycemic control) is particularly important because vascular dysfunction impairs Aβ clearance through perivascular drainage pathways.

Mediterranean diet adherence, specifically high consumption of extra-virgin olive oil (rich in oleocanthal, which enhances Aβ clearance across the BBB), fatty fish (DHA supports neuronal membrane integrity), and berries (anthocyanins activate AMPK and autophagy pathways) provides synergistic neuroprotection.

For a comprehensive genetic risk assessment and personalized neuroprotection plan, visit [healthpro.ai](https://healthpro.ai/conditions/alzheimer-disease).`
  },

  "alzheimer-disease-risk": {
    name: "Alzheimer disease risk",
    genes: "TOMM40",
    summary: "TOMM40 poly-T repeat length variants affect mitochondrial protein import efficiency in neurons, independently modifying Alzheimer disease age of onset beyond the neighboring APOE locus.",
    details: `## Understanding TOMM40 and Alzheimer Disease Risk

The TOMM40 gene represents one of the most intriguing and debated loci in Alzheimer disease genetics — a gene whose risk contribution intertwines with, yet appears partly independent from, the adjacent APOE gene. Understanding TOMM40 requires appreciating both the molecular biology of mitochondrial protein import and the complex linkage disequilibrium architecture of the chromosome 19q13.32 region.

### TOMM40: The Mitochondrial Gateway

TOMM40 (Translocase of Outer Mitochondrial Membrane 40) on chromosome 19q13.32 encodes the central pore-forming subunit of the TOM (translocase of the outer membrane) complex — the primary entry portal for nuclear-encoded proteins destined for mitochondria. Since 99% of mitochondrial proteins are encoded by nuclear DNA, translated on cytoplasmic ribosomes, and must be imported through TOM complexes, TOMM40/Tom40 is essential for virtually every aspect of mitochondrial function.

Tom40 forms a β-barrel channel approximately 22 Å in diameter in the outer mitochondrial membrane. It associates with receptor subunits Tom20, Tom22, and Tom70, which recognize mitochondrial targeting sequences (presequences or internal signals) on incoming precursor proteins and thread them through the Tom40 pore in an unfolded conformation. The imported proteins are then sorted by downstream translocases (TIM22, TIM23, SAM complex) to their final mitochondrial destinations.

### The Poly-T Repeat Polymorphism

The critical TOMM40 variant is rs10524523, an intronic poly-thymine (poly-T) homopolymer repeat in intron 6. Alleles are classified by repeat length: Short (S, ≤19 T's), Long (L, 20-29 T's), and Very Long (VL, ≥30 T's). These repeat lengths are not merely neutral markers — they appear to influence TOMM40 transcription through effects on DNA secondary structure, transcription factor binding, and possibly intronic enhancer activity.

The VL allele is strongly associated with earlier age of Alzheimer onset, shifting disease presentation by approximately 7 years earlier compared to the S allele. Initial analyses suggested this was entirely driven by linkage disequilibrium with APOE (VL is predominantly linked to APOE ε3, while S is linked to APOE ε4), making it difficult to separate their effects. However, subsequent work by Roses and colleagues demonstrated that within APOE ε3/ε3 homozygotes — where APOE genotype is held constant — poly-T repeat length still independently predicted age of cognitive decline onset. APOE ε3/ε3 individuals with VL/VL repeats showed cognitive decline onset approximately 7 years earlier than those with S/S repeats.

### Mitochondrial Dysfunction in Alzheimer Neurodegeneration

The brain consumes 20% of total body oxygen despite comprising only 2% of body mass — making neurons exquisitely dependent on mitochondrial oxidative phosphorylation. A single cortical neuron may contain 1,000-2,000 mitochondria distributed throughout its soma, axon (which can extend over 1 meter), and dendritic arbor. Synaptic transmission is particularly energy-demanding, requiring ATP for vesicle recycling, ion gradient restoration, and calcium extrusion.

Reduced TOMM40 function impairs the import of critical mitochondrial proteins including: (1) Subunits of respiratory chain complexes I-V, reducing ATP production capacity; (2) Superoxide dismutase 2 (SOD2/MnSOD), the primary mitochondrial antioxidant enzyme that converts superoxide radical (O₂⁻) to hydrogen peroxide; (3) Mitochondrial DNA polymerase gamma (POLG), essential for mtDNA replication and repair; (4) PINK1, the kinase that initiates mitophagy (selective autophagy of damaged mitochondria) through Parkin recruitment.

When protein import slows, mitochondria accumulate damaged respiratory chain complexes that leak electrons, generating excessive reactive oxygen species (ROS). Simultaneously, impaired SOD2 import reduces antioxidant capacity, and impaired PINK1 import prevents removal of the most damaged mitochondria. This creates a vicious cycle of oxidative damage, mtDNA mutations, and progressive bioenergetic failure.

In AD specifically, mitochondrial dysfunction appears decades before clinical symptoms. PET imaging with ¹⁸F-FDG (fluorodeoxyglucose) reveals reduced cerebral glucose metabolism (reflecting mitochondrial dysfunction) in carriers of AD risk genotypes 20-30 years before expected symptom onset. TOMM40 variants may contribute to this early metabolic decline.

### Risk Stratification

**Elevated risk** — VL/VL poly-T repeats, especially combined with APOE ε3/ε4 or ε4/ε4 — indicates compromised mitochondrial protein import that, over decades, may accelerate the bioenergetic failure underlying neurodegeneration. Age of onset may be shifted earlier compared to population averages.

**Moderate risk** — heterozygous VL/S or VL/L repeats — suggests partially preserved import efficiency with intermediate effects on mitochondrial function.

**Typical risk** — S/S or S/L repeats — is associated with maintained mitochondrial protein import capacity and later age of onset within a given APOE genotype stratum.

### Mitochondria-Targeted Strategies

Mitochondrial health optimization is particularly relevant for TOMM40 risk carriers. Aerobic exercise is the most potent stimulus for mitochondrial biogenesis — through PGC-1α activation, exercise increases mitochondrial mass by 40-100% in skeletal muscle and stimulates similar adaptations in the brain. High-intensity interval training (HIIT) may be particularly effective, upregulating mitochondrial fusion (MFN1/2) and fission (DRP1) dynamics that maintain quality control.

Coenzyme Q10 (ubiquinol form, 200-400mg daily) directly supports electron transport chain function at complexes I-III. NAD+ precursors (nicotinamide riboside 300mg or NMN 500mg daily) support sirtuin-mediated mitochondrial quality control and may enhance protein import through SIRT3-dependent mechanisms. Alpha-lipoic acid (600mg daily) crosses the blood-brain barrier and regenerates both glutathione and coenzyme Q10 within mitochondria.

Time-restricted eating (fasting periods of 14-16 hours) activates AMPK, which stimulates autophagy and mitophagy — critical quality control mechanisms that remove dysfunctional mitochondria before they accumulate excessive damage.

For comprehensive mitochondrial health optimization guided by your TOMM40 genotype, visit [healthpro.ai](https://healthpro.ai/conditions/alzheimer-disease-risk).`
  },

  "alzheimer-risk": {
    name: "Alzheimer risk",
    genes: "APOE",
    summary: "APOE ε4 is the strongest common genetic risk factor for late-onset Alzheimer disease, impairing amyloid-beta clearance, promoting tau tangle formation, and disrupting brain lipid metabolism.",
    details: `## Understanding APOE-Mediated Alzheimer Risk

The APOE ε4 allele stands as the most significant common genetic determinant of late-onset Alzheimer disease (LOAD), a distinction that has remained unchallenged since its discovery in 1993 by Allen Roses and colleagues. While dozens of risk loci have been identified through GWAS, none approach the effect size of APOE ε4 — heterozygous carriers (ε3/ε4) face a 3-4 fold increase in AD risk, while homozygous carriers (ε4/ε4) face an 8-15 fold increase. More recently, APOE ε4 homozygosity has been proposed as a distinct genetic form of AD, with virtually 100% of ε4/ε4 carriers showing Alzheimer biomarker positivity by age 65.

### APOE Isoforms and Amyloid-Beta Dynamics

The three APOE isoforms — apoE2, apoE3, and apoE4 — differ by single amino acid substitutions at positions 112 and 158 (ε2: Cys112/Cys158; ε3: Cys112/Arg158; ε4: Arg112/Arg158). These seemingly minor changes profoundly alter protein folding through "domain interaction" — in apoE4, Arg112 forms a salt bridge with Glu255 in the lipid-binding domain, pulling the N-terminal receptor-binding domain and C-terminal lipid-binding domain into closer proximity. This compact conformation reduces lipid-binding capacity and alters receptor interaction properties.

In the brain, apoE is the primary vehicle for intercellular cholesterol and phospholipid transport, produced mainly by astrocytes and, under pathological conditions, by activated microglia. ApoE binds Aβ peptides (both Aβ40 and Aβ42) in the interstitial fluid, and the apoE-Aβ complex is cleared through several routes: receptor-mediated endocytosis via LRP1 on neurons and astrocytes, transcytosis across the blood-brain barrier via LRP1 on endothelial cells, perivascular drainage along basement membranes of cerebral arteries, and microglial phagocytosis.

ApoE4 clears Aβ dramatically less efficiently than apoE3 or apoE2. The isoform-specific hierarchy of Aβ clearance (ε2 > ε3 >> ε4) results from several mechanisms: (1) ApoE4 forms less stable complexes with Aβ, reducing receptor-mediated clearance efficiency; (2) ApoE4 preferentially directs clearance through the slower, less efficient VLDL receptor pathway rather than LRP1; (3) ApoE4 promotes Aβ oligomerization and fibrillization by serving as a "pathological chaperone" that nucleates aggregation; (4) ApoE4 impairs perivascular drainage by promoting cerebral amyloid angiopathy — Aβ deposition in blood vessel walls that blocks this drainage route.

### Beyond Amyloid: ApoE4 in Tau Pathology and Neuroinflammation

Recent research has revealed that apoE4's contribution to AD extends well beyond amyloid processing. ApoE4 directly accelerates tau pathology — in the absence of amyloid, apoE4 expression is sufficient to drive tau-mediated neurodegeneration in animal models. The mechanism involves apoE4 fragmentation (generating toxic N-terminal fragments in neurons) and impaired lipid delivery to neurons, which triggers compensatory cholesterol synthesis and ER stress that activates tau hyperphosphorylation via GSK-3β.

ApoE4 also fundamentally alters microglial function. Microglia expressing apoE4 show impaired transition from homeostatic to disease-associated states, reduced phagocytic capacity, increased pro-inflammatory cytokine secretion (TNF-α, IL-1β, IL-6), and defective myelin debris clearance. This creates a neuroinflammatory environment that compounds both amyloid toxicity and tau propagation.

The blood-brain barrier is also compromised — apoE4 carriers show accelerated pericyte degeneration (pericytes are contractile mural cells that maintain BBB integrity), resulting in increased BBB permeability and microbleed frequency detectable on MRI years before cognitive symptoms.

### Age of Onset Modification

APOE ε4 shifts AD onset earlier: mean age of onset is approximately 68 years for ε4/ε4 carriers, 76 years for ε3/ε4, and 84 years for ε3/ε3. However, substantial variation exists within each genotype, driven by other genetic factors (TOMM40, BIN1, etc.), cognitive reserve, cardiovascular health, and lifestyle factors.

### Risk Level Interpretation

**Elevated risk** (ε4/ε4 or ε3/ε4 with additional risk factors) warrants comprehensive neuroprotection strategies beginning in midlife or earlier. Amyloid PET or CSF biomarker testing can establish whether pathological changes have begun, informing the urgency of intervention.

**Moderate risk** (ε3/ε4 without compounding factors) indicates meaningful but manageable increased susceptibility. The penetrance of a single ε4 allele is approximately 30-50% — meaning half or more of heterozygotes never develop AD.

**Typical risk** (ε3/ε3 or carriers of ε2) reflects population-average or below-average risk. The ε2 allele is actively protective, reducing AD risk by approximately 40% compared to ε3.

### APOE-Specific Intervention Strategies

ApoE4 carriers show differential responses to several interventions. Exercise benefits are amplified — ε4 carriers who exercise regularly show significantly greater cognitive preservation than sedentary ε4 carriers, with one study demonstrating that exercise effectively "neutralized" the ε4 risk over a 20-year follow-up.

Dietary fat composition is particularly impactful. ApoE4's preferential VLDL binding means high saturated fat intake is especially harmful, elevating LDL cholesterol more dramatically than in non-carriers. The Mediterranean diet — rich in olive oil, fish, and plant-based foods — has shown the strongest cognitive protection in ε4 carriers specifically.

Sleep quality is critical: the glymphatic system clears Aβ primarily during deep sleep, and ε4 carriers with sleep-disordered breathing show accelerated amyloid accumulation. Sleep apnea screening and treatment (CPAP therapy) is particularly important.

Emerging therapeutic approaches targeting apoE include "structure correctors" that shift apoE4 toward apoE3-like conformation, apoE mimetic peptides, anti-apoE4 antibodies, and gene therapy to express apoE2 in the CNS. The anti-amyloid antibodies lecanemab and donanemab have shown modest but significant benefits in early AD, with some evidence of differential benefit by APOE genotype.

For a personalized Alzheimer risk reduction plan based on your APOE genotype, visit [healthpro.ai](https://healthpro.ai/conditions/alzheimer-risk).`
  },

  "alzheimer-s-disease": {
    name: "Alzheimer's disease",
    genes: "APOE/APOC1",
    summary: "The APOE/APOC1 gene cluster on chromosome 19q13 contains regulatory variants that jointly influence Alzheimer's disease risk through coordinated effects on brain lipid homeostasis and neuroinflammation.",
    details: `## Understanding the APOE/APOC1 Cluster in Alzheimer's Disease

The chromosome 19q13.32 region harboring APOE and APOC1 represents one of the most complex genetic landscapes in Alzheimer's disease — a cluster of apolipoprotein genes under shared regulatory control, where disentangling the contributions of individual variants has required decades of research and remains an active area of investigation.

### The APOC1 Connection

APOC1 lies just 5.5 kilobases downstream of APOE and encodes apolipoprotein C-I, a 6.6-kDa protein (57 amino acids in its mature form) that is the smallest of the exchangeable apolipoproteins. ApoC-I circulates primarily on VLDL and HDL particles and modulates lipoprotein metabolism by inhibiting cholesteryl ester transfer protein (CETP) activity, blocking the binding of VLDL to LDL receptor-related protein (LRP1), and activating lecithin-cholesterol acyltransferase (LCAT).

The variant rs4420638, located 14 kb downstream of APOC1, has shown genome-wide significant association with AD independent of APOE ε4 in several studies. The rs11568822 insertion/deletion polymorphism in the APOC1 promoter (known as HpaI) affects transcription factor binding and is associated with altered APOC1 expression in brain tissue.

In the central nervous system, apoC-I is expressed by astrocytes and microglia, and its levels are elevated in AD brain tissue. ApoC-I directly interferes with apoE-mediated Aβ clearance by competing for binding to LRP1 on endothelial cells and neurons. In vitro studies demonstrate that apoC-I inhibits apoE-stimulated Aβ uptake by microglia in a dose-dependent manner — at physiological concentrations, apoC-I reduces microglial Aβ phagocytosis by 40-60%. Elevated apoC-I expression thus compounds the clearance deficit already created by apoE4.

### Shared Regulatory Elements

APOE and APOC1 share a bidirectional regulatory element — multienhancer 1 (ME1) and multienhancer 2 (ME2) — located in the intergenic region. These enhancers drive tissue-specific expression of both genes in the liver and brain. Variants within these regulatory regions can simultaneously alter expression of APOE and APOC1, creating coordinated effects that are greater than the sum of individual gene contributions.

The ε4-associated haplotype at this locus typically carries APOC1 promoter variants that increase APOC1 expression, creating a "double hit" — reduced apoE-mediated Aβ clearance (from apoE4 isoform effects) combined with active inhibition of remaining clearance capacity (from elevated apoC-I). This synergy helps explain why the APOE ε4 effect size is larger than would be predicted from apoE4 functional studies alone.

### Brain Lipid Metabolism Disruption

The APOE/APOC1 cluster effects converge on brain lipid homeostasis. In healthy brains, astrocyte-derived apoE-containing HDL-like particles deliver cholesterol and phospholipids to neurons via LRP1 and LDLR, supporting synaptic membrane remodeling (which consumes enormous quantities of cholesterol — approximately 25% of the body's total cholesterol resides in the brain despite its 2% mass contribution), myelin maintenance, and axonal growth.

When both apoE function is impaired (ε4 isoform) and apoC-I levels are elevated (APOC1 promoter variants), this lipid transport system breaks down on multiple levels. Cholesterol accumulates in astrocytes (forming lipid droplets detectable on electron microscopy), while neurons become cholesterol-depleted. Cholesterol-deprived neurons show reduced synaptogenesis, impaired synaptic vesicle recycling, decreased NMDA receptor surface expression, and ultimately synaptic loss — the neuropathological correlate most strongly associated with cognitive decline.

Furthermore, apoC-I is a potent activator of the innate immune response. It directly stimulates microglia through TLR2 and TLR4 signaling, promoting the release of TNF-α, IL-1β, and reactive nitrogen species. Chronically activated microglia adopt a neurotoxic phenotype that engulfs neuronal synapses ("synapse stripping"), further accelerating cognitive decline. This apoC-I-driven neuroinflammation compounds the inflammatory effects already present due to unchecked complement activation (impaired clusterin function), TREM2 dysregulation, and amyloid-triggered inflammasome activation.

### Risk Assessment

**Elevated risk** — carrying APOE ε4 haplotype with APOC1 risk variants — represents the most unfavorable combination at this locus. The coordinated increase in apoC-I and decrease in apoE function creates a severe lipid transport and Aβ clearance deficit in the brain.

**Moderate risk** — APOE ε3 with unfavorable APOC1 regulatory variants — suggests that even without the ε4 isoform, elevated apoC-I may partially impair clearance mechanisms.

**Typical risk** — favorable APOE genotype (ε3/ε3 or ε2 carrier) with neutral or protective APOC1 variants — indicates well-preserved brain lipid metabolism and clearance pathways.

### Strategies for Neuroprotection

Given the central role of brain lipid transport, dietary strategies that optimize lipid metabolism are particularly relevant. The ketogenic-Mediterranean hybrid approach — combining Mediterranean dietary patterns with mild carbohydrate restriction and enhanced MCT (medium-chain triglyceride) intake — provides ketone bodies as an alternative neuronal fuel source, bypassing the glucose hypometabolism characteristic of early AD. MCT oil (C8 caprylic acid, 15-30mL daily) produces ketones that can supply up to 12% of brain energy requirements.

Phospholipid supplementation with phosphatidylserine (300mg daily) and phosphatidylcholine (CDP-choline 500mg daily) may partially compensate for impaired apoE-mediated phospholipid delivery to neurons. Omega-3 fatty acid DHA (1-2g daily) integrates into neuronal membranes and has shown particular benefit in APOE ε4 non-carriers, with mixed results in ε4 carriers — suggesting the lipid transport deficit may reduce DHA delivery to target neurons.

Social engagement, cognitive training, and novel learning experiences activate brain-derived neurotrophic factor (BDNF) signaling, which supports synaptic plasticity independent of cholesterol-dependent mechanisms, potentially compensating for the lipid transport impairment.

For integrated strategies addressing APOE/APOC1-related Alzheimer's risk, visit [healthpro.ai](https://healthpro.ai/conditions/alzheimer-s-disease).`
  },

  "aortic-aneurysm": {
    name: "Aortic aneurysm",
    genes: "9p21.3",
    summary: "The 9p21.3 risk locus contains regulatory variants that silence CDKN2A/B tumor suppressors in vascular smooth muscle cells, promoting pathological aortic wall remodeling and aneurysm formation.",
    details: `## Understanding Aortic Aneurysm Genetics

An aortic aneurysm is a localized, pathological dilation of the aorta — the body's largest artery — to a diameter exceeding 1.5 times normal (typically >3.0 cm for the abdominal aorta or >4.5 cm for the ascending thoracic aorta). This silent but potentially fatal condition affects approximately 5-10% of men over 65 and 1-2% of women in the same age group. Aortic aneurysms progress asymptomatically for years, yet rupture carries a mortality rate exceeding 80%, making genetic risk identification and screening critically important.

### The 9p21.3 Locus: A Cardiovascular Risk Hub

The 9p21.3 chromosomal region is the most replicated cardiovascular risk locus in human genetics, associated with coronary artery disease, myocardial infarction, aortic aneurysm, and peripheral arterial disease. The risk variants — including rs10757278, rs1333049, and rs4977574 — reside in a 58-kilobase noncoding region (a "gene desert") that does not encode any protein. Instead, this region contains a long noncoding RNA gene, CDKN2B-AS1 (also known as ANRIL — antisense noncoding RNA in the INK4 locus), and acts as a distant enhancer for the adjacent CDKN2A and CDKN2B genes.

CDKN2A encodes p16INK4a (a cyclin-dependent kinase inhibitor that blocks CDK4/6, preventing Rb phosphorylation and arresting cells in G1) and p14ARF (which stabilizes p53 by sequestering MDM2). CDKN2B encodes p15INK4b, another CDK4/6 inhibitor. Together, these tumor suppressor proteins regulate cell cycle progression, cellular senescence, and apoptosis.

### How 9p21.3 Variants Drive Aneurysm Formation

In the aortic wall, vascular smooth muscle cells (VSMCs) are the primary structural cells responsible for maintaining vessel integrity. Unlike most differentiated cells, VSMCs retain remarkable phenotypic plasticity — they can switch between a contractile phenotype (expressing smooth muscle actin, myosin heavy chain, calponin) and a synthetic/proliferative phenotype (producing extracellular matrix components, migrating, proliferating).

Risk variants at 9p21.3 alter the enhancer landscape of this region, reducing CDKN2A/B expression in VSMCs by 40-60%. This releases the cell cycle brake normally maintained by p15INK4b and p16INK4a, allowing VSMCs to inappropriately enter the cell cycle. Paradoxically, this does not simply produce more VSMCs — instead, the loss of senescence checkpoints allows damaged VSMCs to continue proliferating rather than entering growth arrest. These "zombie" VSMCs produce excessive matrix metalloproteinases (MMP-2, MMP-9) and reduced collagen/elastin, fundamentally weakening the aortic wall.

The ANRIL long noncoding RNA further complicates this picture. ANRIL produced from the risk haplotype shows altered splicing patterns, generating circular RNA species (circANRIL) that impair ribosomal RNA maturation by binding to PES1, a component of the PeBoW complex essential for 47S pre-rRNA processing. This "ribosomal stress" activates p53 and promotes apoptosis in a subset of VSMCs — contributing to the paradox of aneurysms showing both inappropriate proliferation and excessive cell death in different regions.

### Aortic Wall Architecture and Failure

The normal aorta is an engineering marvel — 55-60 concentric layers of elastin lamellae alternating with VSMCs and collagen fibers in the tunica media, designed to withstand 100,000+ heartbeats per day (2.5 billion over a lifetime). Elastin provides extensibility (allowing the aorta to expand 10% with each systole — the "Windkessel effect" that converts pulsatile cardiac output to steady peripheral flow), while collagen provides tensile strength at high pressures.

Aneurysm formation involves: (1) Elastin degradation — MMP-2 and MMP-9 (gelatinases) cleave elastin fibers, destroying the aorta's elastic recoil; (2) VSMC loss — through apoptosis, necroptosis, and phenotypic switch to non-contractile states; (3) Inflammatory infiltration — macrophages, T lymphocytes, and mast cells infiltrate the media, producing additional proteases and inflammatory cytokines; (4) Collagen remodeling — initial compensatory collagen deposition followed by eventual collagen degradation as MMP activity overwhelms tissue inhibitors (TIMPs).

The aneurysm expands according to Laplace's law — wall tension increases proportionally with diameter. Once diameter exceeds 5.5 cm (abdominal) or 5.0-5.5 cm (thoracic), the risk of rupture increases exponentially because wall stress exceeds the tensile strength of the degraded tissue.

### Risk Level Implications

**Elevated risk** — homozygous for 9p21.3 risk alleles — indicates significantly enhanced VSMC dysregulation and aortic wall remodeling potential. Abdominal aortic aneurysm (AAA) screening with ultrasound should begin at age 55-60 (vs. the standard recommendation of 65 for male smokers), and thoracic aortic imaging should be considered if family history is positive.

**Moderate risk** — heterozygous carriers — face modestly increased susceptibility, particularly in the presence of compounding risk factors (smoking, hypertension, male sex, connective tissue disorders).

**Typical risk** means 9p21.3 is not contributing additional aneurysm susceptibility beyond baseline population risk.

### Prevention and Surveillance

Smoking cessation is the most impactful modifiable intervention — smoking increases AAA risk 5-fold through direct endothelial damage, MMP activation, and enhanced inflammatory cell recruitment. Each year of continued smoking accelerates aneurysm growth by an estimated 0.4 mm/year.

Blood pressure control (<130/80 mmHg) reduces aortic wall stress. Beta-blockers (propranolol, atenolol) reduce the rate of aortic dilation by decreasing dP/dt (the rate of pressure rise during systole), though evidence for preventing AAA progression is less robust than for thoracic aneurysms in Marfan syndrome.

Statin therapy (independent of cholesterol levels) may slow aneurysm progression through anti-inflammatory and MMP-inhibitory effects — statins reduce MMP-9 expression in aortic tissue by 30-50% in observational studies.

Regular surveillance imaging: once an aneurysm is detected, monitoring intervals depend on size (every 3 years for 3.0-3.9 cm, annually for 4.0-4.4 cm, every 6 months for 4.5-5.4 cm, with surgical referral at ≥5.5 cm or growth rate >1.0 cm/year).

For genetic cardiovascular risk assessment and aortic health monitoring strategies, visit [healthpro.ai](https://healthpro.ai/conditions/aortic-aneurysm).`
  },

  "aortic-valve-stenosis": {
    name: "Aortic valve stenosis",
    genes: "LPA",
    summary: "Elevated lipoprotein(a) driven by LPA gene variants accelerates calcific aortic valve disease through oxidized phospholipid deposition, osteogenic transformation of valve interstitial cells, and progressive valve calcification.",
    details: `## Understanding LPA-Driven Aortic Valve Stenosis

Aortic valve stenosis (AVS) — the progressive narrowing of the aortic valve opening due to calcific degeneration — is the most common valvular heart disease in the developed world, affecting 2-4% of adults over 65. Once symptomatic (exertional dyspnea, syncope, angina), untreated severe AVS carries a 50% mortality rate within 2 years. The discovery that elevated lipoprotein(a) [Lp(a)], genetically determined by LPA variants, is a causal risk factor for AVS has transformed our understanding of this disease from "degenerative wear-and-tear" to an active, genetically driven pathological process.

### LPA Gene and Lipoprotein(a) Biology

The LPA gene on chromosome 6q25.3 encodes apolipoprotein(a) [apo(a)], a highly glycosylated protein uniquely found in humans and Old World primates. Apo(a) contains repetitive protein domains called kringles — specifically, a variable number of kringle IV type 2 (KIV-2) repeats that determine both apo(a) protein size and Lp(a) plasma concentration. The number of KIV-2 repeats is inversely correlated with Lp(a) levels: fewer repeats produce a smaller apo(a) protein that is secreted more efficiently by hepatocytes, resulting in higher plasma Lp(a).

Apo(a) is covalently linked to apolipoprotein B-100 on an LDL-like particle via a single disulfide bond, creating the Lp(a) particle. The KIV-2 copy number variation (CNV) accounts for approximately 70% of the variance in Lp(a) levels — making it one of the most genetically determined biomarkers in human biology. Additional single-nucleotide variants including rs10455872, rs3798220, and rs186696265 further modulate Lp(a) concentrations.

### The Mechanism: How Lp(a) Destroys the Aortic Valve

The aortic valve comprises three semilunar cusps (leaflets), each 1-2 mm thick, composed of three layers: the fibrosa (collagen-rich, aortic side), spongiosa (proteoglycan-rich, middle), and ventricularis (elastin-rich, ventricular side). Valve interstitial cells (VICs) — fibroblast-like cells embedded in the extracellular matrix — maintain valve homeostasis through balanced matrix synthesis and degradation.

Lp(a) carries oxidized phospholipids (OxPLs) on its apo(a) component — indeed, Lp(a) is the primary carrier of OxPLs in human plasma. These OxPLs, particularly 1-palmitoyl-2-(5-oxovaleroyl)-sn-glycero-3-phosphocholine (POVPC), activate valve endothelial cells through TLR2-mediated signaling, promoting: (1) Monocyte recruitment via MCP-1 (CCL2) secretion; (2) Endothelial permeability increase allowing Lp(a) infiltration into the valve interstitium; (3) Upregulation of adhesion molecules (VCAM-1, ICAM-1) facilitating inflammatory cell attachment.

Once within the valve interstitium, Lp(a)-associated OxPLs drive osteogenic transformation of VICs — a pathological process where fibroblast-like VICs transdifferentiate into osteoblast-like cells expressing RUNX2 (the master osteogenic transcription factor), bone morphogenetic protein 2 (BMP-2), alkaline phosphatase, and osteocalcin. These transformed VICs actively deposit hydroxyapatite — the same calcium phosphate mineral found in bone — creating the calcific nodules that progressively stiffen the valve leaflets.

Autotaxin, an enzyme carried on Lp(a) particles, converts lysophosphatidylcholine to lysophosphatidic acid (LPA), which activates LPA receptors (LPAR1/3) on VICs, further stimulating osteogenic differentiation and NF-κB-mediated inflammation. This creates a self-amplifying cycle: Lp(a) infiltration → inflammation → osteogenic transformation → calcification → increased mechanical stress on remaining tissue → endothelial damage → more Lp(a) infiltration.

### Progressive Hemodynamic Consequences

As calcification stiffens the valve cusps, the effective orifice area decreases from the normal 3-4 cm² toward critical stenosis at <1.0 cm². The left ventricle must generate progressively higher pressures to eject blood through the narrowed orifice (transvalvular gradient increases from normal <5 mmHg to >40 mmHg in severe stenosis).

This chronic pressure overload triggers concentric left ventricular hypertrophy — cardiomyocytes increase in diameter (not number), with parallel addition of sarcomeres. Initially compensatory, the hypertrophy eventually becomes maladaptive: myocardial oxygen demand outstrips supply (because coronary perfusion occurs during diastole, and the thickened, stiff ventricle impairs diastolic filling), subendocardial ischemia develops, interstitial fibrosis replaces functional myocardium, and diastolic then systolic function deteriorates toward heart failure.

### Genetically Determined Risk

**Elevated risk** — LPA variants producing Lp(a) >50 mg/dL (>120 nmol/L) — confers a 2-3 fold increased risk of AVS. Individuals with Lp(a) >180 nmol/L face a nearly 5-fold elevation. These levels are essentially fixed from birth and persist lifelong.

**Moderate risk** — Lp(a) 30-50 mg/dL — modestly elevates AVS risk, particularly when combined with traditional cardiovascular risk factors (hypertension, diabetes, hypercholesterolemia).

**Typical risk** — Lp(a) <30 mg/dL — indicates the LPA genetic profile does not contribute meaningfully to valve calcification risk.

### Management Approaches

Currently, no pharmacotherapy has been proven to slow AVS progression. However, Lp(a)-lowering therapies are in advanced clinical development: antisense oligonucleotides (pelacarsen, targeting LPA mRNA) reduce Lp(a) by 80%, and small interfering RNAs (olpasiran, lepodisiran) achieve 95-100% Lp(a) reduction. The Lp(a)HORIZON cardiovascular outcomes trial (reporting ~2025-2026) will determine whether pharmacological Lp(a) lowering reduces cardiovascular events.

For individuals with elevated genetic Lp(a), aggressive management of all modifiable risk factors — LDL cholesterol <70 mg/dL (via statins and PCSK9 inhibitors), blood pressure <130/80, optimal glycemic control, smoking cessation — reduces the additive cardiovascular burden. Echocardiographic surveillance should begin earlier (age 55+) for those with elevated Lp(a) and any degree of aortic valve sclerosis.

Valve replacement (surgical aortic valve replacement or transcatheter aortic valve replacement/TAVR) remains the definitive treatment for symptomatic severe AVS, with TAVR now approved for all surgical risk categories.

Learn more about Lp(a)-related cardiovascular risk at [healthpro.ai](https://healthpro.ai/conditions/aortic-valve-stenosis).`
  }
};

// I'll continue adding the remaining conditions programmatically
// For now, let me output what we have and see the structure

console.log(`Defined ${Object.keys(CONDITIONS).length} conditions so far`);
