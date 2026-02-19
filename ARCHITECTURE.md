# Telomere AI — Architecture & Product Plan

## Vision
The **free, open-source alternative** to SelfDecode ($297/yr), Promethease ($12), and Nebula. Upload your raw genetic data from 23andMe, AncestryDNA, MyHeritage, or any VCF/23andMe format file — get AI-powered health insights, SNP analysis, and longevity reports. Zero cost. No data selling.

## Why "Telomere"
Telomeres are the protective caps on chromosomes that shorten with age — a direct biomarker of biological aging. The name signals: **we care about longevity, not ancestry party tricks.**

## Competitive Positioning

| Feature | SelfDecode ($297/yr) | Promethease ($12) | Telomere AI (Free) |
|---|---|---|---|
| Price | $297/year | $12 one-time | **Free** |
| AI Analysis | Yes (GPT-based) | No | **Yes (GPT-4o)** |
| SNP Database | Proprietary | SNPedia | **ClinVar + SNPedia + PharmGKB** |
| Report Quality | Excellent | Raw/technical | **Professional + AI explanations** |
| Privacy | Stores data | Stores data | **Client-side processing option** |
| Upload Formats | 23andMe, Ancestry | 23andMe, Ancestry, VCF | **All major formats** |
| Open Source | No | No | **Yes** |

## Target Users
1. **Biohackers** — Already have 23andMe/Ancestry data, want deeper analysis
2. **Health-conscious consumers** — Curious about genetic predispositions
3. **Longevity enthusiasts** — Want telomere/aging-related insights
4. **Researchers** — Need quick SNP lookups with literature references

---

## Product Architecture

### Frontend: `telomere.ai` (SvelteKit + Vite monorepo)

```
telomere.ai/
├── apps/
│   └── web/                    # SvelteKit app
│       ├── src/
│       │   ├── routes/
│       │   │   ├── +page.svelte              # Landing page
│       │   │   ├── +layout.svelte            # Root layout
│       │   │   ├── upload/+page.svelte       # Upload & parse
│       │   │   ├── dashboard/+page.svelte    # Results overview
│       │   │   ├── report/
│       │   │   │   ├── health/+page.svelte   # Health risks report
│       │   │   │   ├── longevity/+page.svelte # Aging & telomere
│       │   │   │   ├── nutrition/+page.svelte # Nutrigenomics
│       │   │   │   ├── pharma/+page.svelte   # Pharmacogenomics
│       │   │   │   ├── traits/+page.svelte   # Physical traits
│       │   │   │   └── carrier/+page.svelte  # Carrier status
│       │   │   ├── snp/[rsid]/+page.svelte   # Individual SNP detail
│       │   │   ├── explore/+page.svelte      # SNP browser/search
│       │   │   ├── about/+page.svelte
│       │   │   ├── privacy/+page.svelte
│       │   │   ├── blog/+page.svelte
│       │   │   ├── blog/[slug]/+page.svelte
│       │   │   └── api/
│       │   │       ├── parse/+server.js      # Parse genetic file
│       │   │       ├── analyze/+server.js    # AI analysis
│       │   │       └── snp/[rsid]/+server.js # SNP lookup
│       │   ├── lib/
│       │   │   ├── components/
│       │   │   │   ├── Nav.svelte
│       │   │   │   ├── Footer.svelte
│       │   │   │   ├── FileUpload.svelte
│       │   │   │   ├── SnpCard.svelte
│       │   │   │   ├── RiskGauge.svelte
│       │   │   │   ├── ChromosomeMap.svelte
│       │   │   │   ├── ReportSection.svelte
│       │   │   │   └── DnaHelix.svelte       # Animated hero
│       │   │   ├── parsers/
│       │   │   │   ├── twentythree.js        # 23andMe format
│       │   │   │   ├── ancestry.js           # AncestryDNA
│       │   │   │   ├── myheritage.js         # MyHeritage
│       │   │   │   ├── vcf.js                # VCF format
│       │   │   │   └── detect.js             # Auto-detect format
│       │   │   ├── analysis/
│       │   │   │   ├── snp-database.js       # Local SNP reference data
│       │   │   │   ├── risk-calculator.js    # Polygenic risk scoring
│       │   │   │   ├── categories.js         # Report categories
│       │   │   │   └── clinvar.js            # ClinVar lookups
│       │   │   ├── stores/
│       │   │   │   ├── genetic-data.js       # Parsed SNP data store
│       │   │   │   └── reports.js            # Generated reports
│       │   │   └── utils/
│       │   │       ├── crypto.js             # Client-side encryption
│       │   │       └── export.js             # PDF/JSON export
│       │   └── app.css
│       ├── static/
│       ├── tailwind.config.js
│       ├── svelte.config.js
│       └── vite.config.js
├── packages/
│   ├── snp-db/                 # SNP reference database package
│   │   ├── data/               # Curated SNP data (JSON)
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── lookup.js
│   │   │   └── categories.js
│   │   └── package.json
│   └── parsers/                # Genetic file parsers
│       ├── src/
│       │   ├── index.js
│       │   ├── twentythree.js
│       │   ├── ancestry.js
│       │   ├── vcf.js
│       │   └── detect.js
│       └── package.json
├── package.json                # Workspace root
├── pnpm-workspace.yaml
└── README.md
```

### Backend: `telomere_backend` (separate repo, Elysia/Bun)
- AI analysis endpoints (OpenAI GPT-4o)
- SNP database API (ClinVar, PharmGKB lookups)
- Optional: user accounts, saved reports
- Rate limiting, abuse prevention

---

## Design System — "Bioluminescent Dark"

### Philosophy
Futuristic, scientific, premium. Think: **if a DNA sequencing lab had a consumer app designed by Dieter Rams.** Dark mode primary with bioluminescent accent colors that evoke cellular biology.

### Colors
```
--bg-primary:      #0A0E17        // Deep space black
--bg-secondary:    #111827        // Card backgrounds
--bg-tertiary:     #1A2235        // Elevated surfaces
--surface:         #0F1629        // Input fields, panels

--text-primary:    #F0F4F8        // Main text
--text-secondary:  #8B95A5        // Muted text
--text-tertiary:   #4A5568        // Disabled text

--accent-cyan:     #00E5CC        // Primary accent — telomere/DNA
--accent-blue:     #3B82F6        // Links, interactive
--accent-violet:   #8B5CF6        // AI/insights
--accent-amber:    #F59E0B        // Warnings, risk
--accent-red:      #EF4444        // High risk
--accent-green:    #10B981        // Low risk, positive

--gradient-dna:    linear-gradient(135deg, #00E5CC, #3B82F6)  // Hero gradient
--gradient-glow:   radial-gradient(ellipse, #00E5CC15, transparent 70%)  // Background glow
```

### Typography
- **Headlines**: Inter, 700 weight, tight tracking (-0.02em)
- **Body**: Inter, 400 weight, relaxed line-height (1.7)
- **Mono/Data**: JetBrains Mono — for SNP IDs, genotypes, chromosome positions
- **Report headings**: Inter, 600 weight

### Visual Elements
- **Glassmorphism cards**: `backdrop-blur-xl bg-white/5 border border-white/10`
- **Glow effects**: Subtle cyan/violet radial gradients behind key elements
- **DNA helix animation**: Animated SVG/CSS double helix on hero
- **Chromosome visualization**: Interactive chromosome ideogram (1-22, X, Y)
- **Risk gauges**: Circular SVG gauges with gradient strokes
- **Particle effects**: Subtle floating DNA base pair particles (A, T, G, C)
- **Data tables**: Dark with row hover glow, monospace genotype columns
- **Charts**: Area/bar charts with glow-on-dark aesthetic

### Layout
- **Max width**: 1280px
- **Grid**: 4px spacing system
- **Border radius**: 12px (cards), 8px (buttons), 6px (inputs)
- **Shadows**: Colored glow shadows (`0 0 40px rgba(0,229,204,0.1)`)

---

## Pages

### 1. Landing Page
- **Hero**: Animated DNA double helix (SVG/CSS), "Decode Your DNA. For Free."
- **Upload CTA**: Prominent drag-drop zone
- **How it works**: 3-step flow (Upload → Parse → Insights)
- **Report previews**: 6 report category cards with glass morphism
- **Supported formats**: 23andMe, AncestryDNA, MyHeritage, VCF logos
- **Privacy promise**: "Your data never leaves your browser" messaging
- **Stats**: "500,000+ SNPs analyzed", "4,000+ health associations"
- **Comparison table**: vs SelfDecode vs Promethease
- **FAQ**: Common questions about genetic analysis
- **Footer**: Links, open source badge, privacy policy

### 2. Upload Page (`/upload`)
- Large drag-drop zone with DNA particle animation
- Auto-format detection
- Real-time parsing progress (SNP count, chromosomes found)
- Client-side parsing (file never leaves browser by default)
- Option to "analyze with AI" (sends to backend)
- Parsing stats dashboard (total SNPs, coverage, quality)

### 3. Dashboard (`/dashboard`)
- **Overview cards**: 6 report categories with risk summary
- **Genome coverage**: Chromosome map showing coverage
- **Top findings**: AI-curated most significant SNPs
- **Risk heatmap**: Visual grid of health categories
- **Quick actions**: View reports, export data, search SNPs

### 4. Reports (`/report/*`)
Six detailed report pages:

#### Health Risks (`/report/health`)
- Cardiovascular, cancer, diabetes, neurological, autoimmune
- Each condition: polygenic risk score + individual SNPs
- Risk gauge visualization
- Literature references (PubMed links)
- AI-generated plain-English explanations

#### Longevity & Aging (`/report/longevity`)
- Telomere-related SNPs (TERT, TERC, OBFC1, etc.)
- Biological age estimation
- Oxidative stress markers
- DNA repair pathway genes
- Inflammation markers (IL-6, TNF-α, CRP genes)

#### Nutrigenomics (`/report/nutrition`)
- Caffeine metabolism (CYP1A2)
- Lactose tolerance (MCM6)
- Alcohol flush (ALDH2)
- Vitamin metabolism (MTHFR, VDR, etc.)
- Dietary recommendations based on genotype

#### Pharmacogenomics (`/report/pharma`)
- Drug metabolism (CYP2D6, CYP2C19, CYP3A4)
- Drug response predictions
- Adverse reaction risks
- Dosage guidance indicators
- FDA pharmacogenomic labels

#### Physical Traits (`/report/traits`)
- Eye color, hair color, skin pigmentation
- Muscle composition (ACTN3)
- Sleep patterns (PER2, CLOCK)
- Pain sensitivity
- Taste perception

#### Carrier Status (`/report/carrier`)
- Recessive condition carrier screening
- Cystic fibrosis, sickle cell, Tay-Sachs, etc.
- Family planning relevance indicators

### 5. SNP Explorer (`/explore`)
- Search by rsID, gene name, or condition
- Filter by chromosome, category, significance
- Sortable data table with genotype, risk, literature
- Bulk export

### 6. SNP Detail (`/snp/[rsid]`)
- Full SNP information card
- Your genotype vs population frequencies
- Associated conditions with odds ratios
- PubMed literature links
- ClinVar classification
- PharmGKB drug interactions
- AI explanation

---

## Technical Details

### File Parsing (Client-Side)
```
23andMe format:  # rsid  chromosome  position  genotype
                 rs12345  1  12345  AG

AncestryDNA:     rsid  chromosome  position  allele1  allele2
                 rs12345  1  12345  A  G

VCF:             #CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
                 1  12345  rs12345  A  G  .  PASS  .  GT  0/1
```

### SNP Database (Curated)
~2,000 high-impact SNPs across categories:
- 400+ health risk SNPs
- 200+ pharmacogenomics SNPs
- 150+ longevity/aging SNPs
- 200+ nutrigenomics SNPs
- 150+ trait SNPs
- 100+ carrier status SNPs

Each entry:
```json
{
  "rsid": "rs1801133",
  "gene": "MTHFR",
  "chromosome": 1,
  "position": 11856378,
  "category": ["nutrition", "health"],
  "significance": "pathogenic",
  "riskAllele": "T",
  "normalAllele": "C",
  "population": { "CC": 0.44, "CT": 0.42, "TT": 0.14 },
  "conditions": [
    {
      "name": "MTHFR C677T Variant",
      "description": "Reduced methylation efficiency, elevated homocysteine",
      "riskGenotype": "TT",
      "oddsRatio": 1.8,
      "category": "nutrition"
    }
  ],
  "references": ["PMID:15060097", "PMID:22065156"]
}
```

### AI Analysis Pipeline
1. Parse file → extract user's genotypes for known SNPs
2. Match against curated database → generate base report
3. Send significant findings to backend → GPT-4o generates:
   - Plain-English explanations
   - Personalized recommendations
   - Cross-SNP interaction analysis
   - Risk contextualization
4. Return AI-enhanced report to frontend

### Privacy Model
- **Default**: Client-side only parsing. File stays in browser.
- **Optional**: "Enhance with AI" sends only rsIDs + genotypes (not raw file) to backend
- **Never**: Raw files are never stored server-side
- **Export**: Users can download their parsed data as JSON

---

## Deployment
- **Frontend**: Hetzner/Coolify (same as taxation.ai), `adapter-node`, Docker
- **Backend**: Separate Hetzner container, Elysia/Bun
- **Domain**: telomere.ai (or telomereai.com)
- **Analytics**: Plausible (self-hosted at analytics.server.vaionex.com)
