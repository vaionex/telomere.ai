<script>
  import { rawSnps, fileMetadata, isLoaded, genomes, activeGenomeIndex, compareMode, canCompare } from '$lib/stores/genetic-data.js';
  import { matchedSnps, reportsByCategory, topFindings, categoryMeta } from '$lib/stores/reports.js';
  import ChromosomeMap from '$lib/components/ChromosomeMap.svelte';
  import RiskGauge from '$lib/components/RiskGauge.svelte';
  import GenomeSwitcher from '$lib/components/GenomeSwitcher.svelte';

  let activeTab = $state('overview');
  let searchQuery = $state('');
  let expandedSnp = $state(null);
  let selectedCategory = $state('all');

  const chromosomes = $derived(new Set([...$rawSnps.values()].map(s => s.chromosome)));
  const catList = ['health', 'longevity', 'nutrition', 'pharma', 'traits', 'carrier'];
  
  // Filtered findings based on category + search
  const filteredFindings = $derived(() => {
    let findings = selectedCategory === 'all' ? $matchedSnps : ($reportsByCategory[selectedCategory] || []);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      findings = findings.filter(s => 
        s.rsid.toLowerCase().includes(q) ||
        s.gene.toLowerCase().includes(q) ||
        s.trait.toLowerCase().includes(q) ||
        s.conditions?.some(c => c.toLowerCase().includes(q))
      );
    }
    return findings;
  });

  // Summary counts
  const riskCounts = $derived({
    high: $matchedSnps.filter(s => s.riskLevel === 'high').length,
    moderate: $matchedSnps.filter(s => s.riskLevel === 'moderate').length,
    low: $matchedSnps.filter(s => s.riskLevel === 'low').length,
  });

  function toggleSnp(rsid) {
    expandedSnp = expandedSnp === rsid ? null : rsid;
  }

  function riskColor(level) {
    return level === 'high' ? 'accent-red' : level === 'moderate' ? 'accent-amber' : 'accent-green';
  }

  function riskBg(level) {
    return level === 'high' ? 'bg-red-500/10 text-red-400' : level === 'moderate' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400';
  }
</script>

<svelte:head>
  <title>Your Results — Telomere AI</title>
</svelte:head>

{#if !$isLoaded}
  <div class="max-w-2xl mx-auto px-4 py-32 text-center">
    <div class="w-20 h-20 mx-auto rounded-2xl glass flex items-center justify-center mb-6">
      <svg class="w-10 h-10 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
      </svg>
    </div>
    <h1 class="text-2xl font-bold mb-3">No Genetic Data Loaded</h1>
    <p class="text-text-secondary mb-8">Open your raw genetic data file to see your personalized analysis.</p>
    <a href="/upload" class="btn-primary">Open File</a>
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
    
    <!-- Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 class="text-3xl font-bold">Your Genetic <span class="gradient-text">Report</span></h1>
          {#if $fileMetadata}
            <p class="text-text-secondary text-sm mt-1">
              <span class="font-mono text-accent-cyan">{$fileMetadata.totalSnps.toLocaleString()}</span> SNPs analyzed from
              <span class="font-mono">{$fileMetadata.fileName}</span>
              <span class="text-text-tertiary">({$fileMetadata.format})</span>
            </p>
          {/if}
        </div>
      </div>
      
      <!-- Genome switcher bar -->
      {#if $genomes.length > 0}
        <div class="py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
          <GenomeSwitcher />
        </div>
      {/if}
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
      <div class="card !p-4">
        <div class="text-2xl font-bold gradient-text">{$matchedSnps.length}</div>
        <div class="text-text-tertiary text-xs mt-1">Variants Analyzed</div>
      </div>
      <div class="card !p-4">
        <div class="text-2xl font-bold text-accent-red">{riskCounts.high}</div>
        <div class="text-text-tertiary text-xs mt-1">High Significance</div>
      </div>
      <div class="card !p-4">
        <div class="text-2xl font-bold text-accent-amber">{riskCounts.moderate}</div>
        <div class="text-text-tertiary text-xs mt-1">Moderate</div>
      </div>
      <div class="card !p-4">
        <div class="text-2xl font-bold text-accent-green">{riskCounts.low}</div>
        <div class="text-text-tertiary text-xs mt-1">Low / Normal</div>
      </div>
      <div class="card !p-4">
        <div class="text-2xl font-bold gradient-text">{chromosomes.size}</div>
        <div class="text-text-tertiary text-xs mt-1">Chromosomes</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-1 border-b border-white/5 mb-6 overflow-x-auto">
      <button class="px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 {activeTab === 'overview' ? 'text-accent-cyan border-accent-cyan' : 'text-text-tertiary border-transparent hover:text-text-secondary'}"
        onclick={() => activeTab = 'overview'}>Overview</button>
      <button class="px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 {activeTab === 'variants' ? 'text-accent-cyan border-accent-cyan' : 'text-text-tertiary border-transparent hover:text-text-secondary'}"
        onclick={() => activeTab = 'variants'}>All Variants</button>
      <button class="px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 {activeTab === 'chromosomes' ? 'text-accent-cyan border-accent-cyan' : 'text-text-tertiary border-transparent hover:text-text-secondary'}"
        onclick={() => activeTab = 'chromosomes'}>Chromosomes</button>
    </div>

    <!-- TAB: Overview -->
    {#if activeTab === 'overview'}
      <!-- Category cards grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {#each catList as cat}
          {@const meta = categoryMeta[cat]}
          {@const findings = $reportsByCategory[cat] || []}
          {@const high = findings.filter(f => f.riskLevel === 'high').length}
          {@const mod = findings.filter(f => f.riskLevel === 'moderate').length}
          <button class="card group text-left" onclick={() => { activeTab = 'variants'; selectedCategory = cat; }}>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl glass flex items-center justify-center text-2xl flex-shrink-0">{meta.icon}</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold group-hover:text-accent-cyan transition-colors">{meta.title}</h3>
                <p class="text-text-tertiary text-xs mt-0.5 line-clamp-1">{meta.description}</p>
                <div class="flex items-center gap-3 mt-3">
                  <span class="text-sm font-medium text-text-secondary">{findings.length} variants</span>
                  {#if high > 0}<span class="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{high} high</span>{/if}
                  {#if mod > 0}<span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{mod} moderate</span>{/if}
                </div>
              </div>
              <svg class="w-5 h-5 text-text-tertiary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>
        {/each}
      </div>

      <!-- Notable findings -->
      {#if $topFindings.length > 0}
        <h2 class="text-lg font-bold mb-4">Notable Findings</h2>
        <div class="space-y-2 mb-10">
          {#each $topFindings as snp (snp.rsid)}
            <button class="w-full text-left" onclick={() => toggleSnp(snp.rsid)}>
              <div class="card !p-4 {expandedSnp === snp.rsid ? 'glow-border' : ''}">
                <div class="flex items-center gap-4">
                  <RiskGauge percent={snp.riskPercent} size={48} />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-mono text-accent-cyan text-sm">{snp.rsid}</span>
                      <span class="text-text-tertiary text-sm">{snp.gene}</span>
                      <span class="px-2 py-0.5 rounded-full text-xs {riskBg(snp.riskLevel)}">{snp.riskLevel}</span>
                    </div>
                    <p class="text-sm font-medium mt-0.5">{snp.trait}</p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="font-mono text-lg font-bold text-accent-cyan">{snp.userGenotype}</div>
                    <div class="text-text-tertiary text-xs">your genotype</div>
                  </div>
                  <svg class="w-5 h-5 text-text-tertiary transition-transform flex-shrink-0 {expandedSnp === snp.rsid ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>

                {#if expandedSnp === snp.rsid}
                  <div class="mt-4 pt-4 border-t border-white/5 space-y-4">
                    <p class="text-sm text-text-secondary">
                      {snp.riskLevel === 'high' ? snp.riskDescription : snp.riskLevel === 'moderate' ? (snp.heterozygousDescription || snp.riskDescription) : snp.normalDescription}
                    </p>

                    <!-- Genotype breakdown -->
                    <div>
                      <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">Population Frequency</h4>
                      <div class="space-y-1.5">
                        {#each Object.entries(snp.populationFrequency) as [gt, freq]}
                          {@const pct = Math.round(freq * 100)}
                          {@const isYou = snp.userGenotype === gt}
                          <div class="flex items-center gap-2">
                            <span class="font-mono text-xs w-6 {isYou ? 'text-accent-cyan font-bold' : 'text-text-tertiary'}">{gt}</span>
                            <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div class="h-full rounded-full {isYou ? 'bg-accent-cyan' : 'bg-white/10'}" style="width: {pct}%"></div>
                            </div>
                            <span class="text-xs text-text-tertiary w-10 text-right">{pct}%</span>
                            {#if isYou}<span class="text-xs text-accent-cyan font-medium">You</span>{/if}
                          </div>
                        {/each}
                      </div>
                    </div>

                    {#if snp.conditions?.length}
                      <div>
                        <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">Associated Conditions</h4>
                        <div class="flex flex-wrap gap-1.5">
                          {#each snp.conditions as c}
                            <span class="px-2 py-1 rounded-md text-xs glass text-text-secondary">{c}</span>
                          {/each}
                        </div>
                      </div>
                    {/if}

                    {#if snp.recommendations?.length}
                      <div>
                        <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">Recommendations</h4>
                        <ul class="space-y-1">
                          {#each snp.recommendations as rec}
                            <li class="text-sm text-text-secondary flex items-start gap-2">
                              <svg class="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
                              {rec}
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {/if}

                    {#if snp.references?.length}
                      <div class="flex items-center gap-3">
                        {#each snp.references as ref}
                          {#if ref.startsWith('PMID:')}
                            <a href="https://pubmed.ncbi.nlm.nih.gov/{ref.replace('PMID:', '')}" target="_blank" rel="noopener"
                              class="text-xs font-mono text-accent-blue hover:underline">{ref}</a>
                          {/if}
                        {/each}
                      </div>
                    {/if}

                    <a href="/snp/{snp.rsid}" class="inline-flex items-center gap-1 text-sm text-accent-cyan hover:underline">
                      Full details
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      {/if}

    <!-- TAB: All Variants -->
    {:else if activeTab === 'variants'}
      <!-- Filters bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" bind:value={searchQuery} placeholder="Search by gene, rsID, trait, or condition..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan/40 transition-colors" />
        </div>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button class="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors {selectedCategory === 'all' ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'}"
            onclick={() => selectedCategory = 'all'}>All ({$matchedSnps.length})</button>
          {#each catList as cat}
            {@const count = ($reportsByCategory[cat] || []).length}
            {#if count > 0}
              <button class="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors {selectedCategory === cat ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'}"
                onclick={() => selectedCategory = cat}>{categoryMeta[cat]?.icon} {categoryMeta[cat]?.title} ({count})</button>
            {/if}
          {/each}
        </div>
      </div>

      <!-- Results count -->
      <p class="text-text-tertiary text-sm mb-4">{filteredFindings().length} variants</p>

      <!-- Variant list -->
      <div class="space-y-1.5">
        {#each filteredFindings() as snp (snp.rsid)}
          <button class="w-full text-left" onclick={() => toggleSnp(snp.rsid)}>
            <div class="rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all {expandedSnp === snp.rsid ? 'border-accent-cyan/30 bg-white/[0.04]' : ''}">
              <!-- Compact row -->
              <div class="flex items-center gap-3 px-4 py-3">
                <div class="w-2 h-2 rounded-full flex-shrink-0 {snp.riskLevel === 'high' ? 'bg-red-400' : snp.riskLevel === 'moderate' ? 'bg-amber-400' : 'bg-emerald-400'}"></div>
                <span class="font-mono text-accent-cyan text-sm w-28 flex-shrink-0">{snp.rsid}</span>
                <span class="text-text-secondary text-sm w-20 flex-shrink-0">{snp.gene}</span>
                <span class="text-sm text-text-primary flex-1 min-w-0 truncate">{snp.trait}</span>
                <span class="font-mono text-sm font-bold text-accent-cyan w-8 text-center flex-shrink-0">{snp.userGenotype}</span>
                <span class="px-2 py-0.5 rounded text-xs flex-shrink-0 {riskBg(snp.riskLevel)}">{snp.riskLevel}</span>
                <svg class="w-4 h-4 text-text-tertiary transition-transform flex-shrink-0 {expandedSnp === snp.rsid ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>

              <!-- Expanded detail -->
              {#if expandedSnp === snp.rsid}
                <div class="px-4 pb-4 pt-2 border-t border-white/5 space-y-4">
                  <div class="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Your Result</h4>
                      <div class="flex items-center gap-3">
                        <span class="font-mono text-3xl font-bold gradient-text">{snp.userGenotype}</span>
                        <div>
                          <p class="text-sm font-medium {snp.riskLevel === 'high' ? 'text-accent-red' : snp.riskLevel === 'moderate' ? 'text-accent-amber' : 'text-accent-green'}">
                            {snp.riskLevel === 'high' ? 'Elevated Risk' : snp.riskLevel === 'moderate' ? 'Moderate' : 'Normal'}
                          </p>
                          <p class="text-xs text-text-tertiary">Chr{snp.chromosome}:{snp.position?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Alleles</h4>
                      <div class="flex gap-4">
                        <div><span class="text-xs text-text-tertiary">Risk:</span> <span class="font-mono text-accent-red font-bold">{snp.riskAllele}</span></div>
                        <div><span class="text-xs text-text-tertiary">Normal:</span> <span class="font-mono text-accent-green font-bold">{snp.normalAllele}</span></div>
                      </div>
                    </div>
                  </div>

                  <p class="text-sm text-text-secondary leading-relaxed">
                    {snp.riskLevel === 'high' ? snp.riskDescription : snp.riskLevel === 'moderate' ? (snp.heterozygousDescription || snp.riskDescription) : snp.normalDescription}
                  </p>

                  <!-- Population frequency bars -->
                  {#if snp.populationFrequency}
                    <div>
                      <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">Population Frequency</h4>
                      <div class="space-y-1">
                        {#each Object.entries(snp.populationFrequency) as [gt, freq]}
                          {@const pct = Math.round(freq * 100)}
                          {@const isYou = snp.userGenotype === gt}
                          <div class="flex items-center gap-2">
                            <span class="font-mono text-xs w-6 {isYou ? 'text-accent-cyan font-bold' : 'text-text-tertiary'}">{gt}</span>
                            <div class="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div class="h-full rounded-full {isYou ? 'bg-accent-cyan' : 'bg-white/10'}" style="width: {pct}%"></div>
                            </div>
                            <span class="text-xs text-text-tertiary w-10 text-right">{pct}%</span>
                            {#if isYou}<span class="text-xs text-accent-cyan">You</span>{/if}
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}

                  <div class="flex flex-wrap gap-4">
                    {#if snp.conditions?.length}
                      <div class="flex-1 min-w-[200px]">
                        <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Conditions</h4>
                        <div class="flex flex-wrap gap-1">
                          {#each snp.conditions as c}
                            <span class="px-2 py-0.5 rounded text-xs glass text-text-secondary">{c}</span>
                          {/each}
                        </div>
                      </div>
                    {/if}
                    {#if snp.recommendations?.length}
                      <div class="flex-1 min-w-[200px]">
                        <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Recommendations</h4>
                        <ul class="space-y-0.5">
                          {#each snp.recommendations as rec}
                            <li class="text-xs text-text-secondary flex items-start gap-1.5">
                              <span class="text-accent-green mt-px">&#10003;</span> {rec}
                            </li>
                          {/each}
                        </ul>
                      </div>
                    {/if}
                  </div>

                  <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-2">
                      {#each (snp.references || []) as ref}
                        {#if ref.startsWith('PMID:')}
                          <a href="https://pubmed.ncbi.nlm.nih.gov/{ref.replace('PMID:', '')}" target="_blank" rel="noopener"
                            class="text-xs font-mono text-accent-blue hover:underline" onclick={(e) => e.stopPropagation()}>{ref}</a>
                        {/if}
                      {/each}
                    </div>
                    <div class="flex items-center gap-1 text-xs text-text-tertiary">
                      {#each snp.categories as cat}
                        <span class="px-1.5 py-0.5 rounded glass">{cat}</span>
                      {/each}
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </button>
        {/each}

        {#if filteredFindings().length === 0}
          <div class="text-center py-12">
            <p class="text-text-tertiary">No variants match your search.</p>
          </div>
        {/if}
      </div>

    <!-- TAB: Chromosomes -->
    {:else if activeTab === 'chromosomes'}
      <div class="card mb-6">
        <h2 class="font-semibold mb-4">Chromosome Coverage</h2>
        <ChromosomeMap {chromosomes} />
        <p class="text-text-tertiary text-xs mt-4">Data found on {chromosomes.size} of 24 chromosomes (22 autosomes + X + Y)</p>
      </div>
    {/if}

    <!-- Disclaimer -->
    <div class="mt-12 rounded-xl bg-white/[0.02] border border-white/5 p-4">
      <p class="text-xs text-text-tertiary leading-relaxed">
        <strong class="text-text-secondary">Your data, your insights.</strong> Telomere AI shows you everything we find — no results hidden, no paywalls, no gatekeeping. You already have your genome file; we just make it readable. Research references (PubMed IDs) are included so you can verify every finding.
      </p>
    </div>
  </div>
{/if}
