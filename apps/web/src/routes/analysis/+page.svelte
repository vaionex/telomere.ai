<script>
  export const ssr = false;
  export const prerender = false;

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isLoaded, rawSnps, genomes, activeGenome, setActiveGenome, activeGenomeIndex } from '$lib/stores/genetic-data.js';
  import { matchedSnps, reportsByCategory, categoryMeta, pgsResults, categoryRiskSummary, topFindings } from '$lib/stores/reports.js';
  import { lookupSnp, getByGene, getByChromosome, searchSnps, getAllSnps } from '@telomere/snp-db';
  import { exportMatchedSnpsCsv, exportReport } from '$lib/utils/export.js';
  import { get } from 'svelte/store';

  let activeSection = $state('overview');
  let selectedSnp = $state(null);
  let searchQuery = $state('');
  let riskFilter = $state('all');
  let sortField = $state('risk');
  let sortDir = $state('desc');
  let mobileDetailOpen = $state(false);
  let expandedChromosomes = $state(new Set());

  // Data from stores
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

  // Check URL params for section
  $effect(() => {
    const params = get(page).url?.searchParams;
    if (params?.get('section')) {
      activeSection = params.get('section');
    }
  });

  $effect(() => {
    if (!get(isLoaded)) { goto('/upload'); return; }
    loaded = true;
    snpCount = get(rawSnps).size;
    matched = get(matchedSnps);
    byCat = get(reportsByCategory);
    pgs = get(pgsResults);
    genomesVal = get(genomes);
    riskSummary = get(categoryRiskSummary);
    topFindingsVal = get(topFindings);
    activeGenomeIdx = get(activeGenomeIndex);
    const ag = get(activeGenome);
    genomeName = ag?.name || '';
  });

  // Category map for sections
  const sectionToCat = { health: 'health', pharma: 'pharma', nutrition: 'nutrition', traits: 'traits', longevity: 'longevity', carrier: 'carrier' };

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

  const riskColors = { high: 'text-red-600 bg-red-50', moderate: 'text-amber-600 bg-amber-50', low: 'text-green-600 bg-green-50', carrier: 'text-blue-600 bg-blue-50', normal: 'text-green-600 bg-green-50' };
  const riskDotColors = { high: 'bg-red-500', moderate: 'bg-amber-500', low: 'bg-green-500', carrier: 'bg-blue-500', normal: 'bg-green-500' };

  // Computed: total risk counts
  let highCount = $derived(matched.filter(s => s.riskLevel === 'high').length);
  let modCount = $derived(matched.filter(s => s.riskLevel === 'moderate').length);
  let carrierCount = $derived(matched.filter(s => s.riskLevel === 'carrier').length);

  // Current category findings
  let currentCategoryFindings = $derived.by(() => {
    const cat = sectionToCat[activeSection];
    if (!cat) return [];
    return [...(byCat[cat] || [])].sort((a, b) => (b.riskPercent || 0) - (a.riskPercent || 0));
  });

  // Filtered findings for category views
  let filteredFindings = $derived.by(() => {
    let items = currentCategoryFindings;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(s => s.rsid?.toLowerCase().includes(q) || s.gene?.toLowerCase().includes(q) || s.trait?.toLowerCase().includes(q));
    }
    if (riskFilter !== 'all') items = items.filter(s => s.riskLevel === riskFilter);
    return items;
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

  // Chromosome grouped findings
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

  function selectSnp(snp) {
    selectedSnp = snp;
    mobileDetailOpen = true;
  }

  function closeDetail() {
    selectedSnp = null;
    mobileDetailOpen = false;
  }

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

  // Related variants for selected SNP
  let relatedVariants = $derived.by(() => {
    if (!selectedSnp?.gene) return [];
    return matched.filter(s => s.gene === selectedSnp.gene && s.rsid !== selectedSnp.rsid).slice(0, 5);
  });

  const categories = ['health', 'longevity', 'nutrition', 'pharma', 'traits', 'carrier'];
</script>

<svelte:head>
  <title>Analysis — Telomere.ai</title>
  <meta name="robots" content="noindex" />
</svelte:head>

{#if loaded}
<div class="fixed inset-0 top-16 flex bg-[var(--color-bg-primary)]">
  <!-- LEFT SIDEBAR (desktop) -->
  <aside class="hidden lg:flex flex-col w-60 bg-white border-r border-black/5 overflow-y-auto flex-shrink-0">
    <!-- Genome switcher -->
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
      <!-- Risk summary dots -->
      <div class="flex items-center gap-3 mt-3 text-xs">
        {#if highCount > 0}<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span><span class="text-red-600 font-medium">{highCount}</span></span>{/if}
        {#if modCount > 0}<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span><span class="text-amber-600 font-medium">{modCount}</span></span>{/if}
        {#if carrierCount > 0}<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span><span class="text-blue-600 font-medium">{carrierCount}</span></span>{/if}
      </div>
    </div>

    <!-- Search -->
    <div class="px-4 pt-3 pb-2">
      <div class="relative">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" placeholder="Search..." bind:value={searchQuery} class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-black/10 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-blue-400" />
      </div>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 px-2 py-1">
      {#each navItems as item}
        <button
          onclick={() => { activeSection = item.id; selectedSnp = null; riskFilter = 'all'; }}
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors {activeSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.02]'}"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}/></svg>
          <span class="truncate">{item.label}</span>
          {#if sectionToCat[item.id] && byCat[sectionToCat[item.id]]}
            <span class="ml-auto text-[10px] text-[var(--color-text-tertiary)]">{byCat[sectionToCat[item.id]].length}</span>
          {/if}
        </button>
      {/each}
    </nav>
  </aside>

  <!-- MOBILE TOP NAV -->
  <div class="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-black/5 overflow-x-auto">
    <div class="flex items-center gap-1 px-3 py-2 min-w-max">
      {#each navItems as item}
        <button
          onclick={() => { activeSection = item.id; selectedSnp = null; riskFilter = 'all'; }}
          class="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors {activeSection === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.02]'}"
        >{item.label}</button>
      {/each}
    </div>
  </div>

  <!-- CENTER PANEL -->
  <main class="flex-1 overflow-y-auto pt-12 lg:pt-0">
    <div class="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

      <!-- OVERVIEW -->
      {#if activeSection === 'overview'}
        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="card text-center !p-4">
            <p class="text-2xl font-bold gradient-text">{snpCount.toLocaleString()}</p>
            <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Variants Analyzed</p>
          </div>
          <div class="card text-center !p-4">
            <p class="text-2xl font-bold text-[var(--color-accent-blue)]">{matched.length}</p>
            <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">SNPs Matched</p>
          </div>
          <div class="card text-center !p-4">
            <p class="text-2xl font-bold text-[var(--color-accent-amber)]">{highCount + modCount}</p>
            <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Risk Factors</p>
          </div>
          <div class="card text-center !p-4">
            <p class="text-2xl font-bold text-[var(--color-accent-violet)]">{Object.keys(byCat).length}</p>
            <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Categories</p>
          </div>
        </div>

        <!-- PGS Preview -->
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

        <!-- Top findings -->
        {#if topFindingsVal.length > 0}
          <div class="space-y-3">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">Top Findings</h2>
            <div class="space-y-1">
              {#each topFindingsVal as snp}
                <button onclick={() => selectSnp(snp)} class="card w-full text-left !p-3 flex items-center gap-3 {selectedSnp?.rsid === snp.rsid ? 'bg-blue-50/50' : ''}">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 {riskDotColors[snp.riskLevel] || 'bg-gray-400'}"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[var(--color-text-primary)] truncate">{snp.trait}</p>
                    <p class="text-[11px] text-[var(--color-text-tertiary)]">{snp.gene} · {snp.rsid}</p>
                  </div>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full {riskColors[snp.riskLevel] || 'text-gray-600 bg-gray-50'}">{snp.riskLevel}</span>
                  <span class="text-xs font-mono text-[var(--color-text-secondary)]">{snp.userGenotype}</span>
                  <svg class="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
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
                      <p class="text-[10px] text-[var(--color-text-tertiary)]">{(byCat[cat] || []).length} findings</p>
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

        <!-- Export -->
        <div class="flex items-center gap-3">
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

          <!-- Filter pills -->
          <div class="flex items-center gap-2 flex-wrap">
            {#each ['all', 'high', 'moderate', 'low', 'carrier'] as f}
              <button onclick={() => riskFilter = f} class="px-3 py-1 rounded-full text-xs transition-colors {riskFilter === f ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.02] border border-black/10'}">{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
            {/each}
          </div>

          <!-- Findings list -->
          {#if filteredFindings.length === 0}
            <p class="text-sm text-[var(--color-text-tertiary)] py-8 text-center">No findings match your filters</p>
          {:else}
            <div class="space-y-1">
              {#each filteredFindings as snp}
                <button onclick={() => selectSnp(snp)} class="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors {selectedSnp?.rsid === snp.rsid ? 'bg-blue-50/50' : 'hover:bg-black/[0.02]'}">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 {riskDotColors[snp.riskLevel] || 'bg-gray-400'}"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[var(--color-text-primary)] truncate">{snp.trait}</p>
                    <p class="text-[11px] text-[var(--color-text-tertiary)]">{snp.gene} · {snp.rsid}</p>
                  </div>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full {riskColors[snp.riskLevel] || 'text-gray-600 bg-gray-50'}">{snp.riskLevel}</span>
                  <span class="text-xs font-mono text-[var(--color-text-secondary)]">{snp.userGenotype}</span>
                  <svg class="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
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
                <button onclick={() => { selectedSnp = { rsid: result.pgsId || result.trait, trait: result.trait, gene: 'PGS', riskLevel: result.percentile >= 70 ? 'high' : result.percentile >= 30 ? 'moderate' : 'low', userGenotype: result.percentile + 'th percentile', riskPercent: result.percentile, description: result.description, category: result.category, pgsData: result }; mobileDetailOpen = true; }} class="card w-full text-left !p-4 space-y-2">
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
                </button>
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
                    <button onclick={() => selectSnp(snp)} class="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-black/[0.02] transition-colors border-b border-black/[0.03] last:border-0 {selectedSnp?.rsid === snp.rsid ? 'bg-blue-50/50' : ''}">
                      <span class="w-2 h-2 rounded-full flex-shrink-0 {riskDotColors[snp.riskLevel] || 'bg-gray-400'}"></span>
                      <span class="text-xs font-mono text-[var(--color-text-secondary)] w-24 flex-shrink-0">{snp.rsid}</span>
                      <span class="text-xs text-[var(--color-text-primary)] flex-1 truncate">{snp.trait}</span>
                      <span class="text-[10px] font-medium px-2 py-0.5 rounded-full {riskColors[snp.riskLevel] || 'text-gray-600 bg-gray-50'}">{snp.riskLevel}</span>
                    </button>
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
                  <tr onclick={() => selectSnp(snp)} class="border-t border-black/[0.03] cursor-pointer hover:bg-black/[0.02] transition-colors {selectedSnp?.rsid === snp.rsid ? 'bg-blue-50/50' : ''}">
                    <td class="px-3 py-2 font-mono text-xs text-[var(--color-accent-blue)]">{snp.rsid}</td>
                    <td class="px-3 py-2 text-xs text-[var(--color-text-primary)]">{snp.gene}</td>
                    <td class="px-3 py-2 text-xs text-[var(--color-text-primary)] max-w-48 truncate">{snp.trait}</td>
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
  </main>

  <!-- RIGHT SIDEBAR (desktop) -->
  <aside class="hidden lg:flex flex-col w-80 bg-white border-l border-black/5 overflow-y-auto flex-shrink-0">
    {#if selectedSnp}
      <div class="p-4 space-y-5">
        <!-- Close -->
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-semibold text-[var(--color-text-primary)]">{selectedSnp.trait}</h3>
            <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">{selectedSnp.gene} · {selectedSnp.rsid}</p>
          </div>
          <button onclick={closeDetail} class="p-1 rounded-lg hover:bg-black/[0.04] text-[var(--color-text-tertiary)]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Result box -->
        <div class="rounded-lg p-3 {riskColors[selectedSnp.riskLevel] || 'text-gray-600 bg-gray-50'} border border-current/10">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold">{selectedSnp.userGenotype}</span>
            <span class="text-xs font-semibold uppercase">{selectedSnp.riskLevel}</span>
          </div>
          {#if selectedSnp.description}
            <p class="text-xs mt-2 opacity-80">{selectedSnp.description}</p>
          {/if}
        </div>

        <!-- What this means -->
        {#if selectedSnp.riskDescription || selectedSnp.heterozygousDescription || selectedSnp.normalDescription}
          <div class="space-y-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-primary)]">What this means</h4>
            {#if selectedSnp.riskDescription}
              <div class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <span class="font-medium text-red-600">Risk: </span>{selectedSnp.riskDescription}
              </div>
            {/if}
            {#if selectedSnp.heterozygousDescription}
              <div class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <span class="font-medium text-amber-600">Heterozygous: </span>{selectedSnp.heterozygousDescription}
              </div>
            {/if}
            {#if selectedSnp.normalDescription}
              <div class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <span class="font-medium text-green-600">Normal: </span>{selectedSnp.normalDescription}
              </div>
            {/if}
          </div>
        {/if}

        <!-- Variant details -->
        <div class="space-y-2">
          <h4 class="text-xs font-semibold text-[var(--color-text-primary)]">Variant Details</h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            {#if selectedSnp.gene}<div><span class="text-[var(--color-text-tertiary)]">Gene</span><p class="font-medium">{selectedSnp.gene}</p></div>{/if}
            {#if selectedSnp.chromosome}<div><span class="text-[var(--color-text-tertiary)]">Chromosome</span><p class="font-medium">{selectedSnp.chromosome}</p></div>{/if}
            {#if selectedSnp.position}<div><span class="text-[var(--color-text-tertiary)]">Position</span><p class="font-mono">{selectedSnp.position}</p></div>{/if}
            {#if selectedSnp.riskAllele}<div><span class="text-[var(--color-text-tertiary)]">Risk Allele</span><p class="font-medium text-red-600">{selectedSnp.riskAllele}</p></div>{/if}
            {#if selectedSnp.normalAllele}<div><span class="text-[var(--color-text-tertiary)]">Normal Allele</span><p class="font-medium text-green-600">{selectedSnp.normalAllele}</p></div>{/if}
            {#if selectedSnp.significance}<div><span class="text-[var(--color-text-tertiary)]">Significance</span><p class="font-medium">{selectedSnp.significance}</p></div>{/if}
          </div>
        </div>

        <!-- Associated conditions -->
        {#if selectedSnp.conditions?.length}
          <div class="space-y-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-primary)]">Associated Conditions</h4>
            <div class="flex flex-wrap gap-1.5">
              {#each selectedSnp.conditions as cond}
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.04] text-[var(--color-text-secondary)]">{cond}</span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Population frequency -->
        {#if selectedSnp.populationFrequencies}
          <div class="space-y-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-primary)]">Population Frequency</h4>
            {#each Object.entries(selectedSnp.populationFrequencies) as [pop, freq]}
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

        <!-- Related variants -->
        {#if relatedVariants.length > 0}
          <div class="space-y-2">
            <h4 class="text-xs font-semibold text-[var(--color-text-primary)]">Related Variants ({selectedSnp.gene})</h4>
            {#each relatedVariants as rv}
              <button onclick={() => selectSnp(rv)} class="w-full text-left px-3 py-2 rounded-lg hover:bg-black/[0.02] flex items-center gap-2 text-xs transition-colors">
                <span class="w-2 h-2 rounded-full {riskDotColors[rv.riskLevel] || 'bg-gray-400'}"></span>
                <span class="font-mono text-[var(--color-accent-blue)]">{rv.rsid}</span>
                <span class="flex-1 truncate text-[var(--color-text-secondary)]">{rv.trait}</span>
                <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full {riskColors[rv.riskLevel] || 'text-gray-600 bg-gray-50'}">{rv.riskLevel}</span>
              </button>
            {/each}
          </div>
        {/if}

        <!-- Research links -->
        <div class="space-y-2">
          <h4 class="text-xs font-semibold text-[var(--color-text-primary)]">Research</h4>
          <div class="flex flex-wrap gap-2">
            {#if selectedSnp.rsid && selectedSnp.rsid.startsWith('rs')}
              <a href="https://www.ncbi.nlm.nih.gov/snp/{selectedSnp.rsid}" target="_blank" rel="noopener" class="text-[11px] text-[var(--color-accent-blue)] hover:underline flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                dbSNP
              </a>
              <a href="https://www.snpedia.com/index.php/{selectedSnp.rsid}" target="_blank" rel="noopener" class="text-[11px] text-[var(--color-accent-blue)] hover:underline flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                SNPedia
              </a>
              <a href="https://www.ncbi.nlm.nih.gov/clinvar/?term={selectedSnp.rsid}" target="_blank" rel="noopener" class="text-[11px] text-[var(--color-accent-blue)] hover:underline flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                ClinVar
              </a>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <svg class="w-12 h-12 text-[var(--color-text-tertiary)] mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <p class="text-sm text-[var(--color-text-tertiary)]">Select a finding to see details</p>
        <p class="text-xs text-[var(--color-text-tertiary)] mt-2 opacity-60">{matched.length} total variants matched</p>
      </div>
    {/if}
  </aside>

  <!-- MOBILE DETAIL OVERLAY -->
  {#if mobileDetailOpen && selectedSnp}
    <div class="lg:hidden fixed inset-0 z-50">
      <button onclick={closeDetail} class="absolute inset-0 bg-black/30"></button>
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-4 space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-base font-semibold text-[var(--color-text-primary)]">{selectedSnp.trait}</h3>
            <p class="text-xs text-[var(--color-text-tertiary)]">{selectedSnp.gene} · {selectedSnp.rsid}</p>
          </div>
          <button onclick={closeDetail} class="p-1 rounded-lg hover:bg-black/[0.04]">
            <svg class="w-5 h-5 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="rounded-lg p-3 {riskColors[selectedSnp.riskLevel] || 'text-gray-600 bg-gray-50'}">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold">{selectedSnp.userGenotype}</span>
            <span class="text-xs font-semibold uppercase">{selectedSnp.riskLevel}</span>
          </div>
          {#if selectedSnp.description}<p class="text-xs mt-2 opacity-80">{selectedSnp.description}</p>{/if}
        </div>
        {#if selectedSnp.rsid && selectedSnp.rsid.startsWith('rs')}
          <div class="flex gap-3">
            <a href="https://www.ncbi.nlm.nih.gov/snp/{selectedSnp.rsid}" target="_blank" rel="noopener" class="text-xs text-[var(--color-accent-blue)] hover:underline">dbSNP</a>
            <a href="https://www.snpedia.com/index.php/{selectedSnp.rsid}" target="_blank" rel="noopener" class="text-xs text-[var(--color-accent-blue)] hover:underline">SNPedia</a>
            <a href="https://www.ncbi.nlm.nih.gov/clinvar/?term={selectedSnp.rsid}" target="_blank" rel="noopener" class="text-xs text-[var(--color-accent-blue)] hover:underline">ClinVar</a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
{/if}
