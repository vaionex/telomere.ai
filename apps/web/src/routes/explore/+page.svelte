<script>
  import { getAllSnps, getCategories, matchSnps } from '@telomere/snp-db';
  import { isLoaded, rawSnps } from '$lib/stores/genetic-data.js';
  import { get } from 'svelte/store';

  const allSnps = getAllSnps();
  const categories = getCategories();

  let search = $state('');
  let filterCat = $state('');
  let hasData = $state(false);
  let userMatches = $state(new Map());

  $effect(() => {
    hasData = get(isLoaded);
    if (hasData) {
      const matched = matchSnps(get(rawSnps));
      userMatches = new Map(matched.map(m => [m.rsid, m]));
    }
  });

  const filtered = $derived(() => {
    let result = allSnps;
    if (filterCat) result = result.filter(s => s.categories?.includes(filterCat));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.rsid.toLowerCase().includes(q) ||
        s.gene?.toLowerCase().includes(q) ||
        s.trait?.toLowerCase().includes(q) ||
        s.conditions?.some(c => c.toLowerCase().includes(q))
      );
    }
    return result;
  });

  function riskColor(level) {
    if (level === 'high') return 'text-accent-red';
    if (level === 'moderate') return 'text-accent-amber';
    return 'text-accent-green';
  }
</script>

<svelte:head>
  <title>SNP Explorer — Telomere.ai</title>
</svelte:head>

<section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold text-text-primary">SNP Explorer</h1>
    <p class="text-text-secondary text-sm mt-1">Browse all {allSnps.length} curated SNPs in the database</p>
  </div>

  <!-- Filters -->
  <div class="flex flex-col sm:flex-row gap-3">
    <div class="flex-1 relative">
      <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input
        type="text"
        bind:value={search}
        placeholder="Search by rsID, gene, or condition..."
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
  </div>

  <!-- Results count -->
  <p class="text-xs text-text-tertiary">{filtered().length} SNP{filtered().length !== 1 ? 's' : ''}</p>

  <!-- Table -->
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-black/5">
          <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs">rsID</th>
          <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs">Gene</th>
          <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs hidden sm:table-cell">Category</th>
          <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs hidden md:table-cell">Significance</th>
          {#if hasData}
            <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs">Genotype</th>
            <th class="text-left py-3 px-3 text-text-tertiary font-medium text-xs">Risk</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each filtered() as snp (snp.rsid)}
          {@const userMatch = userMatches.get(snp.rsid)}
          <tr class="border-b border-black/[0.03] hover:bg-accent-blue/[0.02] transition-colors">
            <td class="py-3 px-3">
              <a href="/snp/{snp.rsid}" class="font-mono text-accent-blue hover:underline">{snp.rsid}</a>
            </td>
            <td class="py-3 px-3 text-text-secondary">{snp.gene}</td>
            <td class="py-3 px-3 text-text-tertiary text-xs hidden sm:table-cell">
              {#each snp.categories || [] as cat}
                <span class="inline-block px-2 py-0.5 rounded-full glass text-xs mr-1">{cat}</span>
              {/each}
            </td>
            <td class="py-3 px-3 text-text-tertiary text-xs hidden md:table-cell">{snp.significance || '—'}</td>
            {#if hasData}
              <td class="py-3 px-3 font-mono text-sm">{userMatch?.userGenotype || '—'}</td>
              <td class="py-3 px-3">
                {#if userMatch}
                  <span class="text-xs font-medium {riskColor(userMatch.riskLevel)}">{userMatch.riskLevel}</span>
                {:else}
                  <span class="text-text-tertiary text-xs">—</span>
                {/if}
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
