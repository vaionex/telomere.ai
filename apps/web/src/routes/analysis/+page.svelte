<script>
  export const ssr = false;
  export const prerender = false;

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { isLoaded, rawSnps, genomes, activeGenome, setActiveGenome, activeGenomeIndex } from '$lib/stores/genetic-data.js';
  import { matchedSnps, reportsByCategory, categoryMeta, pgsResults, categoryRiskSummary, topFindings, traitResults } from '$lib/stores/reports.js';
  import { filterTraitsByCategory } from '$lib/utils/traits.js';
  import { exportMatchedSnpsCsv, exportReport } from '$lib/utils/export.js';
  import { get } from 'svelte/store';

  // UI state (reactive)
  let activeSection = $state('overview');
  let searchQuery = $state('');
  let riskFilter = $state('all');
  let sortField = $state('risk');
  let sortDir = $state('desc');
  let expandedChromosomes = $state(new Set());

  // Store-backed state — subscribe so genome switching works
  let loaded = $state(false);
  let snpCount = $state(0);
  let matched = $state([]);
  let byCat = $state({});
  let pgs = $state([]);
  let genomesVal = $state([]);
  let riskSummary = $state({});
  let genomeName = $state('');
  let topFindingsVal = $state([]);
  let activeGenomeIdx = $state(0);
  let traits = $state([]);

  // Single subscription that batches all store reads — no infinite loops
  // because we subscribe to Svelte 4 stores via .subscribe(), not via $effect
  const unsubs = [];
  function syncFromStores() {
    loaded = get(isLoaded);
    if (!loaded) return;
    snpCount = get(rawSnps).size;
    matched = get(matchedSnps);
    byCat = get(reportsByCategory);
    pgs = get(pgsResults);
    genomesVal = get(genomes);
    riskSummary = get(categoryRiskSummary);
    topFindingsVal = get(topFindings);
    activeGenomeIdx = get(activeGenomeIndex);
    traits = get(traitResults);
    genomeName = get(activeGenome)?.name || '';
  }
  // Subscribe to the root reactive source — when genome changes, rawSnps changes, everything cascades
  unsubs.push(rawSnps.subscribe(() => syncFromStores()));
  unsubs.push(activeGenomeIndex.subscribe(() => syncFromStores()));
  onDestroy(() => unsubs.forEach(u => u()));

  // Redirect if no data
  if (!get(isLoaded) && typeof window !== 'undefined') {
    goto('/upload');
  }

  // Read section from URL params
  const initParams = get(page).url?.searchParams;
  if (initParams?.get('section')) {
    activeSection = initParams.get('section');
  }

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

  let showAdvanced = $state(false);
  const advancedItems = [
    { id: 'chromosome', label: 'Chromosome View', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'allvariants', label: 'All Variants', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ];

  const riskColors = { high: 'text-red-600 bg-red-50', moderate: 'text-amber-600 bg-amber-50', low: 'text-green-600 bg-green-50', carrier: 'text-blue-600 bg-blue-50', normal: 'text-green-600 bg-green-50' };
  const riskDotColors = { high: 'bg-red-500', moderate: 'bg-amber-500', low: 'bg-green-500', carrier: 'bg-blue-500', normal: 'bg-green-500' };
  const riskCircleBg = { high: 'bg-red-100', moderate: 'bg-amber-100', low: 'bg-green-100', carrier: 'bg-blue-100', normal: 'bg-green-100' };
  const riskCircleText = { high: 'text-red-700', moderate: 'text-amber-700', low: 'text-green-700', carrier: 'text-blue-700', normal: 'text-green-700' };
  const riskLabelText = { high: 'Elevated', moderate: 'Moderate', low: 'Typical', carrier: 'Carrier', normal: 'Typical' };

  // All derived values now properly track $state variables
  let highCount = $derived(matched.filter(s => s.riskLevel === 'high').length);
  let modCount = $derived(matched.filter(s => s.riskLevel === 'moderate').length);
  let carrierCount = $derived(matched.filter(s => s.riskLevel === 'carrier').length);

  // Pre-compute all category counts in one pass
  let traitCountByCategory = $derived.by(() => {
    const counts = {};
    for (const t of traits) {
      for (const cat of t.categories) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  });

  // Current category traits
  let currentCategoryTraits = $derived.by(() => {
    const cat = sectionToCat[activeSection];
    if (!cat) return [];
    let items = filterTraitsByCategory(traits, cat);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(t => t.name?.toLowerCase().includes(q) || t.genes?.some(g => g.toLowerCase().includes(q)));
    }
    if (riskFilter !== 'all') items = items.filter(t => t.riskLevel === riskFilter);
    return items;
  });

  // Map rsid → first matching trait id for linking
  let snpToTraitId = $derived.by(() => {
    const map = {};
    for (const t of traits) {
      for (const s of (t.snps || [])) {
        if (!map[s.rsid]) map[s.rsid] = t.id;
      }
    }
    return map;
  });

  // All variants for the table view
  let allVariants = $derived.by(() => {
    let items = [...matched];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(s => s.rsid?.toLowerCase().includes(q) || s.gene?.toLowerCase().includes(q) || s.trait?.toLowerCase().includes(q));
    }
    if (riskFilter !== 'all') items = items.filter(s => s.riskLevel === riskFilter);
    items.sort((a, b) => {
      let av, bv;
      if (sortField === 'risk') { av = a.riskPercent || 0; bv = b.riskPercent || 0; }
      else if (sortField === 'gene') { av = a.gene || ''; bv = b.gene || ''; }
      else if (sortField === 'chromosome') { av = parseInt(a.chromosome) || 99; bv = parseInt(b.chromosome) || 99; }
      else { av = a[sortField] || ''; bv = b[sortField] || ''; }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return items;
  });

  let chromosomeGroups = $derived.by(() => {
    const groups = {};
    for (const snp of matched) {
      const chr = snp.chromosome || 'Unknown';
      if (!groups[chr]) groups[chr] = [];
      groups[chr].push(snp);
    }
    const ordered = [];
    for (let i = 1; i <= 22; i++) { if (groups[String(i)]) ordered.push({ chr: String(i), snps: groups[String(i)] }); }
    if (groups['X']) ordered.push({ chr: 'X', snps: groups['X'] });
    if (groups['Y']) ordered.push({ chr: 'Y', snps: groups['Y'] });
    return ordered;
  });

  function toggleSort(field) {
    if (sortField === field) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortField = field; sortDir = 'desc'; }
  }

  function toggleChromosome(chr) {
    const next = new Set(expandedChromosomes);
    if (next.has(chr)) next.delete(chr); else next.add(chr);
    expandedChromosomes = next;
  }

  function handleExportCsv() { exportMatchedSnpsCsv(matched, genomeName); }
  function handleExportReport() { exportReport(matched, pgs, genomeName); }

  const categories = ['health', 'longevity', 'nutrition', 'pharma', 'traits', 'carrier'];
</script>

<svelte:head>
  <title>Analysis — Telomere.ai</title>
  <meta name="robots" content="noindex" />
</svelte:head>

{#if loaded}
<div class="flex max-w-7xl mx-auto px-4 sm:px-6 gap-6">
  <!-- LEFT SIDEBAR -->
  <aside class="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto py-4">
    <!-- Genome switcher -->
    {#if genomesVal.length > 1}
      <div class="mb-4 pb-4 border-b border-black/5">
        <p class="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">Genome</p>
        <div class="flex flex-col gap-1">
          {#each genomesVal as genome, i}
            <button
              onclick={() => setActiveGenome(i)}
              class="text-left px-2.5 py-1.5 rounded-md text-xs transition-colors truncate {i === activeGenomeIdx ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.03]'}"
            >{genome.name || `Genome ${i + 1}`}</button>
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
          placeholder="Search..."
          bind:value={searchQuery}
          class="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-black/10 bg-white focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 placeholder:text-[var(--color-text-tertiary)]"
        />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-0.5 flex-1">
      {#each navItems as item}
        <button
          onclick={() => { activeSection = item.id; riskFilter = 'all'; }}
          class="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors text-left group {activeSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.03]'}"
        >
          <svg class="w-4 h-4 flex-shrink-0 {activeSection === item.id ? 'text-blue-600' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{item.icon}"/></svg>
          <span class="flex-1 truncate">{item.label}</span>
          {#if sectionToCat[item.id] && traitCountByCategory[sectionToCat[item.id]]}
            <span class="text-[10px] px-1.5 py-0.5 rounded-full {activeSection === item.id ? 'bg-blue-100 text-blue-700' : 'bg-black/[0.04] text-[var(--color-text-tertiary)]'}">{traitCountByCategory[sectionToCat[item.id]]}</span>
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
              onclick={() => { activeSection = item.id; riskFilter = 'all'; }}
              class="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors text-left group ml-2 {activeSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.03]'}"
            >
              <svg class="w-4 h-4 flex-shrink-0 {activeSection === item.id ? 'text-blue-600' : 'text-[var(--color-text-tertiary)]'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{item.icon}"/></svg>
              <span class="flex-1 truncate">{item.label}</span>
            </button>
          {/each}
        {/if}
      </div>
    </nav>

    <!-- Export buttons -->
    <div class="mt-4 pt-4 border-t border-black/5 flex flex-col gap-1.5">
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

  <!-- MAIN CONTENT -->
  <main class="flex-1 min-w-0 py-4 sm:py-6 space-y-6">

    <!-- Mobile nav (horizontal scroll) -->
    <div class="lg:hidden overflow-x-auto pb-2 -mx-1">
      <div class="flex gap-1 px-1">
        {#each navItems as item}
          <button
            onclick={() => { activeSection = item.id; riskFilter = 'all'; }}
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors {activeSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] border border-black/10 hover:bg-black/[0.02]'}"
          >{item.label}{#if sectionToCat[item.id] && traitCountByCategory[sectionToCat[item.id]]} ({traitCountByCategory[sectionToCat[item.id]]}){/if}</button>
        {/each}
      </div>
    </div>

    <!-- OVERVIEW -->
    {#if activeSection === 'overview'}
      <div class="grid grid-cols-3 gap-3">
        <div class="card text-center !p-4">
          <p class="text-2xl font-bold text-[var(--color-accent-blue)]">{traits.length}</p>
          <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Traits Analyzed</p>
        </div>
        <div class="card text-center !p-4">
          <p class="text-2xl font-bold text-red-600">{traits.filter(t => t.riskLevel === 'high').length}</p>
          <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Elevated Risk</p>
        </div>
        <div class="card text-center !p-4">
          <p class="text-2xl font-bold text-amber-600">{traits.filter(t => t.riskLevel === 'moderate').length}</p>
          <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Moderate Risk</p>
        </div>
      </div>

      {#if pgs.length > 0}
        <div class="space-y-3">
          <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">Polygenic Risk Scores</h2>
          <div class="space-y-2">
            {#each pgs.slice(0, 3) as result}
              <button onclick={() => { activeSection = 'riskscores'; }} class="card w-full text-left !p-3 flex items-center gap-3">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-[var(--color-text-primary)] truncate">{result.trait}</p>
                  <p class="text-[11px] text-[var(--color-text-tertiary)]">{result.variantsUsed}/{result.variantsTotal} variants</p>
                </div>
                <div class="w-32 flex-shrink-0">
                  <div class="flex items-center justify-between text-[10px] mb-1">
                    <span class="text-[var(--color-text-secondary)]">{result.percentile}th</span>
                    <span class="{result.percentile >= 70 ? 'text-red-600' : result.percentile >= 30 ? 'text-amber-600' : 'text-green-600'} font-medium">{result.percentile >= 70 ? 'Elevated' : result.percentile >= 30 ? 'Average' : 'Low'}</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-black/5 overflow-hidden">
                    <div class="h-full rounded-full {result.percentile >= 70 ? 'bg-red-500' : result.percentile >= 30 ? 'bg-amber-500' : 'bg-green-500'}" style="width: {result.percentile}%"></div>
                  </div>
                </div>
                <svg class="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Top Traits -->
      {#if traits.length > 0}
        <div class="space-y-3">
          <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">Top Findings</h2>
          <div class="space-y-1">
            {#each traits.slice(0, 8) as trait}
              <a href="/analysis/{trait.id}" class="block">
                <div class="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-black/[0.02] transition-colors">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 {riskCircleBg[trait.riskLevel] || 'bg-gray-100'}">
                    <span class="text-sm font-bold {riskCircleText[trait.riskLevel] || 'text-gray-700'}">{trait.snpCount}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-medium text-[var(--color-text-primary)]">{trait.name}</h3>
                    <p class="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                      {trait.genes.join(', ')} · {trait.snpCount} variant{trait.snpCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <span class="text-xs font-medium {riskCircleText[trait.riskLevel] || 'text-gray-600'}">{riskLabelText[trait.riskLevel] || trait.riskLevel}</span>
                  </div>
                  <svg class="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Category breakdown -->
      <div class="space-y-3">
        <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">Categories</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {#each categories as cat}
            {#if categoryMeta[cat]}
              <button onclick={() => { activeSection = cat; }} class="card text-left !p-3 space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-black/[0.03] flex items-center justify-center flex-shrink-0">
                    {@html categoryMeta[cat].iconSvg.replace('width="24"', 'width="16"').replace('height="24"', 'height="16"')}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-[var(--color-text-primary)] truncate">{categoryMeta[cat].title}</p>
                    <p class="text-[10px] text-[var(--color-text-tertiary)]">{traitCountByCategory[cat] || 0} traits</p>
                  </div>
                </div>
                {#if riskSummary[cat]}
                  <div class="h-1 rounded-full bg-black/5 overflow-hidden">
                    <div class="h-full rounded-full {riskSummary[cat].avgRisk >= 60 ? 'bg-red-500' : riskSummary[cat].avgRisk >= 35 ? 'bg-amber-500' : 'bg-green-500'}" style="width: {riskSummary[cat].avgRisk}%"></div>
                  </div>
                {/if}
              </button>
            {/if}
          {/each}
        </div>
      </div>

      <!-- Export (mobile only, desktop has sidebar) -->
      <div class="flex items-center gap-3 lg:hidden">
        <button onclick={handleExportCsv} class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg border border-black/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          Export CSV
        </button>
        <button onclick={handleExportReport} class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg border border-black/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Export Report
        </button>
      </div>

    <!-- CATEGORY VIEWS -->
    {:else if sectionToCat[activeSection]}
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">{categoryMeta[sectionToCat[activeSection]]?.title || activeSection}</h2>
          <p class="text-xs text-[var(--color-text-tertiary)] mt-1">{categoryMeta[sectionToCat[activeSection]]?.description || ''}</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          {#each ['all', 'high', 'moderate', 'low'] as f}
            <button onclick={() => riskFilter = f} class="px-3 py-1 rounded-full text-xs transition-colors {riskFilter === f ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.02] border border-black/10'}">{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          {/each}
        </div>

        {#if currentCategoryTraits.length === 0}
          <p class="text-sm text-[var(--color-text-tertiary)] py-8 text-center">No traits match your filters</p>
        {:else}
          <div class="space-y-0">
            {#each currentCategoryTraits as trait}
              <a href="/analysis/{trait.id}" class="block">
                <div class="flex items-center gap-4 py-4 px-4 hover:bg-black/[0.02] border-b border-black/5 transition-colors">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 {riskCircleBg[trait.riskLevel] || 'bg-gray-100'}">
                    <span class="text-sm font-bold {riskCircleText[trait.riskLevel] || 'text-gray-700'}">{trait.snpCount}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-medium text-[var(--color-text-primary)]">{trait.name}</h3>
                    <p class="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                      {trait.genes.join(', ')} · {trait.snpCount} variant{trait.snpCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <span class="text-xs font-medium {riskCircleText[trait.riskLevel] || 'text-gray-600'}">{riskLabelText[trait.riskLevel] || trait.riskLevel}</span>
                  </div>
                  <svg class="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </a>
            {/each}
          </div>
        {/if}
      </div>

    <!-- RISK SCORES -->
    {:else if activeSection === 'riskscores'}
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Polygenic Risk Scores</h2>
        <p class="text-xs text-[var(--color-text-tertiary)]">Combined effect of multiple genetic variants on trait risk</p>
        {#if pgs.length === 0}
          <p class="text-sm text-[var(--color-text-tertiary)] py-8 text-center">No polygenic risk scores available</p>
        {:else}
          <div class="space-y-2">
            {#each pgs as result}
              <div class="card w-full text-left !p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold text-[var(--color-text-primary)]">{result.trait}</p>
                    <p class="text-[11px] text-[var(--color-text-tertiary)]">{result.description}</p>
                  </div>
                  <span class="text-xs font-medium px-2 py-0.5 rounded-full {result.percentile >= 70 ? 'text-red-600 bg-red-50' : result.percentile >= 30 ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'}">{result.percentile >= 70 ? 'Elevated' : result.percentile >= 30 ? 'Average' : 'Below avg'}</span>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-[var(--color-text-secondary)]">{result.percentile}th percentile</span>
                    <span class="text-[var(--color-text-tertiary)]">{result.variantsUsed}/{result.variantsTotal} variants</span>
                  </div>
                  <div class="h-2 rounded-full bg-black/5 overflow-hidden">
                    <div class="h-full rounded-full transition-all {result.percentile >= 70 ? 'bg-red-500' : result.percentile >= 30 ? 'bg-amber-500' : 'bg-green-500'}" style="width: {result.percentile}%"></div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    <!-- CHROMOSOME VIEW -->
    {:else if activeSection === 'chromosome'}
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Chromosome View</h2>
        <p class="text-xs text-[var(--color-text-tertiary)]">Findings grouped by chromosome</p>
        {#each chromosomeGroups as group}
          <div class="border border-black/5 rounded-lg overflow-hidden">
            <button onclick={() => toggleChromosome(group.chr)} class="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-black/[0.01] transition-colors">
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-[var(--color-text-primary)]">Chr {group.chr}</span>
                <span class="text-[11px] text-[var(--color-text-tertiary)]">{group.snps.length} variant{group.snps.length !== 1 ? 's' : ''}</span>
              </div>
              <svg class="w-4 h-4 text-[var(--color-text-tertiary)] transition-transform {expandedChromosomes.has(group.chr) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {#if expandedChromosomes.has(group.chr)}
              <div class="border-t border-black/5">
                {#each group.snps as snp}
                  <div class="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-black/[0.02] transition-colors border-b border-black/[0.03] last:border-0">
                    <span class="w-2 h-2 rounded-full flex-shrink-0 {riskDotColors[snp.riskLevel] || 'bg-gray-400'}"></span>
                    <span class="text-xs font-mono text-[var(--color-text-secondary)] w-24 flex-shrink-0">{snp.rsid}</span>
                    <span class="text-xs text-[var(--color-text-primary)] flex-1 truncate">{snp.trait}</span>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded-full {riskColors[snp.riskLevel] || 'text-gray-600 bg-gray-50'}">{snp.riskLevel}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>

    <!-- ALL VARIANTS -->
    {:else if activeSection === 'allvariants'}
      <div class="space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">All Variants</h2>
          <div class="flex items-center gap-2">
            {#each ['all', 'high', 'moderate', 'low', 'carrier'] as f}
              <button onclick={() => riskFilter = f} class="px-2.5 py-1 rounded-full text-[11px] transition-colors {riskFilter === f ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.02] border border-black/10'}">{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
            {/each}
          </div>
        </div>

        <div class="overflow-x-auto rounded-lg border border-black/5">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-black/[0.02] text-left">
                {#each [{f:'rsid',l:'rsID'},{f:'gene',l:'Gene'},{f:'trait',l:'Trait'},{f:'risk',l:'Risk'},{f:'userGenotype',l:'Genotype'}] as col}
                  <th class="px-3 py-2 text-[11px] font-semibold text-[var(--color-text-tertiary)] cursor-pointer hover:text-[var(--color-text-primary)] select-none" onclick={() => toggleSort(col.f)}>
                    <span class="flex items-center gap-1">{col.l}{#if sortField === col.f}<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{sortDir === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}"/></svg>{/if}</span>
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each allVariants as snp}
                <tr class="border-t border-black/[0.03] hover:bg-black/[0.02] transition-colors">
                  <td class="px-3 py-2 font-mono text-xs text-[var(--color-accent-blue)]">{snp.rsid}</td>
                  <td class="px-3 py-2 text-xs text-[var(--color-text-primary)]">{snp.gene}</td>
                  <td class="px-3 py-2 text-xs max-w-48 truncate">{#if snpToTraitId[snp.rsid]}<a href="/analysis/{snpToTraitId[snp.rsid]}" class="text-[var(--color-accent-blue)] hover:underline">{snp.trait}</a>{:else}<span class="text-[var(--color-text-primary)]">{snp.trait}</span>{/if}</td>
                  <td class="px-3 py-2"><span class="text-[10px] font-medium px-2 py-0.5 rounded-full {riskColors[snp.riskLevel] || 'text-gray-600 bg-gray-50'}">{snp.riskLevel}</span></td>
                  <td class="px-3 py-2 font-mono text-xs text-[var(--color-text-secondary)]">{snp.userGenotype}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <p class="text-[11px] text-[var(--color-text-tertiary)]">{allVariants.length} variant{allVariants.length !== 1 ? 's' : ''} shown</p>
      </div>
    {/if}
  </main>
</div>
{/if}
