<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import { traitResults } from '$lib/stores/reports.js';
  import { generateSummary } from '$lib/utils/traits.js';
  import { activeSection } from '$lib/stores/navigation.js';
  import { get } from 'svelte/store';

  let trait = $state(null);
  let expandedSnp = $state(null);
  let traitDescriptionData = $state(null);

  const riskColors = { high: 'text-red-600', moderate: 'text-amber-600', low: 'text-green-600', carrier: 'text-blue-600', normal: 'text-green-600' };
  const riskBgColors = { high: 'bg-red-50 border-red-200', moderate: 'bg-amber-50 border-amber-200', low: 'bg-green-50 border-green-200', carrier: 'bg-blue-50 border-blue-200', normal: 'bg-green-50 border-green-200' };
  const riskDotColors = { high: 'bg-red-500', moderate: 'bg-amber-500', low: 'bg-green-500', carrier: 'bg-blue-500', normal: 'bg-green-500' };
  const riskLabels = { high: 'Elevated Risk', moderate: 'Slightly Elevated', low: 'Typical', carrier: 'Carrier', normal: 'Typical' };
  const riskBadgeBg = { high: 'bg-red-100 text-red-700', moderate: 'bg-amber-100 text-amber-700', low: 'bg-green-100 text-green-700', carrier: 'bg-blue-100 text-blue-700', normal: 'bg-green-100 text-green-700' };

  // One-time data load from stores (cached, instant)
  if (!get(isLoaded) && typeof window !== 'undefined') {
    goto('/upload');
  } else {
    const id = get(page).params.id;
    const traits = get(traitResults);
    trait = traits.find(t => t.id === id) || null;
    if (!trait && typeof window !== 'undefined') goto('/analysis');
    if (trait && trait.categories?.length > 0) activeSection.set(trait.categories[0]);
  }

  // Lazy-load trait descriptions (2MB file) only when needed
  if (trait && typeof window !== 'undefined') {
    import('$lib/data/trait-descriptions.js').then(mod => {
      traitDescriptionData = mod.getTraitDescription(trait.id);
    });
  }

  let traitDescription = $derived(traitDescriptionData);

  function toggleSnp(rsid) {
    expandedSnp = expandedSnp === rsid ? null : rsid;
  }

  function getSnpDescription(snp) {
    if (snp.riskLevel === 'high') return snp.riskDescription;
    if (snp.riskLevel === 'moderate') return snp.heterozygousDescription || snp.riskDescription;
    return snp.normalDescription;
  }

  function buildExplanation(t) {
    if (!t) return '';
    const descriptions = t.snps
      .filter(s => s.riskLevel === 'high' || s.riskLevel === 'moderate')
      .sort((a, b) => (b.riskPercent || 0) - (a.riskPercent || 0))
      .map(s => {
        const desc = s.riskLevel === 'high' ? s.riskDescription : (s.heterozygousDescription || s.riskDescription);
        return desc;
      })
      .filter(Boolean);

    if (descriptions.length === 0) {
      const normalDescs = t.snps.map(s => s.normalDescription).filter(Boolean);
      return normalDescs.slice(0, 3).join(' ');
    }
    return descriptions.slice(0, 3).join(' ');
  }

  function getGeneDescription(gene, t) {
    if (!t) return '';
    const geneSnps = t.snps.filter(s => s.gene === gene);
    const descs = geneSnps.map(s => s.trait).filter(Boolean);
    return descs.length > 0 ? `Associated with: ${[...new Set(descs)].join(', ')}` : '';
  }
</script>

<svelte:head>
  <title>{trait?.name || 'Trait'} — Telomere.ai</title>
  <meta name="robots" content="noindex" />
</svelte:head>

{#if trait}
<section class="max-w-3xl mx-auto px-4 py-8">
  <!-- Back button -->
  <a href="/analysis" class="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    Back to Analysis
  </a>

  <!-- Header -->
  <div class="mt-6 mb-8">
    <div class="flex items-start justify-between gap-4">
      <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">{trait.name}</h1>
      <span class="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 {riskBadgeBg[trait.riskLevel] || 'bg-gray-100 text-gray-700'}">{riskLabels[trait.riskLevel] || trait.riskLevel}</span>
    </div>
    <p class="text-[var(--color-text-tertiary)] text-sm mt-1">{trait.snpCount} variant{trait.snpCount !== 1 ? 's' : ''} analyzed across {trait.genes.length} gene{trait.genes.length !== 1 ? 's' : ''}</p>
  </div>

  <!-- Your Result summary box -->
  <div class="rounded-xl border p-6 mb-8 {riskBgColors[trait.riskLevel] || 'bg-gray-50 border-gray-200'}">
    <h2 class="font-semibold text-[var(--color-text-primary)] mb-2">Your Result</h2>
    <p class="text-sm leading-relaxed text-[var(--color-text-secondary)]">{generateSummary(trait)}</p>
  </div>

  <!-- What This Means -->
  <div class="mb-8">
    <h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">What This Means</h2>
    <div class="text-sm text-[var(--color-text-secondary)] space-y-3 leading-relaxed">
      <p>{buildExplanation(trait)}</p>
      {#if trait.description}
        <p>{trait.description}</p>
      {/if}
    </div>
  </div>

  <!-- Rich Description -->
  {#if traitDescription}
    <div class="mb-8">
      <div class="prose prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed
        [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[var(--color-text-primary)] [&_h2]:mt-6 [&_h2]:mb-3
        [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-[var(--color-text-primary)] [&_h3]:mt-4 [&_h3]:mb-2
        [&_p]:mb-3 [&_p]:text-sm
        [&_strong]:text-[var(--color-text-primary)]
        [&_a]:text-[var(--color-accent-blue)] [&_a]:no-underline hover:[&_a]:underline
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:text-sm
        [&_li]:mb-1">
        {@html traitDescription.details.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>').replace(/^###\s+(.+)$/gm, '<h3>$1</h3>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\n\n/g, '</p><p>').replace(/^(.)/,'<p>$1').replace(/(.)$/,'$1</p>')}
      </div>

      {#if traitDescription.relatedLinks?.length > 0}
        <div class="mt-6 pt-4 border-t border-black/5">
          <p class="text-xs font-semibold text-[var(--color-text-tertiary)] mb-2">Related Resources</p>
          <div class="flex flex-wrap gap-2">
            {#each traitDescription.relatedLinks as link}
              <a href={link.url} target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs text-[var(--color-accent-blue)] hover:underline px-2.5 py-1.5 rounded-md border border-black/5 hover:border-blue-200 transition-colors">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                {link.text}
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Contributing Variants -->
  <div class="mb-8">
    <h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Contributing Variants</h2>
    <div class="border border-black/5 rounded-lg overflow-hidden">
      {#each trait.snps as snp}
        <button onclick={() => toggleSnp(snp.rsid)} class="w-full text-left border-b border-black/5 last:border-0">
          <div class="flex items-center gap-3 py-3 px-4 hover:bg-black/[0.02] transition-colors">
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 {riskDotColors[snp.riskLevel] || 'bg-gray-400'}"></span>
            <span class="font-mono text-xs text-[var(--color-accent-blue)] w-24 flex-shrink-0">{snp.rsid}</span>
            <span class="text-sm text-[var(--color-text-primary)] w-20 flex-shrink-0">{snp.gene}</span>
            <span class="flex-1 text-sm text-[var(--color-text-secondary)] truncate">{snp.trait}</span>
            <span class="font-mono text-sm text-[var(--color-text-secondary)] flex-shrink-0">{snp.userGenotype}</span>
            <span class="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 {snp.riskLevel === 'high' ? 'text-red-600 bg-red-50' : snp.riskLevel === 'moderate' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'}">{snp.riskLevel}</span>
            <svg class="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0 transition-transform {expandedSnp === snp.rsid ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
        {#if expandedSnp === snp.rsid}
          <div class="pl-10 pr-4 pb-4 space-y-3 border-b border-black/5 bg-black/[0.01]">
            {#if getSnpDescription(snp)}
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">{getSnpDescription(snp)}</p>
            {/if}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {#if snp.chromosome}<div><span class="text-[var(--color-text-tertiary)]">Chromosome</span><p class="font-medium text-[var(--color-text-primary)]">{snp.chromosome}</p></div>{/if}
              {#if snp.position}<div><span class="text-[var(--color-text-tertiary)]">Position</span><p class="font-mono text-[var(--color-text-primary)]">{snp.position}</p></div>{/if}
              {#if snp.riskAllele}<div><span class="text-[var(--color-text-tertiary)]">Risk Allele</span><p class="font-medium text-red-600">{snp.riskAllele}</p></div>{/if}
              {#if snp.normalAllele}<div><span class="text-[var(--color-text-tertiary)]">Normal Allele</span><p class="font-medium text-green-600">{snp.normalAllele}</p></div>{/if}
              {#if snp.significance}<div><span class="text-[var(--color-text-tertiary)]">Significance</span><p class="font-medium text-[var(--color-text-primary)]">{snp.significance}</p></div>{/if}
            </div>
            {#if snp.populationFrequencies}
              <div class="space-y-1.5">
                <span class="text-xs font-medium text-[var(--color-text-tertiary)]">Population Frequency</span>
                {#each Object.entries(snp.populationFrequencies) as [pop, freq]}
                  <div class="flex items-center gap-2 text-xs">
                    <span class="w-16 text-[var(--color-text-tertiary)] truncate">{pop}</span>
                    <div class="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                      <div class="h-full rounded-full bg-blue-400" style="width: {Math.min(freq * 100, 100)}%"></div>
                    </div>
                    <span class="text-[var(--color-text-secondary)] w-10 text-right">{(freq * 100).toFixed(1)}%</span>
                  </div>
                {/each}
              </div>
            {/if}
            <div class="flex gap-3 pt-1">
              {#if snp.rsid?.startsWith('rs')}
                <a href="https://www.ncbi.nlm.nih.gov/snp/{snp.rsid}" target="_blank" rel="noopener" class="text-[11px] text-[var(--color-accent-blue)] hover:underline flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  dbSNP
                </a>
                <a href="https://www.snpedia.com/index.php/{snp.rsid}" target="_blank" rel="noopener" class="text-[11px] text-[var(--color-accent-blue)] hover:underline flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  SNPedia
                </a>
                <a href="https://www.ncbi.nlm.nih.gov/clinvar/?term={snp.rsid}" target="_blank" rel="noopener" class="text-[11px] text-[var(--color-accent-blue)] hover:underline flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  ClinVar
                </a>
              {/if}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Genes Involved -->
  <div class="mb-8">
    <h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Genes Involved</h2>
    {#each trait.genes as gene}
      <div class="py-3 border-b border-black/5">
        <h3 class="font-medium text-[var(--color-text-primary)]">{gene}</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">{getGeneDescription(gene, trait)}</p>
      </div>
    {/each}
  </div>
</section>
{/if}
