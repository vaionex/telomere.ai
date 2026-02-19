# Contributing to Telomere AI

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Install [Rust](https://rustup.rs/), [Node.js 22+](https://nodejs.org/), and [pnpm](https://pnpm.io/)
2. Install [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS
3. Clone and install:
   ```bash
   git clone https://github.com/vaionex/telomere.ai.git
   cd telomere.ai
   pnpm install
   ```
4. Run dev: `pnpm tauri:dev`

## Project Layout

- `apps/web/` — SvelteKit frontend (Svelte 5 with runes)
- `packages/parsers/` — Genetic file parsers (JS)
- `packages/snp-db/` — Curated SNP database
- `packages/pgs/` — Polygenic risk score calculator
- `src-tauri/` — Rust backend (Tauri 2)

## Adding SNPs

The most impactful contribution. Each SNP needs **real, accurate** data:

```js
{
  rsid: 'rs1234567',
  gene: 'GENE_NAME',
  chromosome: '1',
  position: 12345678,
  categories: ['health'],          // health, longevity, nutrition, pharma, traits, carrier
  significance: 'well-established', // well-established, moderate, preliminary
  riskAllele: 'A',
  normalAllele: 'G',
  trait: 'Human-readable trait name',
  riskDescription: 'What homozygous risk means',
  normalDescription: 'What homozygous normal means',
  heterozygousDescription: 'What one copy means',
  populationFrequency: { GG: 0.50, GA: 0.40, AA: 0.10 },
  conditions: ['Associated condition 1'],
  recommendations: ['Evidence-based recommendation'],
  references: ['PMID:12345678'],
}
```

**Requirements:**
- Use real data from ClinVar, PharmGKB, or peer-reviewed GWAS studies
- Include at least one PMID reference
- Population frequencies should be approximate global averages
- Recommendations must be evidence-based, not speculative

## Code Style

- **Svelte**: Svelte 5 runes (`$state`, `$derived`, `$props`)
- **CSS**: Tailwind CSS 4 with custom theme tokens in `app.css`
- **Rust**: Standard rustfmt formatting

## Pull Requests

1. Fork → branch → make changes
2. Verify build: `pnpm build` and `cargo check` (in `src-tauri/`)
3. Open PR with clear description
4. For SNP additions: include data sources

## Medical Data Standards

This is a health product. Accuracy matters more than quantity.

- **Never fabricate genetic data** — every SNP entry must be sourced
- **Don't overstate findings** — use hedging language for preliminary associations
- **Include disclaimers** — genetic risk is probabilistic, not deterministic
- **Cite everything** — PMID references are mandatory
