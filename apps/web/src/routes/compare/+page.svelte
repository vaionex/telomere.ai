<script>
  import { genomes, canCompare, GENOME_COLORS } from '$lib/stores/genetic-data.js';
  import { getAllSnps, getCategories, matchSnps } from '@telomere/snp-db';
  import { get } from 'svelte/store';

  const allSnps = getAllSnps();
  const categories = getCategories();

  let filterCat = $state('');
  let search = $state('');
  let genomesVal = $state([]);
  let canCompareVal = $state(false);

  // Per-genome matched SNPs
  let genomeMatches = $state([]);

  $effect(() => {
    genomesVal = get(genomes);
    canCompareVal = get(canCompare);
    genomeMatches = genomesVal.map(g => {
      const matched = matchSnps(g.snps);
      return new Map(matched.map(m => [m.rsid, m]));
    });
  });

  // Subscribe to store changes
  $effect(() => {
    const unsub = genomes.subscribe(val => {
      genomesVal = val;
      canCompareVal = val.length >= 2;
      genomeMatches = val.map(g => {
        const matched = matchSnps(g.snps);
        return new Map(matched.map(m => [m.rsid, m]));
      });
    });
    return unsub;
  });

  const filtered = $derived(() => {
    let result = allSnps;
    if (filterCat) result = result.filter(s => s.categories?.includes(filterCat));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.rsid.toLowerCase().includes(q) ||
        s.gene?.toLowerCase().includes(q) ||
        s.trait?.toLowerCase().includes(q)
      );
    }
    // Only show SNPs where at least one genome has data
    result = result.filter(s => genomeMatches.some(m => m.has(s.rsid)));
    return result;
  });

  let diffOnly = $state(false);

  const displayed = $derived(() => {
    let items = filtered();
    if (diffOnly) {
      items = items.filter(s => {
        const genos = genomeMatches.map(m => m.get(s.rsid)?.userGenotype).filter(Boolean);
        return new Set(genos).size > 1;
      });
    }
    return items;
  });

  function riskColor(level) {
    if (level === 'high') return 'text-accent-red';
    if (level === 'moderate') return 'text-accent-amber';
    if (level === 'low') return 'text-accent-green';
    return 'text-text-tertiary';
  }
</script>

<svelte:head>
  <title>Genome Comparison — Telomere.ai</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold text-text-primary">Genome Comparison</h1>
    <p class="text-text-secondary text-sm mt-1">Side-by-side comparison of loaded genomes</p>
  </div>

  {#if !canCompareVal}
    <div class="card text-center py-16 space-y-4">
      <p class="text-text-secondary">You need at least 2 genomes loaded to compare.</p>
      <p class="text-text-tertiary text-sm">Currently loaded: {genomesVal.length} genome{genomesVal.length !== 1 ? 's' : ''}</p>
      <a href="/upload" class="btn-primary text-sm inline-block !py-2 !px-4">Upload Another Genome</a>
    </div>
  {:else}
    <!-- Genome legend -->
    <div class="flex flex-wrap gap-3">
      {#each genomesVal as g, i}
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm">
          <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: {g.color}"></span>
          <span class="font-medium">{g.name}</span>
        </div>
      {/each}
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 relative">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          type="text"
          bind:value={search}
          placeholder="Search by rsID, gene, or trait..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-black/5 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-blue/40 transition-colors"
        />
      </div>
      <select
        bind:value={filterCat}
        class="px-4 py-2.5 rounded-xl bg-surface border border-black/5 text-sm text-text-primary focus:outline-none focus:border-accent-blue/40"
      >
        <option value="">All categories</option>
        {#each categories as cat}
          <option value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        {/each}
      </select>
      <label class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-black/5 text-sm cursor-pointer">
        <input type="checkbox" bind:checked={diffOnly} class="rounded" />
        <span class="text-text-secondary">Differences only</span>
      </label>
    </div>

    <p class="text-xs text-text-tertiary">{displayed().length} variant{displayed().length !== 1 ? 's' : ''}</p>

    <!-- Comparison table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-black/5">
            <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs">rsID</th>
            <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs">Gene</th>
            <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs hidden sm:table-cell">Trait</th>
            {#each genomesVal as g, i}
              <th class="text-left py-3 px-3 text-xs font-medium" style="color: {g.color}">{g.name}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each displayed() as snp (snp.rsid)}
            {@const genos = genomeMatches.map(m => m.get(snp.rsid))}
            {@const genotypes = genos.map(g => g?.userGenotype).filter(Boolean)}
            {@const isDiff = new Set(genotypes).size > 1}
            <tr class="border-b border-black/[0.03] hover:bg-accent-blue/[0.02] transition-colors {isDiff ? 'bg-amber-50' : ''}">
              <td class="py-3 px-3">
                <a href="/snp/{snp.rsid}" class="font-mono text-accent-blue hover:underline">{snp.rsid}</a>
              </td>
              <td class="py-3 px-3 text-text-secondary">{snp.gene}</td>
              <td class="py-3 px-3 text-text-tertiary text-xs hidden sm:table-cell truncate max-w-[200px]">{snp.trait}</td>
              {#each genomesVal as g, i}
                {@const match = genos[i]}
                <td class="py-3 px-3">
                  {#if match}
                    <span class="font-mono text-sm font-semibold {riskColor(match.riskLevel)}">{match.userGenotype}</span>
                    <span class="text-xs ml-1 {riskColor(match.riskLevel)}">{match.riskLevel}</span>
                  {:else}
                    <span class="text-text-tertiary text-xs">--</span>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
