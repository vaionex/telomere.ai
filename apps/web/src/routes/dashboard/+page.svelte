<script>
  import { rawSnps, fileMetadata, isLoaded } from '$lib/stores/genetic-data.js';
  import { matchedSnps, reportsByCategory, topFindings, categoryMeta } from '$lib/stores/reports.js';
  import ChromosomeMap from '$lib/components/ChromosomeMap.svelte';
  import SnpCard from '$lib/components/SnpCard.svelte';

  const chromosomes = $derived(new Set([...$rawSnps.values()].map(s => s.chromosome)));
  const catList = ['health', 'longevity', 'nutrition', 'pharma', 'traits', 'carrier'];
</script>

<svelte:head>
  <title>Dashboard — Telomere AI</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  {#if !$isLoaded}
    <div class="text-center py-24">
      <span class="text-5xl mb-4 block">🧬</span>
      <h1 class="text-3xl font-bold mb-4">No Genetic Data Loaded</h1>
      <p class="text-text-secondary mb-8">Upload your raw genetic data to see your personalized dashboard.</p>
      <a href="/upload" class="btn-primary">Upload DNA Data</a>
    </div>
  {:else}
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Your Genetic <span class="gradient-text">Dashboard</span></h1>
      {#if $fileMetadata}
        <p class="text-text-secondary text-sm">
          <span class="font-mono text-accent-cyan">{$fileMetadata.totalSnps.toLocaleString()}</span> SNPs from
          <span class="font-mono">{$fileMetadata.fileName}</span>
          ({$fileMetadata.format}) • Build {$fileMetadata.buildVersion}
        </p>
      {/if}
    </div>

    <!-- Stats bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="card text-center">
        <div class="text-2xl font-bold gradient-text">{$rawSnps.size.toLocaleString()}</div>
        <div class="text-text-tertiary text-xs">Total SNPs</div>
      </div>
      <div class="card text-center">
        <div class="text-2xl font-bold gradient-text">{$matchedSnps.length}</div>
        <div class="text-text-tertiary text-xs">Matched Markers</div>
      </div>
      <div class="card text-center">
        <div class="text-2xl font-bold gradient-text">{chromosomes.size}</div>
        <div class="text-text-tertiary text-xs">Chromosomes</div>
      </div>
      <div class="card text-center">
        <div class="text-2xl font-bold gradient-text">{Math.round(($matchedSnps.length / 100) * 100)}%</div>
        <div class="text-text-tertiary text-xs">Database Coverage</div>
      </div>
    </div>

    <!-- Chromosome map -->
    <div class="card mb-8">
      <h2 class="font-semibold mb-4">Chromosome Coverage</h2>
      <ChromosomeMap {chromosomes} />
    </div>

    <!-- Report categories -->
    <h2 class="text-xl font-bold mb-4">Reports</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
      {#each catList as cat}
        {@const meta = categoryMeta[cat]}
        {@const findings = $reportsByCategory[cat] || []}
        {@const highRisk = findings.filter(f => f.riskLevel === 'high').length}
        <a href="/report/{cat}" class="card group flex items-start gap-4">
          <span class="text-3xl">{meta.icon}</span>
          <div class="flex-1">
            <h3 class="font-semibold group-hover:text-accent-cyan transition-colors">{meta.title}</h3>
            <p class="text-text-tertiary text-xs mt-1">{findings.length} findings</p>
            {#if highRisk > 0}
              <span class="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-accent-red/10 text-accent-red">{highRisk} high risk</span>
            {/if}
          </div>
          <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      {/each}
    </div>

    <!-- Top findings -->
    {#if $topFindings.length > 0}
      <h2 class="text-xl font-bold mb-4">Top Findings</h2>
      <div class="space-y-3">
        {#each $topFindings as snp (snp.rsid)}
          <SnpCard {snp} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
