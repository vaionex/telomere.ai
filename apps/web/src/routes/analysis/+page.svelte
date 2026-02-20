<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { isLoaded, rawSnps, activeGenome, activeGenomeIndex } from '$lib/stores/genetic-data.js';
  import { matchedSnps, reportsByCategory, categoryMeta, pgsResults, categoryRiskSummary, topFindings, traitResults } from '$lib/stores/reports.js';
  import { filterTraitsByCategory } from '$lib/utils/traits.js';
  import { exportMatchedSnpsCsv, exportReport } from '$lib/utils/export.js';
  import { activeSection, searchQuery } from '$lib/stores/navigation.js';
  import { get } from 'svelte/store';

  // UI state
  let riskFilter = $state('all');
  let sortField = $state('risk');
  let sortDir = $state('desc');
  let expandedChromosomes = $state(new Set());

  // Store-backed state
  let loaded = $state(false);
  let snpCount = $state(0);
  let matched = $state([]);
  let byCat = $state({});
  let pgs = $state([]);
  let riskSummary = $state({});
  let genomeName = $state('');
  let topFindingsVal = $state([]);
  let traits = $state([]);
  let currentActiveSection = $state('overview');
  let currentSearchQuery = $state('');

  const unsubs = [];
  function syncFromStores() {
    loaded = get(isLoaded);
    if (!loaded) return;
    snpCount = get(rawSnps).size;
    matched = get(matchedSnps);
    byCat = get(reportsByCategory);
    pgs = get(pgsResults);
    riskSummary = get(categoryRiskSummary);
    topFindingsVal = get(topFindings);
    traits = get(traitResults);
    genomeName = get(activeGenome)?.name || '';
  }
  unsubs.push(rawSnps.subscribe(() => syncFromStores()));
  unsubs.push(activeGenomeIndex.subscribe(() => syncFromStores()));
  unsubs.push(activeSection.subscribe(v => { currentActiveSection = v; }));
  unsubs.push(searchQuery.subscribe(v => { currentSearchQuery = v; }));
  onDestroy(() => unsubs.forEach(u => u()));

  if (!get(isLoaded) && typeof window !== 'undefined') {
    goto('/upload');
  }

  const initParams = get(page).url?.searchParams;
  if (initParams?.get('section')) {
    activeSection.set(initParams.get('section'));
  }

  const sectionToCat = { health: 'health', pharma: 'pharma', nutrition: 'nutrition', traits: 'traits', longevity: 'longevity', carrier: 'carrier' };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'health', label: 'Health Risks' },
    { id: 'pharma', label: 'Pharmacogenomics' },
    { id: 'nutrition', label: 'Nutrigenomics' },
    { id: 'traits', label: 'Traits & Behavior' },
    { id: 'longevity', label: 'Longevity' },
    { id: 'carrier', label: 'Carrier Status' },
    { id: 'riskscores', label: 'Risk Scores' },
  ];

  const riskColors = { high: 'text-red-600 bg-red-50', moderate: 'text-amber-600 bg-amber-50', low: 'text-green-600 bg-green-50', carrier: 'text-blue-600 bg-blue-50', normal: 'text-green-600 bg-green-50' };
  const riskDotColors = { high: 'bg-red-500', moderate: 'bg-amber-500', low: 'bg-green-500', carrier: 'bg-blue-500', normal: 'bg-green-500' };
  const riskCircleBg = { high: 'bg-red-100', moderate: 'bg-amber-100', low: 'bg-green-100', carrier: 'bg-blue-100', normal: 'bg-green-100' };
  const riskCircleText = { high: 'text-red-700', moderate: 'text-amber-700', low: 'text-green-700', carrier: 'text-blue-700', normal: 'text-green-700' };
  const riskLabelText = { high: 'Elevated', moderate: 'Moderate', low: 'Typical', carrier: 'Carrier', normal: 'Typical' };

  let traitCountByCategory = $derived.by(() => {
    const counts = {};
    for (const t of traits) {
      for (const cat of t.categories) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  });

  let searchResults = $derived.by(() => {
    if (!currentSearchQuery) return [];
    const q = currentSearchQuery.toLowerCase();
    return traits.filter(t =>
      t.name?.toLowerCase().includes(q) ||
      t.genes?.some(g => g.toLowerCase().includes(q)) ||
      t.snps?.some(s => s.rsid?.toLowerCase().includes(q))
    );
  });

  let isSearching = $derived(currentSearchQuery.length > 0);

  let currentCategoryTraits = $derived.by(() => {
    const cat = sectionToCat[currentActiveSection];
    if (!cat) return [];
    let items = filterTraitsByCategory(traits, cat);
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      items = items.filter(t => t.name?.toLowerCase().includes(q) || t.genes?.some(g => g.toLowerCase().includes(q)));
    }
    if (riskFilter !== 'all') items = items.filter(t => t.riskLevel === riskFilter);
    return items;
  });

  let snpToTraitId = $derived.by(() => {
    const map = {};
    for (const t of traits) {
      for (const s of (t.snps || [])) {
        if (!map[s.rsid]) map[s.rsid] = t.id;
      }
    }
    return map;
  });

  let allVariants = $derived.by(() => {
    let items = [...matched];
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
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
<div class="space-y-6">
  <!-- Mobile nav (horizontal scroll) -->
  <div class="lg:hidden overflow-x-auto pb-2 -mx-1">
    <div class="flex gap-1 px-1">
      {#each navItems as item}
        <button
          onclick={() => { activeSection.set(item.id); riskFilter = 'all'; }}
          class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors {currentActiveSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] border border-black/10 hover:bg-black/[0.02]'}"
        >{item.label}{#if sectionToCat[item.id] && traitCountByCategory[sectionToCat[item.id]]} ({traitCountByCategory[sectionToCat[item.id]]}){/if}</button>
      {/each}
    </div>
  </div>

  <!-- SEARCH RESULTS -->
  {#if isSearching}
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Search Results</h2>
        <p class="text-xs text-[var(--color-text-tertiary)] mt-1">{searchResults.length} trait{searchResults.length !== 1 ? 's' : ''} matching "{currentSearchQuery}"</p>
      </div>
      {#if searchResults.length === 0}
        <p class="text-sm text-[var(--color-text-tertiary)] py-8 text-center">No traits found</p>
      {:else}
        <div class="space-y-0">
          {#each searchResults as trait}
            <a href="/analysis/{trait.id}" class="block">
              <div class="flex items-center gap-4 py-4 px-4 hover:bg-black/[0.02] border-b border-black/5 transition-colors">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 {riskCircleBg[trait.riskLevel] || 'bg-gray-100'}">
                  <span class="text-sm font-bold {riskCircleText[trait.riskLevel] || 'text-gray-700'}">{trait.snpCount}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-[var(--color-text-primary)]">{trait.name}</h3>
                  <p class="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                    {trait.genes.join(', ')} · {trait.snpCount} variant{trait.snpCount !== 1 ? 's' : ''} · {trait.categories.join(', ')}
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

  <!-- OVERVIEW -->
  {:else if currentActiveSection === 'overview'}
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
            <button onclick={() => { activeSection.set('riskscores'); }} class="card w-full text-left !p-3 flex items-center gap-3">
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

    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">Categories</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {#each categories as cat}
          {#if categoryMeta[cat]}
            <button onclick={() => { activeSection.set(cat); }} class="card text-left !p-3 space-y-2">
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
  {:else if sectionToCat[currentActiveSection]}
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">{categoryMeta[sectionToCat[currentActiveSection]]?.title || currentActiveSection}</h2>
        <p class="text-xs text-[var(--color-text-tertiary)] mt-1">{categoryMeta[sectionToCat[currentActiveSection]]?.description || ''}</p>
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
  {:else if currentActiveSection === 'riskscores'}
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
  {:else if currentActiveSection === 'chromosome'}
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
  {:else if currentActiveSection === 'allvariants'}
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
</div>
{/if}
