<script>
  export const ssr = false;
  export const prerender = false;

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { isLoaded, rawSnps, genomes, activeGenome, setActiveGenome, activeGenomeIndex, removeGenome } from '$lib/stores/genetic-data.js';
  import { traitResults, matchedSnps, pgsResults, categoryMeta } from '$lib/stores/reports.js';
  import { filterTraitsByCategory } from '$lib/utils/traits.js';
  import { exportMatchedSnpsCsv, exportReport } from '$lib/utils/export.js';
  import { activeSection, searchQuery } from '$lib/stores/navigation.js';

  let loaded = $state(false);
  let genomesVal = $state([]);
  let activeGenomeIdx = $state(0);
  let genomeName = $state('');
  let traits = $state([]);
  let matched = $state([]);
  let pgs = $state([]);
  let currentActiveSection = $state('overview');
  let currentSearchQuery = $state('');
  let showAdvanced = $state(false);

  const unsubs = [];

  function syncFromStores() {
    loaded = get(isLoaded);
    if (!loaded) return;
    genomesVal = get(genomes);
    activeGenomeIdx = get(activeGenomeIndex);
    genomeName = get(activeGenome)?.name || '';
    traits = get(traitResults);
    matched = get(matchedSnps);
    pgs = get(pgsResults);
  }

  unsubs.push(rawSnps.subscribe(() => syncFromStores()));
  unsubs.push(activeGenomeIndex.subscribe(() => syncFromStores()));
  unsubs.push(activeSection.subscribe(v => { currentActiveSection = v; }));
  unsubs.push(searchQuery.subscribe(v => { currentSearchQuery = v; }));
  onDestroy(() => unsubs.forEach(u => u()));

  const sectionToCat = { health: 'health', pharma: 'pharma', nutrition: 'nutrition', traits: 'traits', longevity: 'longevity', carrier: 'carrier' };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'health', label: 'Health Risks', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'pharma', label: 'Pharmacogenomics', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'nutrition', label: 'Nutrigenomics', icon: 'M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 2.5-1 6.5a7 7 0 0 1-5 10Z' },
    { id: 'traits', label: 'Traits & Behavior', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'longevity', label: 'Longevity', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'carrier', label: 'Carrier Status', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'riskscores', label: 'Risk Scores', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  const advancedItems = [
    { id: 'chromosome', label: 'Chromosome View', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'allvariants', label: 'All Variants', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ];

  let traitCountByCategory = $derived.by(() => {
    const counts = {};
    for (const t of traits) {
      for (const cat of t.categories) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  });

  function handleNavClick(id) {
    activeSection.set(id);
    goto('/analysis');
  }

  function handleSearchInput(e) {
    searchQuery.set(e.target.value);
    if (get(page).url.pathname !== '/analysis') {
      goto('/analysis');
    }
  }

  function handleExportCsv() { exportMatchedSnpsCsv(matched, genomeName); }
  function handleExportReport() { exportReport(matched, pgs, genomeName); }
</script>

{#if loaded}
<div class="flex max-w-7xl mx-auto px-4 sm:px-6 gap-6" role="main">
  <aside class="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto py-4" aria-label="Analysis navigation">
    <!-- Genome switcher -->
    {#if genomesVal.length > 1}
      <div class="mb-4 pb-4 border-b border-black/5">
        <p class="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Genome</p>
        <div class="flex flex-col gap-1">
          {#each genomesVal as genome, i}
            <div class="group flex items-center gap-1">
              <button
                onclick={() => setActiveGenome(i)}
                class="flex-1 text-left px-2.5 py-1.5 rounded-md text-xs transition-colors truncate {i === activeGenomeIdx ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.03]'}"
              >{genome.name || `Genome ${i + 1}`}</button>
              <button
                onclick={() => { removeGenome(i); genomesVal = get(genomes); activeGenomeIdx = get(activeGenomeIndex); genomeName = get(activeGenome)?.name || ''; }}
                class="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 transition-all"
                title="Remove genome"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Trait summary -->
    <div class="mb-4 pb-4 border-b border-black/5">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Your Traits</p>
      <div class="grid grid-cols-3 gap-1.5">
        <div class="text-center px-1 py-2 rounded-md bg-red-50">
          <p class="text-sm font-bold text-red-700">{traits.filter(t => t.riskLevel === 'high').length}</p>
          <p class="text-[9px] text-red-600">Elevated</p>
        </div>
        <div class="text-center px-1 py-2 rounded-md bg-amber-50">
          <p class="text-sm font-bold text-amber-700">{traits.filter(t => t.riskLevel === 'moderate').length}</p>
          <p class="text-[9px] text-amber-600">Moderate</p>
        </div>
        <div class="text-center px-1 py-2 rounded-md bg-green-50">
          <p class="text-sm font-bold text-green-700">{traits.filter(t => t.riskLevel === 'low' || t.riskLevel === 'normal').length}</p>
          <p class="text-[9px] text-green-600">Typical</p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-4 pb-4 border-b border-black/5">
      <div class="relative">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          type="text"
          placeholder="Search traits, genes, or rsIDs..."
          aria-label="Search traits"
          value={currentSearchQuery}
          oninput={handleSearchInput}
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-black/10 bg-white focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 placeholder:text-[var(--color-text-tertiary)]"
        />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-0.5 flex-1" aria-label="Trait categories">
      {#each navItems as item}
        <button
          onclick={() => handleNavClick(item.id)}
          class="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors text-left group {currentActiveSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.03]'}"
        >
          <svg class="w-4 h-4 flex-shrink-0 {currentActiveSection === item.id ? 'text-blue-600' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{item.icon}"/></svg>
          <span class="flex-1 truncate">{item.label}</span>
          {#if sectionToCat[item.id] && traitCountByCategory[sectionToCat[item.id]]}
            <span class="text-[10px] px-1.5 py-0.5 rounded-full {currentActiveSection === item.id ? 'bg-blue-100 text-blue-700' : 'bg-black/[0.04] text-[var(--color-text-tertiary)]'}">{traitCountByCategory[sectionToCat[item.id]]}</span>
          {/if}
        </button>
      {/each}

      <!-- Advanced / Raw Data -->
      <div class="mt-2 pt-2 border-t border-black/5">
        <button onclick={() => showAdvanced = !showAdvanced} class="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors w-full text-left">
          <svg class="w-3.5 h-3.5 transition-transform {showAdvanced ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span>Raw Data</span>
        </button>
        {#if showAdvanced}
          {#each advancedItems as item}
            <button
              onclick={() => handleNavClick(item.id)}
              class="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors text-left group ml-2 {currentActiveSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.03]'}"
            >
              <svg class="w-4 h-4 flex-shrink-0 {currentActiveSection === item.id ? 'text-blue-600' : 'text-[var(--color-text-tertiary)]'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{item.icon}"/></svg>
              <span class="flex-1 truncate">{item.label}</span>
            </button>
          {/each}
        {/if}
      </div>
    </nav>

    <!-- Actions -->
    <div class="mt-4 pt-4 border-t border-black/5 flex flex-col gap-1.5">
      <a href="/compare" class="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-[var(--color-text-secondary)] hover:bg-black/[0.03] transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        Compare Genomes
      </a>
      <a href="/upload" class="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-[var(--color-text-secondary)] hover:bg-black/[0.03] transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Genome
      </a>
      <button onclick={handleExportCsv} class="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-[var(--color-text-secondary)] hover:bg-black/[0.03] transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        Export CSV
      </button>
      <button onclick={handleExportReport} class="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-[var(--color-text-secondary)] hover:bg-black/[0.03] transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Export Report
      </button>
    </div>
  </aside>

  <main class="flex-1 min-w-0 py-4 sm:py-6">
    <slot />
  </main>
</div>
{:else}
<slot />
{/if}
