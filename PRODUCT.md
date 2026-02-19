# Telomere AI — Product Design Document

## Philosophy
A genetic analysis app that feels like a **premium health product**, not a research tool.
The user should never feel overwhelmed. Every screen answers: "What does this mean for ME?"

---

## Core User Flow

```
Open App → Drop File → Processing Animation → Results Dashboard
```

No accounts. No onboarding wizard. One action: open your file. Everything else flows from there.

---

## Screen-by-Screen Design

### 1. Welcome / First Launch
**What the user sees when they first open the app (no data loaded yet)**

- Clean, centered layout
- Large drop zone (whole screen IS the drop zone, not a small box)
- Headline: "Drop your genetic data to get started"
- Subtitle: "Supports 23andMe, AncestryDNA, MyHeritage, and VCF files"
- Animated DNA helix in background (subtle, not distracting)
- "Browse Files" button as secondary action
- Bottom: links to "How to download your data" with provider-specific instructions
- Bottom: "Your data never leaves this device" trust badge

**Key UX Details:**
- The ENTIRE content area is a drop target (not just a box)
- Dragging a file over makes the whole screen glow with a cyan border
- Click anywhere opens the file picker
- Supports .txt, .csv, .vcf, .tsv, .zip (auto-extracts zip)

### 2. Processing Screen
**After file is dropped — full-screen takeover**

- Full-screen dark background with centered content
- Large animated DNA double helix (the hero moment)
- Progress through 4 labeled phases:
  1. **Reading file** — "Reading genome_data.txt..."
  2. **Parsing variants** — Counter ticking up "247,831 variants found..."  
  3. **Analyzing genotypes** — "Matching against 257 health markers..."
  4. **Preparing your report** — Brief pause, then transition
- Each phase has a subtle animation transition
- The variant counter should tick up rapidly (feels fast and impressive)
- Total processing time: 2-5 seconds (Rust is fast)
- Smooth transition to results (no jarring page change)

**No "click to continue" button. It automatically transitions.**

### 3. Results Dashboard
**The main screen after analysis. This is where users spend 90% of their time.**

#### 3a. Top Summary Bar
- File info: "genome_data.txt • 23andMe • 547,832 SNPs"
- "Load different file" link (subtle, top-right)

#### 3b. Personal Genome Overview Card
A hero card at the top showing:
- **Total variants analyzed**: "257 health markers matched"
- **Risk breakdown**: visual bar showing high/moderate/normal distribution
- **Genome coverage**: mini chromosome ideogram showing which chromosomes have data

#### 3c. Report Categories (Primary Navigation)
Six large cards in a 2×3 or 3×2 grid. Each card shows:
- Category icon (SVG, not emoji)
- Category name
- One-line description  
- Number of findings
- Risk summary: "3 elevated • 12 moderate • 28 normal"
- Subtle arrow indicating it's clickable

**Categories:**
1. **Health Risks** — Cardiovascular, cancer, diabetes, autoimmune
2. **Longevity & Aging** — Telomere length, FOXO3, APOE, biological aging
3. **Nutrition & Diet** — Food sensitivities, vitamin metabolism, MTHFR
4. **Drug Response** — How you metabolize medications (CYP450, warfarin, statins)
5. **Traits & Wellness** — Eye color, muscle type, sleep, taste, caffeine
6. **Carrier Status** — Conditions you could pass to children

**Click a card → navigates to that category's detail page**

#### 3d. Notable Findings Section
Below the grid, show the top 5-8 most significant findings:
- Sorted by clinical significance (high risk first)
- Each is a compact card showing: gene, trait, your genotype, risk level
- Click → expands inline OR navigates to detail

#### 3e. Sidebar (Desktop) / Bottom Nav (If needed)
- Quick links to each category
- Search (searches across all variants)
- Settings (export, about, help)

### 4. Category Detail Page (e.g., "Health Risks")
**When user clicks a category card**

#### 4a. Header
- Back button → Dashboard
- Category icon + name
- Description paragraph explaining what this category covers
- Summary stats: "47 variants • 3 elevated risk • 12 moderate"

#### 4b. Sub-categories (Grouping)
Within Health Risks, group findings by topic:
- **Cardiovascular** — CAD, stroke, thrombophilia
- **Metabolic** — Type 2 diabetes, obesity risk
- **Cancer** — Breast, prostate, colorectal risk markers
- **Autoimmune** — Celiac, rheumatoid arthritis
- **Neurological** — Alzheimer's, Parkinson's

Each sub-group is collapsible with a count badge.

#### 4c. Variant Cards
Each variant is a row/card showing:
- **Left color bar** — red/amber/green based on your risk level
- **rsID** in monospace (clickable → detail view)
- **Gene name** (bold)
- **Trait name** (the human-readable description)
- **Your genotype** (large, prominent) with risk interpretation
- **Significance badge** — "Well-established" / "Moderate" / "Preliminary"
- **Expand arrow** →

**Clicking expands the card inline to show:**
- Full description of what this variant means
- Your result explained in plain English
- Population frequency bar chart (with "You" marker)
- Associated conditions list
- Actionable recommendations
- Scientific references (PubMed links)
- "What this means" section in lay language

### 5. Individual Variant Detail Page
**Full-page view for a single SNP (accessible via search or clicking rsID)**

- **Hero section**: Large genotype display, gene name, trait
- **Your Result panel**: 
  - Your genotype in big text
  - Risk gauge (circular SVG)
  - Plain English: "You carry two copies of the risk allele"
- **What This Means**: 2-3 paragraph explanation
- **Population Frequency**: 
  - Horizontal bar chart showing all genotype frequencies
  - Your position highlighted with "You are here" marker
  - Population breakdown if available (European, African, Asian, etc.)
- **Associated Conditions**: List with brief descriptions
- **Recommendations**: Actionable items with evidence level
- **Scientific Evidence**: 
  - Evidence strength indicator (stars or similar)
  - PubMed references (linked)
  - Study details (sample size, year)
- **Related Variants**: Other SNPs in the same gene or pathway

### 6. Search
**Global search accessible from any screen (Cmd/Ctrl+K)**

- Search by rsID, gene name, trait, condition
- Fuzzy matching
- Results grouped: "In Your Data" vs "In Database"
- Shows risk level and genotype in results
- Click → navigates to variant detail

### 7. SNP Explorer / Raw Data Browser
**For power users who want to browse ALL their data**

- Sortable table view of all parsed SNPs
- Columns: rsID, Chromosome, Position, Genotype
- Filter by chromosome
- Search/filter bar
- Highlights rows that match our database (color-coded)
- Export to CSV button
- Pagination or virtual scrolling (600k+ rows)

### 8. Settings / Preferences
- **Export Report**: PDF export of all findings
- **Data Info**: File stats, format, build version
- **About**: Version, credits, license
- **Help**: FAQ, how to get raw data, understanding results
- **Keyboard Shortcuts**: List of available shortcuts

---

## Design Principles

### Visual Language
- **Dark theme only** (genetic data feels scientific, dark = premium)
- **Glassmorphism** for cards (frosted glass effect)
- **Cyan (#00E5CC) as primary accent** — feels scientific/biotech
- **Color-coded risk levels**: Red (high), Amber (moderate), Green (normal/protective)
- **Monospace for genetic data**: rsIDs, genotypes, chromosomal positions
- **Sans-serif for everything else**: Inter
- **Subtle glow effects** on interactive elements
- **Smooth transitions** everywhere (200ms ease-out)

### Tone of Voice
- **Never alarmist**: "Elevated risk" not "You will get cancer"
- **Always contextual**: "This variant is found in 14% of Europeans"
- **Action-oriented**: Every finding has a "What you can do" section
- **Honest about limitations**: "This is one of many factors"
- **No medical jargon without explanation**: Always explain terms

### Accessibility
- All color-coding also has text/icon indicators (not color-only)
- Keyboard navigable (Tab, Enter, Escape, Arrow keys)
- Screen reader labels on all interactive elements
- Minimum 4.5:1 contrast ratios on text
- Focus indicators visible

### Performance
- File parsing < 3 seconds for 600k SNPs
- Instant UI response (no loading spinners within the app)
- Virtual scrolling for large lists (SNP Explorer)
- Lazy-load variant details (don't compute all on initial load)

---

## Data Model

### Parsed SNP (from user's file)
```
rsid: string        // rs1801133
chromosome: string  // 1
position: number    // 11856378
genotype: string    // CT
allele1: string     // C
allele2: string     // T
```

### Database Entry (our curated data)
```
rsid: string
gene: string
chromosome: string
position: number
categories: string[]     // ['health', 'nutrition']
subcategory: string      // 'cardiovascular', 'metabolic', etc. (NEW)
significance: string     // 'well-established', 'moderate', 'preliminary'
riskAllele: string
normalAllele: string
trait: string            // Human-readable name
summary: string          // One-line plain English summary (NEW)
riskDescription: string
normalDescription: string  
heterozygousDescription: string
whatThisMeans: string    // 2-3 paragraph lay explanation (NEW)
populationFrequency: { [genotype]: number }
conditions: string[]
recommendations: string[]
references: string[]     // PMID:xxxxx
evidenceLevel: string    // 'strong', 'moderate', 'limited' (NEW)
relatedSnps: string[]    // rsIDs of related variants (NEW)
```

### Matched Result (user SNP + database entry)
```
...databaseEntry,
userGenotype: string
riskLevel: 'high' | 'moderate' | 'low' | 'normal' | 'protective'
riskPercent: number      // 0-100 for gauge display
description: string      // Context-appropriate description for THIS user's genotype
```

---

## What's Missing From Current Build

### Must-Have (Ship-blocking)
1. **Subcategories** within each report category (cardiovascular, metabolic, etc.)
2. **Summary field** on each SNP — one-line plain English
3. **What This Means** extended explanation on each SNP
4. **Evidence level** indicator on each finding
5. **SVG icons** instead of emoji for all category icons
6. **PDF export** of full report
7. **Keyboard shortcuts** (Cmd+K search, Escape to close, arrow nav)
8. **Virtual scrolling** for SNP Explorer (can't render 600k rows)
9. **Better chromosome map** — interactive, clickable chromosomes
10. **"How to download your data"** help page with provider screenshots

### Nice-to-Have (Post-launch)
1. **Ancestry composition** (if we can derive from SNP data)
2. **Haplogroup detection** (Y-DNA and mtDNA)
3. **Trait predictions** (eye color, hair color, etc. with confidence)
4. **Family comparison** (load two files, show differences)
5. **Gene pathway visualization** (how related SNPs interact)
6. **Polygenic risk scores** for common conditions
7. **Print-friendly report** layout
8. **Auto-update** for database (check for new SNP entries)
9. **Localization** (multi-language support)
10. **Bookmarks/Favorites** — save interesting variants

---

## Competitive Positioning

| Feature | Telomere AI | SelfDecode ($297/yr) | Promethease ($12) |
|---------|-------------|---------------------|-------------------|
| Price | Free | $297/year | $12 one-time |
| Privacy | 100% offline | Cloud | Cloud |
| Open Source | Yes | No | No |
| Report Quality | Professional, explained | Excellent | Raw/technical |
| SNP Database | 257+ curated | 83M+ (imputed) | ~300K (SNPedia) |
| Recommendations | Yes, per-variant | Yes, AI-generated | No |
| Evidence Levels | Yes | Yes | Magnitude score |
| PDF Export | Yes | Yes | Yes |
| Sub-categories | Yes | Yes | No (flat list) |
| Plain English | Yes | Yes | Partial |
| Family Comparison | Planned | No | No |

**Our edge**: Free + offline + open source + explained in plain English.
**Our weakness**: Smaller database (257 vs millions). Offset by curation quality.

---

## Implementation Priority

### Phase 1: Ship-Ready Desktop App
- [ ] Subcategories in database entries
- [ ] Summary + whatThisMeans fields on all SNPs  
- [ ] SVG icons for categories (replace emoji)
- [ ] Polish upload flow (full-screen, counter animation)
- [ ] Polish results dashboard (sub-groups, better cards)
- [ ] Variant detail page improvements
- [ ] "How to download your data" help page
- [ ] PDF export
- [ ] Keyboard navigation
- [ ] Medical disclaimers on every screen

### Phase 2: Expand & Polish  
- [ ] Expand database to 500+ SNPs
- [ ] Virtual scrolling for raw data browser
- [ ] Interactive chromosome map
- [ ] Gene pathway connections
- [ ] Trait predictions with confidence levels

### Phase 3: Advanced Features
- [ ] Polygenic risk scores (bundled PGS files)
- [ ] Family comparison mode
- [ ] Haplogroup detection
- [ ] Ancestry composition
- [ ] Auto-update mechanism
