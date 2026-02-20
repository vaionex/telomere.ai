# 🧬 Telomere AI

**Free, open-source genetic analysis platform. Your DNA never leaves your device.**

Analyze your 23andMe, AncestryDNA, MyHeritage, or VCF data directly in your browser at [telomere.ai](https://telomere.ai) — or download the desktop app for fully offline use.

<p align="center">
  <a href="https://telomere.ai">Website</a> •
  <a href="https://github.com/vaionex/telomere.ai/releases">Download</a> •
  <a href="#building-from-source">Build from Source</a>
</p>

---

## Why Telomere AI?

| | Telomere AI | SelfDecode | Promethease |
|---|---|---|---|
| **Price** | Free | $297/yr | $12 |
| **Privacy** | 100% local (browser or desktop) | Cloud-based | Cloud-based |
| **Open Source** | ✓ | ✗ | ✗ |
| **SNP Database** | 378+ curated | Proprietary | SNPedia |
| **AI Reports** | ✓ (local) | ✓ | ✗ |

## Features

- **6 Report Categories** — Health risks, longevity/aging, nutrigenomics, pharmacogenomics, physical traits, carrier status
- **378+ Curated SNPs** — Real clinical data from ClinVar, PharmGKB, and peer-reviewed GWAS studies
- **All Major Formats** — 23andMe, AncestryDNA, MyHeritage CSV, VCF 4.x
- **Browser or Desktop** — Use at [telomere.ai](https://telomere.ai) instantly, or download the desktop app for offline use
- **Zero Network Access** — All analysis happens locally. Your genetic data never leaves your device.
- **Polygenic Risk Scores** — Offline PGS calculator with bundled scoring files

## Download

Grab the latest release for your platform:

| Platform | Download |
|---|---|
| **Windows** (x64) | [.msi installer](https://github.com/vaionex/telomere.ai/releases/latest) |
| **macOS** (Apple Silicon) | [.dmg](https://github.com/vaionex/telomere.ai/releases/latest) |
| **macOS** (Intel) | [.dmg](https://github.com/vaionex/telomere.ai/releases/latest) |
| **Linux** (AppImage) | [.AppImage](https://github.com/vaionex/telomere.ai/releases/latest) |
| **Linux** (Debian/Ubuntu) | [.deb](https://github.com/vaionex/telomere.ai/releases/latest) |

## How It Works

1. **Open your raw data file** — Download it from your genetic testing provider
2. **Instant local analysis** — Rust engine parses your SNPs and matches against our curated database
3. **Explore your reports** — Browse findings by category, search by gene or rsID, see population frequencies

Your genetic data never leaves your computer. The app works fully offline.

## Building from Source

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+
- Platform-specific Tauri dependencies: [see Tauri docs](https://v2.tauri.app/start/prerequisites/)

### Steps

```bash
# Clone
git clone https://github.com/vaionex/telomere.ai.git
cd telomere.ai

# Install JS dependencies
pnpm install

# Run in development mode
pnpm tauri:dev

# Build release
pnpm tauri:build
```

The built app will be in `src-tauri/target/release/bundle/`.

## Project Structure

```
telomere.ai/
├── apps/web/                 # SvelteKit frontend (Svelte 5)
│   ├── src/routes/           # Pages: landing, upload, dashboard, reports, SNP explorer
│   ├── src/lib/components/   # DnaHelix, FileUpload, SnpCard, RiskGauge, ChromosomeMap
│   └── src/lib/stores/       # Svelte stores for genetic data and reports
├── packages/
│   ├── parsers/              # Genetic file format parsers (JS)
│   ├── snp-db/               # Curated SNP reference database (257+ entries)
│   └── pgs/                  # Polygenic risk score calculator
├── src-tauri/                # Tauri 2 + Rust backend
│   └── src/
│       ├── parser.rs         # Native file parsers (23andMe, Ancestry, VCF, MyHeritage)
│       ├── snp_database.rs   # 155+ SNPs embedded in Rust
│       └── analyzer.rs       # Genotype analysis and risk assessment
├── scripts/                  # Database expansion tools
└── Dockerfile                # Web deployment (marketing site)
```

## SNP Database

Our database includes 257+ SNPs with real, accurate clinical data:

- **Longevity** — TERT, TERC, FOXO3, APOE, CETP, IL6, SOD2
- **Health** — 9p21 (CAD), TCF7L2 (T2D), Factor V Leiden, BRCA, HLA-DQ2
- **Pharmacogenomics** — CYP2D6, CYP2C19, CYP1A2, VKORC1, SLCO1B1, DPYD
- **Nutrigenomics** — MTHFR, MCM6 (lactose), ALDH2, FTO, VDR, HFE
- **Traits** — HERC2 (eye color), MC1R (red hair), ACTN3 (muscle), TAS2R38 (taste)
- **Carrier** — CFTR (cystic fibrosis), HBB (sickle cell), GJB2 (hearing)

Every entry includes risk/normal alleles, population frequencies, conditions, recommendations, and PubMed references.

### Expanding the Database

```bash
# Add more curated SNPs
node scripts/expand-snp-db.js
```

## Contributing

Contributions welcome! Some areas where help is needed:

- **More SNPs** — Add clinically validated SNPs with real data
- **Polygenic scores** — Bundle pre-downloaded PGS Catalog scoring files
- **Localization** — Translate reports and UI
- **Accessibility** — Screen reader support, keyboard navigation
- **Testing** — Unit tests for parsers and risk assessment

Please open an issue first for major changes.

## Medical Disclaimer

Telomere AI is for **educational and informational purposes only**. It is not a medical device and should not be used for diagnosis, treatment, or prevention of any disease. Having a risk allele does not mean you will develop a condition. Always consult with a qualified healthcare professional or genetic counselor for medical advice.

## Privacy

- Your genetic data is processed **entirely on your computer**
- The app **never connects to the internet**
- No accounts, no uploads, no analytics, no tracking
- Fully auditable — every line of code is in this repository

## License

MIT — see [LICENSE](LICENSE)

## Credits

Built by [Vaionex Corporation](https://vaionex.com).

SNP data sourced from:
- [ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/) (NCBI)
- [PharmGKB](https://www.pharmgkb.org/)
- [GWAS Catalog](https://www.ebi.ac.uk/gwas/)
- Peer-reviewed publications (PubMed references included per SNP)
