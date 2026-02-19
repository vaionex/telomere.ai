<script>
  import { getAllSnps, searchSnps, getCategories } from '@telomere/snp-db';
  import { rawSnps, isLoaded } from '$lib/stores/genetic-data.js';
  import { matchSnps } from '@telomere/snp-db';
  import RiskGauge from '$lib/components/RiskGauge.svelte';

  let query = $state('');
  let selectedCategory = $state('all');
  let selectedChromosome = $state('all');

  const allSnps = getAllSnps();
  const categories = ['all', ...getCategories()];
  const chromosomes = ['all', ...[...new Set(allSnps.map(s => s.chromosome))].sort((a, b) => {
    const na = parseInt(a), nb = parseInt(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    if (!isNaN(na)) return -1;
    if (!isNaN(nb)) return 1;
    return a.localeCompare(b);
  })];

  const matched = $derived($isLoaded ? matchSnps($rawSnps) : []);
  const matchedMap = $derived(new Map(matched.map(s => [s.rsid, s])));

  const filtered = $derived(() => {
    let results = query.length > 1 ? searchSnps(query) : allSnps;
    if (selectedCategory !== 'all') results = results.filter(s => s.categories.includes(selectedCategory));
    if (selectedChromosome !== 'all') results = results.filter(s => s.chromosome === selectedChromosome);
    return results;
  });
</script>

<svelte:head><title>SNP Explorer — Telomere AI</title></svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">SNP <span class="gradient-text">Explorer</span></h1>
    <p class="text-text-secondary">Browse and search our curated database of {allSnps.length} health-relevant SNPs.</p>
  </div>

  <!-- Search & filters -->
  <div class="flex flex-col sm:flex-row gap-4 mb-6">
    <div class="flex-1 relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input
        type="text"
        bind:value={query}
        placeholder="Search by rsID, gene, or trait..."
        class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-cyan/50 font-mono text-sm"
      />
    </div>
    <select bind:value={selectedCategory} class="px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50">
      {#each categories as cat}
        <option value={cat}>{cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
      {/each}
    </select>
    <select bind:value={selectedChromosome} class="px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50">
      {#each chromosomes as chr}
        <option value={chr}>{chr === 'all' ? 'All Chromosomes' : `Chr ${chr}`}</option>
      {/each}
    </select>
  </div>

  <p class="text-text-tertiary text-sm mb-4">{filtered().length} SNPs</p>

  <!-- Table -->
  <div class="overflow-x-auto rounded-xl border border-white/10">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-white/[0.03] border-b border-white/10">
          <th class="text-left py-3 px-4 font-medium text-text-secondary">rsID</th>
          <th class="text-left py-3 px-4 font-medium text-text-secondary">Gene</th>
          <th class="text-left py-3 px-4 font-medium text-text-secondary hidden sm:table-cell">Chr</th>
          <th class="text-left py-3 px-4 font-medium text-text-secondary">Trait</th>
          {#if $isLoaded}
            <th class="text-center py-3 px-4 font-medium text-text-secondary">Genotype</th>
            <th class="text-center py-3 px-4 font-medium text-text-secondary">Risk</th>
          {/if}
          <th class="text-left py-3 px-4 font-medium text-text-secondary hidden md:table-cell">Category</th>
        </tr>
      </thead>
      <tbody>
        {#each filtered().slice(0, 100) as snp (snp.rsid)}
          {@const m = matchedMap.get(snp.rsid)}
          <tr class="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors" onclick={() => window.location.href = `/snp/${snp.rsid}`}>
            <td class="py-3 px-4 font-mono text-accent-cyan text-xs">{snp.rsid}</td>
            <td class="py-3 px-4 font-medium">{snp.gene}</td>
            <td class="py-3 px-4 text-text-tertiary hidden sm:table-cell">{snp.chromosome}</td>
            <td class="py-3 px-4 text-text-secondary text-xs max-w-xs truncate">{snp.trait}</td>
            {#if $isLoaded}
              <td class="py-3 px-4 text-center font-mono font-bold {m ? 'text-accent-cyan' : 'text-text-tertiary'}">{m?.userGenotype || '—'}</td>
              <td class="py-3 px-4 text-center">
                {#if m}
                  <span class="px-2 py-0.5 rounded-full text-xs {m.riskLevel === 'high' ? 'bg-accent-red/10 text-accent-red' : m.riskLevel === 'moderate' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-accent-green/10 text-accent-green'}">{m.riskLevel}</span>
                {:else}
                  <span class="text-text-tertiary">—</span>
                {/if}
              </td>
            {/if}
            <td class="py-3 px-4 hidden md:table-cell">
              <div class="flex gap-1 flex-wrap">
                {#each snp.categories as cat}
                  <span class="px-2 py-0.5 rounded-full text-xs glass text-text-tertiary">{cat}</span>
                {/each}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if filtered().length > 100}
    <p class="text-text-tertiary text-sm text-center mt-4">Showing first 100 of {filtered().length} results. Refine your search to see more.</p>
  {/if}
</div>
