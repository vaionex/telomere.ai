<script>
  import { page } from '$app/stores';
  import { lookupSnp, getByGene, getByCategory } from '@telomere/snp-db';
  import { isLoaded, rawSnps } from '$lib/stores/genetic-data.js';
  import { matchedSnps } from '$lib/stores/reports.js';
  import { get } from 'svelte/store';
  import RiskGauge from '$lib/components/RiskGauge.svelte';

  let rsid = $derived($page.params.rsid);
  let snp = $derived(lookupSnp(rsid));
  let hasData = $state(false);
  let userMatch = $state(null);
  let relatedSnps = $derived(() => {
    if (!snp) return [];
    const byGene = getByGene(snp.gene).filter(s => s.rsid !== rsid);
    const byCat = snp.categories?.length
      ? getByCategory(snp.categories[0]).filter(s => s.rsid !== rsid && !byGene.some(g => g.rsid === s.rsid))
      : [];
    return [...byGene, ...byCat].slice(0, 6);
  });

  $effect(() => {
    hasData = get(isLoaded);
    if (hasData) {
      const matched = get(matchedSnps);
      userMatch = matched.find(m => m.rsid === rsid) || null;
    }
  });

  function riskColor(level) {
    if (level === 'high') return 'text-accent-red';
    if (level === 'moderate') return 'text-accent-amber';
    return 'text-accent-green';
  }
  function riskBg(level) {
    if (level === 'high') return 'bg-accent-red/10';
    if (level === 'moderate') return 'bg-accent-amber/10';
    return 'bg-accent-green/10';
  }
</script>

<svelte:head>
  <title>{rsid} — {snp?.gene || 'SNP'} — Telomere.ai</title>
</svelte:head>

<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
  <a href="/explore" class="inline-flex items-center gap-1 text-text-tertiary hover:text-text-primary text-sm transition-colors">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    Back to Explorer
  </a>

  {#if !snp}
    <div class="card text-center py-12">
      <p class="text-text-secondary">SNP <span class="font-mono">{rsid}</span> not found in database.</p>
    </div>
  {:else}
    <!-- Header -->
    <div class="card space-y-4">
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold font-mono text-accent-blue">{snp.rsid}</h1>
          <p class="text-lg text-text-secondary mt-1">{snp.gene} — {snp.trait}</p>
        </div>
        {#if userMatch}
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-xs text-text-tertiary">Your Genotype</p>
              <p class="text-2xl font-mono font-bold {riskColor(userMatch.riskLevel)}">{userMatch.userGenotype}</p>
              <p class="text-xs font-medium {riskColor(userMatch.riskLevel)}">{userMatch.riskLevel} risk</p>
            </div>
            <RiskGauge percent={userMatch.riskPercent} size={64} />
          </div>
        {/if}
      </div>

      {#if userMatch}
        <div class="rounded-xl p-4 {riskBg(userMatch.riskLevel)}">
          <p class="text-sm">
            {#if userMatch.riskLevel === 'high'}
              {snp.riskDescription}
            {:else if userMatch.riskLevel === 'moderate'}
              {snp.heterozygousDescription || snp.riskDescription}
            {:else}
              {snp.normalDescription}
            {/if}
          </p>
        </div>
      {/if}
    </div>

    <!-- Details grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div class="card">
        <p class="text-xs text-text-tertiary">Chromosome</p>
        <p class="font-mono font-semibold mt-1">{snp.chromosome}</p>
      </div>
      <div class="card">
        <p class="text-xs text-text-tertiary">Position</p>
        <p class="font-mono font-semibold mt-1">{snp.position?.toLocaleString() || '—'}</p>
      </div>
      <div class="card">
        <p class="text-xs text-text-tertiary">Significance</p>
        <p class="font-semibold mt-1 text-sm">{snp.significance || '—'}</p>
      </div>
      <div class="card">
        <p class="text-xs text-text-tertiary">Risk Allele</p>
        <p class="font-mono font-semibold mt-1 text-accent-red">{snp.riskAllele}</p>
      </div>
      <div class="card">
        <p class="text-xs text-text-tertiary">Normal Allele</p>
        <p class="font-mono font-semibold mt-1 text-accent-green">{snp.normalAllele}</p>
      </div>
      <div class="card">
        <p class="text-xs text-text-tertiary">Categories</p>
        <div class="flex flex-wrap gap-1 mt-1">
          {#each snp.categories || [] as cat}
            <span class="px-2 py-0.5 rounded-full text-xs glass">{cat}</span>
          {/each}
        </div>
      </div>
    </div>

    <!-- Conditions & Recommendations -->
    {#if snp.conditions?.length}
      <div class="card">
        <h3 class="font-semibold text-sm mb-3">Associated Conditions</h3>
        <ul class="space-y-1">
          {#each snp.conditions as condition}
            <li class="text-sm text-text-secondary flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-accent-amber flex-shrink-0"></span>
              {condition}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if snp.recommendations?.length}
      <div class="card">
        <h3 class="font-semibold text-sm mb-3">Recommendations</h3>
        <ul class="space-y-1">
          {#each snp.recommendations as rec}
            <li class="text-sm text-text-secondary flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0"></span>
              {rec}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <!-- Population frequency -->
    {#if snp.populationFrequency}
      <div class="card">
        <h3 class="font-semibold text-sm mb-3">Population Frequency</h3>
        <div class="flex gap-4">
          {#each Object.entries(snp.populationFrequency) as [genotype, freq]}
            <div class="text-center">
              <p class="font-mono text-sm font-bold">{genotype}</p>
              <div class="w-16 h-1.5 bg-black/5 rounded-full mt-1 overflow-hidden">
                <div class="h-full bg-accent-blue rounded-full" style="width: {freq * 100}%"></div>
              </div>
              <p class="text-xs text-text-tertiary mt-1">{(freq * 100).toFixed(0)}%</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- References -->
    {#if snp.references?.length}
      <div class="card">
        <h3 class="font-semibold text-sm mb-3">References</h3>
        <div class="flex flex-wrap gap-2">
          {#each snp.references as ref}
            {#if ref.startsWith('PMID:')}
              <a href="https://pubmed.ncbi.nlm.nih.gov/{ref.replace('PMID:', '')}" target="_blank" rel="noopener" class="text-xs text-accent-blue hover:underline font-mono">{ref}</a>
            {:else}
              <span class="text-xs text-text-secondary font-mono">{ref}</span>
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    <!-- Related SNPs -->
    {#if relatedSnps().length > 0}
      <div>
        <h3 class="font-semibold text-sm mb-3">Related SNPs</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each relatedSnps() as rel (rel.rsid)}
            <a href="/snp/{rel.rsid}" class="card group">
              <div class="flex items-center gap-2">
                <span class="font-mono text-accent-blue text-sm">{rel.rsid}</span>
                <span class="text-text-tertiary text-xs">{rel.gene}</span>
              </div>
              <p class="text-xs text-text-secondary mt-1 group-hover:text-text-primary transition-colors">{rel.trait}</p>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>
