<script>
  import { goto } from '$app/navigation';
  import { isLoaded, rawSnps } from '$lib/stores/genetic-data.js';
  import { matchedSnps, reportsByCategory, categoryMeta } from '$lib/stores/reports.js';
  import { get } from 'svelte/store';

  let loaded = $state(false);
  let snpCount = $state(0);
  let matched = $state([]);
  let byCat = $state({});

  $effect(() => {
    const l = get(isLoaded);
    if (!l) { goto('/upload'); return; }
    loaded = true;
    snpCount = get(rawSnps).size;
    matched = get(matchedSnps);
    byCat = get(reportsByCategory);
  });

  const riskCount = $derived(matched.filter(s => s.riskLevel === 'high' || s.riskLevel === 'moderate').length);
  const categories = ['health', 'longevity', 'nutrition', 'pharma', 'traits', 'carrier'];

  const catIcons = {
    health: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    longevity: 'M13 10V3L4 14h7v7l9-11h-7z',
    nutrition: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z',
    pharma: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    traits: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    carrier: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  };
</script>

<svelte:head>
  <title>Dashboard — Telomere.ai</title>
</svelte:head>

{#if loaded}
<section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
  <!-- Header -->
  <div class="flex items-center justify-between flex-wrap gap-4">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-text-primary">Your Results</h1>
      <div class="flex items-center gap-2 mt-1">
        <svg class="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        <span class="text-xs text-accent-green font-medium">Processed locally in your browser</span>
      </div>
    </div>
    <a href="/explore" class="btn-primary text-sm !py-2 !px-4">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      Explore All SNPs
    </a>
  </div>

  <!-- Summary cards -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="card text-center">
      <p class="text-2xl font-bold gradient-text">{snpCount.toLocaleString()}</p>
      <p class="text-xs text-text-tertiary mt-1">Variants Analyzed</p>
    </div>
    <div class="card text-center">
      <p class="text-2xl font-bold text-accent-blue">{matched.length}</p>
      <p class="text-xs text-text-tertiary mt-1">SNPs Matched</p>
    </div>
    <div class="card text-center">
      <p class="text-2xl font-bold text-accent-amber">{riskCount}</p>
      <p class="text-xs text-text-tertiary mt-1">Risk Factors</p>
    </div>
    <div class="card text-center">
      <p class="text-2xl font-bold text-accent-violet">{Object.keys(byCat).length}</p>
      <p class="text-xs text-text-tertiary mt-1">Categories</p>
    </div>
  </div>

  <!-- Category cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each categories as cat}
      {@const meta = categoryMeta[cat]}
      {@const findings = byCat[cat] || []}
      <a href="/report/{cat}" class="card group flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-{meta.color}/10 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-{meta.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={catIcons[cat]}/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-sm group-hover:text-accent-blue transition-colors">{meta.title}</h3>
            <p class="text-xs text-text-tertiary">{findings.length} finding{findings.length !== 1 ? 's' : ''}</p>
          </div>
          <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        <p class="text-xs text-text-secondary leading-relaxed">{meta.description}</p>
      </a>
    {/each}
  </div>
</section>
{/if}
