<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import { reportsByCategory, categoryMeta } from '$lib/stores/reports.js';
  import { lookupSnp, getByGene } from '@telomere/snp-db';
  import { get } from 'svelte/store';

  let category = $derived($page.params.category);
  let meta = $derived(categoryMeta[category]);
  let loaded = $state(false);
  let findings = $state([]);
  let selected = $state(null); // the currently expanded SNP

  $effect(() => {
    if (!get(isLoaded)) { goto('/upload'); return; }
    loaded = true;
    const byCat = get(reportsByCategory);
    findings = [...(byCat[category] || [])].sort((a, b) => b.riskPercent - a.riskPercent);
  });

  function select(snp) {
    selected = snp;
    // Scroll to top of detail view
    setTimeout(() => document.getElementById('detail-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function back() {
    selected = null;
  }

  function riskColor(level) {
    return { high: 'text-red-600', moderate: 'text-amber-600', carrier: 'text-blue-600', low: 'text-green-600' }[level] || 'text-green-600';
  }
  function riskBg(level) {
    return { high: 'bg-red-50', moderate: 'bg-amber-50', carrier: 'bg-blue-50', low: 'bg-green-50' }[level] || 'bg-green-50';
  }
  function riskBorder(level) {
    return { high: 'border-red-200', moderate: 'border-amber-200', carrier: 'border-blue-200', low: 'border-green-200' }[level] || 'border-green-200';
  }
  function riskLabel(level) {
    return { high: 'Increased risk', moderate: 'Slightly increased', carrier: 'Carrier', low: 'Typical' }[level] || 'Typical';
  }
  function riskDot(level) {
    return { high: 'bg-red-500', moderate: 'bg-amber-500', carrier: 'bg-blue-500', low: 'bg-green-500' }[level] || 'bg-green-500';
  }
</script>

<svelte:head>
  <title>{meta?.title || 'Report'} — Genetic Report | Telomere.ai</title>
  {#if meta}
    <meta name="description" content="{meta.title}: {meta.description}. Personalized genetic analysis at Telomere.ai." />
  {/if}
  <meta name="robots" content="noindex" />
</svelte:head>

{#if loaded && meta}
<section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

  {#if selected}
    <!-- ═══════════════ DETAIL VIEW ═══════════════ -->
    <div id="detail-top" class="space-y-6">
      <!-- Back button -->
      <button onclick={back} class="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to {meta.title}
      </button>

      <!-- Title + risk status -->
      <div class="space-y-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-text-primary leading-tight">{selected.trait}</h1>
          <p class="text-sm text-text-tertiary mt-1">{selected.gene} · {selected.rsid}</p>
        </div>

        <!-- Your result box -->
        <div class="rounded-xl border {riskBorder(selected.riskLevel)} {riskBg(selected.riskLevel)} p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium uppercase tracking-wide {riskColor(selected.riskLevel)}">Your result</span>
            <span class="font-mono text-lg font-bold {riskColor(selected.riskLevel)}">{selected.userGenotype}</span>
          </div>
          <p class="font-semibold {riskColor(selected.riskLevel)} mb-2">{riskLabel(selected.riskLevel)}</p>
          <p class="text-sm text-text-primary leading-relaxed">
            {#if selected.riskLevel === 'high'}
              {selected.riskDescription}
            {:else if selected.riskLevel === 'moderate' || selected.riskLevel === 'carrier'}
              {selected.heterozygousDescription || selected.riskDescription}
            {:else}
              {selected.normalDescription}
            {/if}
          </p>
        </div>
      </div>

      <!-- What this means -->
      <div class="space-y-3">
        <h2 class="text-base font-semibold text-text-primary">What this means</h2>
        <div class="text-sm text-text-secondary leading-relaxed space-y-3">
          <p>{selected.riskDescription}</p>
          {#if selected.heterozygousDescription && selected.riskLevel !== 'low'}
            <p><strong>If you carry one copy:</strong> {selected.heterozygousDescription}</p>
          {/if}
          {#if selected.normalDescription && selected.riskLevel !== 'low'}
            <p><strong>Typical result:</strong> {selected.normalDescription}</p>
          {/if}
        </div>
      </div>

      <!-- Variant details -->
      <div class="space-y-3">
        <h2 class="text-base font-semibold text-text-primary">Variant details</h2>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="py-3 border-b border-black/5">
            <p class="text-text-tertiary text-xs">Gene</p>
            <p class="font-medium mt-0.5">{selected.gene}</p>
          </div>
          <div class="py-3 border-b border-black/5">
            <p class="text-text-tertiary text-xs">Variant</p>
            <p class="font-mono font-medium mt-0.5">{selected.rsid}</p>
          </div>
          <div class="py-3 border-b border-black/5">
            <p class="text-text-tertiary text-xs">Chromosome</p>
            <p class="font-mono font-medium mt-0.5">{selected.chromosome}</p>
          </div>
          <div class="py-3 border-b border-black/5">
            <p class="text-text-tertiary text-xs">Position</p>
            <p class="font-mono font-medium mt-0.5">{selected.position?.toLocaleString() || '—'}</p>
          </div>
          <div class="py-3 border-b border-black/5">
            <p class="text-text-tertiary text-xs">Risk allele</p>
            <p class="font-mono font-medium mt-0.5 text-red-600">{selected.riskAllele}</p>
          </div>
          <div class="py-3 border-b border-black/5">
            <p class="text-text-tertiary text-xs">Normal allele</p>
            <p class="font-mono font-medium mt-0.5 text-green-600">{selected.normalAllele}</p>
          </div>
          <div class="py-3">
            <p class="text-text-tertiary text-xs">Clinical significance</p>
            <p class="font-medium mt-0.5 capitalize">{selected.significance || '—'}</p>
          </div>
          <div class="py-3">
            <p class="text-text-tertiary text-xs">Categories</p>
            <div class="flex flex-wrap gap-1 mt-0.5">
              {#each selected.categories || [] as cat}
                <span class="px-2 py-0.5 rounded-full text-xs bg-black/5 text-text-secondary">{cat}</span>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Associated conditions -->
      {#if selected.conditions?.length}
        <div class="space-y-3">
          <h2 class="text-base font-semibold text-text-primary">Associated conditions</h2>
          <ul class="space-y-2">
            {#each selected.conditions as condition}
              <li class="flex items-start gap-2 text-sm text-text-secondary">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5"></span>
                {condition}
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Population frequency -->
      {#if selected.populationFrequency}
        <div class="space-y-3">
          <h2 class="text-base font-semibold text-text-primary">Population frequency</h2>
          <p class="text-xs text-text-tertiary">How common the risk allele is in different populations</p>
          <div class="space-y-2">
            {#each Object.entries(selected.populationFrequency) as [pop, freq]}
              <div class="flex items-center gap-3">
                <span class="text-xs text-text-secondary w-24 flex-shrink-0 text-right">{pop}</span>
                <div class="flex-1 h-3 bg-black/5 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" style="width: {Math.max(freq * 100, 1)}%"></div>
                </div>
                <span class="text-xs font-mono text-text-tertiary w-12">{(freq * 100).toFixed(1)}%</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Other variants in this gene -->
      {#if getByGene(selected.gene).filter(s => s.rsid !== selected.rsid).length > 0}
        {@const geneRelated = getByGene(selected.gene).filter(s => s.rsid !== selected.rsid)}
        <div class="space-y-3">
          <h2 class="text-base font-semibold text-text-primary">Other variants in {selected.gene}</h2>
          <div class="space-y-1">
            {#each geneRelated as rel}
              {@const inFindings = findings.find(f => f.rsid === rel.rsid)}
              <button
                onclick={() => { if (inFindings) select(inFindings); else goto(`/snp/${rel.rsid}`); }}
                class="w-full text-left flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-black/[0.02] transition-colors"
              >
                <span class="font-mono text-xs text-blue-600">{rel.rsid}</span>
                <span class="text-sm text-text-secondary flex-1 truncate">{rel.trait}</span>
                {#if inFindings}
                  <span class="w-2 h-2 rounded-full {riskDot(inFindings.riskLevel)}"></span>
                {/if}
                <svg class="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Research links -->
      <div class="space-y-3">
        <h2 class="text-base font-semibold text-text-primary">Learn more</h2>
        <div class="flex flex-wrap gap-2">
          {#each [
            { label: 'dbSNP', url: `https://www.ncbi.nlm.nih.gov/snp/${selected.rsid}` },
            { label: 'SNPedia', url: `https://www.snpedia.com/index.php/${selected.rsid}` },
            { label: 'ClinVar', url: `https://www.ncbi.nlm.nih.gov/clinvar/?term=${selected.rsid}` }
          ] as link}
            <a href={link.url} target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-black/10 text-sm text-text-secondary hover:text-blue-600 hover:border-blue-200 transition-colors">
              {link.label}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          {/each}
        </div>
      </div>

      <!-- Back to list -->
      <button onclick={back} class="w-full py-3 text-center text-sm text-text-secondary hover:text-text-primary border border-black/10 rounded-xl transition-colors">
        Back to all {meta.title.toLowerCase()}
      </button>
    </div>

  {:else}
    <!-- ═══════════════ LIST VIEW ═══════════════ -->
    <div class="space-y-1">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <a href="/dashboard" class="text-text-tertiary hover:text-text-primary transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </a>
        <div>
          <h1 class="text-xl font-bold text-text-primary">{meta.title}</h1>
          <p class="text-sm text-text-secondary">{findings.length} variant{findings.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {#if findings.length === 0}
        <div class="text-center py-16">
          <p class="text-text-secondary">No findings in this category for your genome.</p>
          <a href="/dashboard" class="text-blue-600 text-sm mt-3 inline-block hover:underline">Back to dashboard</a>
        </div>
      {:else}
        <!-- List items -->
        <div class="divide-y divide-black/5">
          {#each findings as snp (snp.rsid)}
            <button
              onclick={() => select(snp)}
              class="w-full text-left flex items-center gap-4 py-4 px-2 hover:bg-black/[0.02] rounded-lg transition-colors group"
            >
              <!-- Risk dot -->
              <span class="w-3 h-3 rounded-full flex-shrink-0 {riskDot(snp.riskLevel)}"></span>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-text-primary group-hover:text-blue-600 transition-colors">{snp.trait}</p>
                <p class="text-xs text-text-tertiary mt-0.5">{snp.gene} · {snp.rsid}</p>
              </div>

              <!-- Result badge -->
              <div class="text-right flex-shrink-0">
                <span class="text-xs font-medium {riskColor(snp.riskLevel)}">{riskLabel(snp.riskLevel)}</span>
                {#if snp.userGenotype}
                  <p class="text-xs font-mono text-text-tertiary mt-0.5">{snp.userGenotype}</p>
                {/if}
              </div>

              <!-- Chevron -->
              <svg class="w-4 h-4 text-text-tertiary group-hover:text-text-secondary flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

</section>
{/if}

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
