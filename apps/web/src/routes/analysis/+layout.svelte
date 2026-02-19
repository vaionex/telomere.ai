<script>
  export const ssr = false;
  export const prerender = false;

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isLoaded, genomes, activeGenome, setActiveGenome, activeGenomeIndex, rawSnps } from '$lib/stores/genetic-data.js';
  import { matchedSnps, traitResults, categoryMeta } from '$lib/stores/reports.js';
  import { filterTraitsByCategory } from '$lib/utils/traits.js';
  import { get } from 'svelte/store';

  let loaded = $state(false);
  let genomesVal = $state([]);
  let genomeName = $state('');
  let activeGenomeIdx = $state(0);
  let matched = $state([]);
  let traits = $state([]);

  $effect(() => {
    if (!get(isLoaded)) { goto('/upload'); return; }
    loaded = true;
    genomesVal = get(genomes);
    activeGenomeIdx = get(activeGenomeIndex);
    matched = get(matchedSnps);
    traits = get(traitResults);
    const ag = get(activeGenome);
    genomeName = ag?.name || '';
  });

  let highCount = $derived(matched.filter(s => s.riskLevel === 'high').length);
  let modCount = $derived(matched.filter(s => s.riskLevel === 'moderate').length);
  let carrierCount = $derived(matched.filter(s => s.riskLevel === 'carrier').length);

  const sectionToCat = { health: 'health', pharma: 'pharma', nutrition: 'nutrition', traits: 'traits', longevity: 'longevity', carrier: 'carrier' };

  let traitCountByCategory = $derived.by(() => {
    const counts = {};
    for (const cat of Object.values(sectionToCat)) {
      counts[cat] = filterTraitsByCategory(traits, cat).length;
    }
    return counts;
  });

  // Detect which section is active based on URL or default
  let isDetailPage = $derived.by(() => {
    const path = get(page).url?.pathname || '';
    return path !== '/analysis' && path.startsWith('/analysis/');
  });

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'health', label: 'Health Risks', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'pharma', label: 'Pharmacogenomics', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'nutrition', label: 'Nutrigenomics', icon: 'M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 2.5-1 6.5a7 7 0 0 1-5 10Z' },
    { id: 'traits', label: 'Traits', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'longevity', label: 'Longevity', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'carrier', label: 'Carrier Status', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'riskscores', label: 'Risk Scores', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'chromosome', label: 'Chromosome View', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'allvariants', label: 'All Variants', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ];

  function navTo(sectionId) {
    goto(`/analysis?section=${sectionId}`);
  }
</script>

{#if loaded}
<div class="fixed inset-0 top-16 flex bg-[var(--color-bg-primary)]">
  <!-- LEFT SIDEBAR (desktop) -->
  <aside class="hidden lg:flex flex-col w-60 bg-white border-r border-black/5 overflow-y-auto flex-shrink-0">
    <div class="p-4 border-b border-black/5">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: {genomesVal[activeGenomeIdx]?.color || '#3B82F6'}"></span>
        <span class="text-sm font-semibold text-[var(--color-text-primary)] truncate">{genomeName || 'Genome'}</span>
        {#if genomesVal.length > 1}
          <select class="ml-auto text-xs bg-transparent border border-black/10 rounded px-1 py-0.5 text-[var(--color-text-secondary)]" onchange={(e) => setActiveGenome(Number(e.target.value))}>
            {#each genomesVal as g, i}
              <option value={i} selected={i === activeGenomeIdx}>{g.name}</option>
            {/each}
          </select>
        {/if}
      </div>
      <div class="flex items-center gap-3 mt-3 text-xs">
        {#if highCount > 0}<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span><span class="text-red-600 font-medium">{highCount}</span></span>{/if}
        {#if modCount > 0}<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span><span class="text-amber-600 font-medium">{modCount}</span></span>{/if}
        {#if carrierCount > 0}<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span><span class="text-blue-600 font-medium">{carrierCount}</span></span>{/if}
      </div>
    </div>

    <nav class="flex-1 px-2 py-2">
      {#each navItems as item}
        <button
          onclick={() => navTo(item.id)}
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-[var(--color-text-secondary)] hover:bg-black/[0.02]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}/></svg>
          <span class="truncate">{item.label}</span>
          {#if sectionToCat[item.id] && traitCountByCategory[sectionToCat[item.id]] != null}
            <span class="ml-auto text-[10px] text-[var(--color-text-tertiary)]">{traitCountByCategory[sectionToCat[item.id]]}</span>
          {/if}
        </button>
      {/each}
    </nav>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="flex-1 overflow-y-auto">
    <slot />
  </main>
</div>
{/if}
