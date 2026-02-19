<script>
  export const ssr = false;
  export const prerender = false;

  import { genomes, canCompare, activeGenomeIndex, setActiveGenome } from '$lib/stores/genetic-data.js';
  import { getAllSnps, getCategories, matchSnps } from '@telomere/snp-db';
  import { buildTraits, filterTraitsByCategory } from '$lib/utils/traits.js';
  import { get } from 'svelte/store';
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  const allSnps = getAllSnps();
  const categories = getCategories();

  let filterCat = $state('');
  let search = $state('');
  let genomesVal = $state([]);
  let canCompareVal = $state(false);
  let viewMode = $state('traits'); // 'traits' | 'variants' | 'overlap'
  let diffOnly = $state(false);

  // Per-genome matched SNPs and traits
  let genomeMatches = $state([]);
  let genomeTraits = $state([]);

  const unsub = genomes.subscribe(val => {
    genomesVal = val;
    canCompareVal = val.length >= 2;
    genomeMatches = val.map(g => {
      const matched = matchSnps(g.snps);
      return { list: matched, map: new Map(matched.map(m => [m.rsid, m])) };
    });
    genomeTraits = val.map(g => {
      const matched = matchSnps(g.snps);
      return buildTraits(matched);
    });
  });
  onDestroy(unsub);

  // Overlap stats
  let overlapStats = $derived.by(() => {
    if (genomesVal.length < 2 || genomeTraits.length < 2) return null;
    const traitSets = genomeTraits.map(t => new Set(t.map(tr => tr.id)));
    const allTraitIds = new Set(genomeTraits.flatMap(t => t.map(tr => tr.id)));

    // Shared across ALL genomes
    const sharedAll = [...allTraitIds].filter(id => traitSets.every(s => s.has(id)));

    // Pairwise overlap
    const pairwise = [];
    for (let i = 0; i < genomesVal.length; i++) {
      for (let j = i + 1; j < genomesVal.length; j++) {
        const shared = [...traitSets[i]].filter(id => traitSets[j].has(id));
        const union = new Set([...traitSets[i], ...traitSets[j]]);
        pairwise.push({
          a: genomesVal[i].name,
          b: genomesVal[j].name,
          colorA: genomesVal[i].color,
          colorB: genomesVal[j].color,
          shared: shared.length,
          total: union.size,
          pct: union.size > 0 ? Math.round(shared.length / union.size * 100) : 0,
        });
      }
    }

    // Shared risk traits (high/moderate in ALL genomes)
    const sharedRiskTraits = sharedAll.filter(id => {
      return genomeTraits.every(traits => {
        const t = traits.find(tr => tr.id === id);
        return t && (t.riskLevel === 'high' || t.riskLevel === 'moderate');
      });
    });

    // Unique to each genome
    const unique = genomesVal.map((g, i) => {
      const onlyInThis = [...traitSets[i]].filter(id => !traitSets.some((s, j) => j !== i && s.has(id)));
      return { name: g.name, color: g.color, count: onlyInThis.length, traits: onlyInThis };
    });

    return { sharedAll: sharedAll.length, totalUnique: allTraitIds.size, pairwise, sharedRiskTraits: sharedRiskTraits.length, unique };
  });

  // Trait comparison — side by side risk levels
  let traitComparison = $derived.by(() => {
    if (genomeTraits.length < 2) return [];
    const allIds = new Set(genomeTraits.flatMap(t => t.map(tr => tr.id)));
    let items = [...allIds].map(id => {
      const perGenome = genomeTraits.map(traits => traits.find(t => t.id === id) || null);
      const name = perGenome.find(t => t)?.name || id;
      const cats = perGenome.find(t => t)?.categories || [];
      const genes = perGenome.find(t => t)?.genes || [];
      return { id, name, categories: cats, genes, perGenome };
    });

    if (filterCat) items = items.filter(t => t.categories.includes(filterCat));
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(t => t.name.toLowerCase().includes(q) || t.genes.some(g => g.toLowerCase().includes(q)));
    }
    if (diffOnly) {
      items = items.filter(t => {
        const levels = t.perGenome.filter(g => g).map(g => g.riskLevel);
        return new Set(levels).size > 1;
      });
    }
    // Sort: differences first, then by name
    items.sort((a, b) => {
      const aDiff = new Set(a.perGenome.filter(g => g).map(g => g.riskLevel)).size > 1 ? 0 : 1;
      const bDiff = new Set(b.perGenome.filter(g => g).map(g => g.riskLevel)).size > 1 ? 0 : 1;
      if (aDiff !== bDiff) return aDiff - bDiff;
      return a.name.localeCompare(b.name);
    });
    return items;
  });

  // Variant comparison (legacy)
  let variantComparison = $derived.by(() => {
    let result = allSnps;
    if (filterCat) result = result.filter(s => s.categories?.includes(filterCat));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.rsid.toLowerCase().includes(q) || s.gene?.toLowerCase().includes(q) || s.trait?.toLowerCase().includes(q));
    }
    result = result.filter(s => genomeMatches.some(m => m.map.has(s.rsid)));
    if (diffOnly) {
      result = result.filter(s => {
        const genos = genomeMatches.map(m => m.map.get(s.rsid)?.userGenotype).filter(Boolean);
        return new Set(genos).size > 1;
      });
    }
    return result;
  });

  const riskBg = { high: 'bg-red-100 text-red-700', moderate: 'bg-amber-100 text-amber-700', low: 'bg-green-100 text-green-700', carrier: 'bg-blue-100 text-blue-700', normal: 'bg-green-100 text-green-700' };
  const riskLabel = { high: 'Elevated', moderate: 'Moderate', low: 'Typical', carrier: 'Carrier', normal: 'Typical' };
  const riskColor = (l) => l === 'high' ? 'text-red-600' : l === 'moderate' ? 'text-amber-600' : l === 'carrier' ? 'text-blue-600' : 'text-green-600';
</script>

<svelte:head>
  <title>Compare Genomes — Telomere.ai</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
  <div class="flex items-start justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Compare Genomes</h1>
      <p class="text-sm text-[var(--color-text-tertiary)] mt-1">Side-by-side trait comparison across family members</p>
    </div>
    <a href="/upload" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-blue)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      Add Genome
    </a>
  </div>

  {#if !canCompareVal}
    <div class="rounded-xl border border-black/5 bg-white text-center py-16 space-y-4">
      <svg class="w-12 h-12 mx-auto text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
      <p class="text-[var(--color-text-secondary)]">Upload at least 2 genomes to compare</p>
      <p class="text-xs text-[var(--color-text-tertiary)]">Supports up to 6 genomes · Currently loaded: {genomesVal.length}</p>
      <a href="/upload" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent-blue)] text-white text-sm font-medium hover:opacity-90 transition-opacity">Upload Genome</a>
    </div>
  {:else}
    <!-- Genome pills -->
    <div class="flex flex-wrap gap-2">
      {#each genomesVal as g, i}
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/5 bg-white text-sm">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: {g.color}"></span>
          <span class="font-medium text-[var(--color-text-primary)]">{g.name}</span>
        </div>
      {/each}
    </div>

    <!-- Family Overlap Stats -->
    {#if overlapStats}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="rounded-xl border border-black/5 bg-white p-4 text-center">
          <p class="text-2xl font-bold text-[var(--color-accent-blue)]">{overlapStats.totalUnique}</p>
          <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Total Traits</p>
        </div>
        <div class="rounded-xl border border-black/5 bg-white p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{overlapStats.sharedAll}</p>
          <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Shared by All</p>
        </div>
        <div class="rounded-xl border border-black/5 bg-white p-4 text-center">
          <p class="text-2xl font-bold text-red-600">{overlapStats.sharedRiskTraits}</p>
          <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Shared Risk Traits</p>
        </div>
        <div class="rounded-xl border border-black/5 bg-white p-4 text-center">
          <p class="text-2xl font-bold text-amber-600">{overlapStats.totalUnique - overlapStats.sharedAll}</p>
          <p class="text-[11px] text-[var(--color-text-tertiary)] mt-1">Differ Between</p>
        </div>
      </div>

      <!-- Pairwise overlap bars -->
      <div class="rounded-xl border border-black/5 bg-white p-5 space-y-4">
        <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">Genetic Overlap</h2>
        {#each overlapStats.pairwise as pair}
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" style="background-color: {pair.colorA}"></span>
                <span class="text-[var(--color-text-secondary)]">{pair.a}</span>
                <span class="text-[var(--color-text-tertiary)]">↔</span>
                <span class="w-2 h-2 rounded-full" style="background-color: {pair.colorB}"></span>
                <span class="text-[var(--color-text-secondary)]">{pair.b}</span>
              </div>
              <span class="font-semibold text-[var(--color-text-primary)]">{pair.pct}% overlap</span>
            </div>
            <div class="h-2 rounded-full bg-black/5 overflow-hidden">
              <div class="h-full rounded-full bg-[var(--color-accent-blue)] transition-all" style="width: {pair.pct}%"></div>
            </div>
            <p class="text-[10px] text-[var(--color-text-tertiary)]">{pair.shared} shared traits out of {pair.total}</p>
          </div>
        {/each}
      </div>

      <!-- Unique traits per person -->
      {#if overlapStats.unique.some(u => u.count > 0)}
        <div class="rounded-xl border border-black/5 bg-white p-5 space-y-3">
          <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">Unique Traits</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each overlapStats.unique as u}
              <div class="flex items-center gap-2 py-2">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: {u.color}"></span>
                <span class="text-sm text-[var(--color-text-secondary)]">{u.name}</span>
                <span class="text-xs font-medium text-[var(--color-text-tertiary)] ml-auto">{u.count} unique</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}

    <!-- View mode toggle + filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex rounded-lg border border-black/10 overflow-hidden">
        <button onclick={() => viewMode = 'traits'} class="px-4 py-2 text-xs font-medium transition-colors {viewMode === 'traits' ? 'bg-blue-50 text-blue-700' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.02]'}">Traits</button>
        <button onclick={() => viewMode = 'variants'} class="px-4 py-2 text-xs font-medium transition-colors border-l border-black/10 {viewMode === 'variants' ? 'bg-blue-50 text-blue-700' : 'text-[var(--color-text-secondary)] hover:bg-black/[0.02]'}">Variants</button>
      </div>
      <div class="flex-1 relative">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" bind:value={search} placeholder="Search traits or genes..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200" />
      </div>
      <select bind:value={filterCat} class="px-3 py-2 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:border-blue-300">
        <option value="">All categories</option>
        {#each categories as cat}
          <option value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        {/each}
      </select>
      <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-black/10 bg-white text-sm cursor-pointer">
        <input type="checkbox" bind:checked={diffOnly} class="rounded" />
        <span class="text-[var(--color-text-secondary)]">Differences only</span>
      </label>
    </div>

    <!-- TRAIT COMPARISON VIEW -->
    {#if viewMode === 'traits'}
      <p class="text-xs text-[var(--color-text-tertiary)]">{traitComparison.length} trait{traitComparison.length !== 1 ? 's' : ''}</p>
      <div class="overflow-x-auto rounded-lg border border-black/5">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-black/[0.02]">
              <th class="text-left py-2.5 px-3 text-[11px] font-semibold text-[var(--color-text-tertiary)]">Trait</th>
              <th class="text-left py-2.5 px-3 text-[11px] font-semibold text-[var(--color-text-tertiary)] hidden sm:table-cell">Genes</th>
              {#each genomesVal as g}
                <th class="text-left py-2.5 px-3 text-[11px] font-semibold" style="color: {g.color}">{g.name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each traitComparison as item (item.id)}
              {@const levels = item.perGenome.filter(g => g).map(g => g.riskLevel)}
              {@const isDiff = new Set(levels).size > 1}
              <tr class="border-t border-black/[0.03] hover:bg-black/[0.02] transition-colors {isDiff ? 'bg-amber-50/50' : ''}">
                <td class="py-2.5 px-3">
                  <a href="/analysis/{item.id}" class="text-[var(--color-accent-blue)] hover:underline font-medium text-sm">{item.name}</a>
                </td>
                <td class="py-2.5 px-3 text-xs text-[var(--color-text-tertiary)] hidden sm:table-cell">{item.genes.slice(0, 3).join(', ')}</td>
                {#each genomesVal as g, i}
                  {@const t = item.perGenome[i]}
                  <td class="py-2.5 px-3">
                    {#if t}
                      <span class="text-[10px] font-medium px-2 py-0.5 rounded-full {riskBg[t.riskLevel] || 'bg-gray-100 text-gray-600'}">{riskLabel[t.riskLevel] || t.riskLevel}</span>
                    {:else}
                      <span class="text-[10px] text-[var(--color-text-tertiary)]">--</span>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

    <!-- VARIANT COMPARISON VIEW -->
    {:else}
      <p class="text-xs text-[var(--color-text-tertiary)]">{variantComparison.length} variant{variantComparison.length !== 1 ? 's' : ''}</p>
      <div class="overflow-x-auto rounded-lg border border-black/5">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-black/[0.02]">
              <th class="text-left py-2.5 px-3 text-[11px] font-semibold text-[var(--color-text-tertiary)]">rsID</th>
              <th class="text-left py-2.5 px-3 text-[11px] font-semibold text-[var(--color-text-tertiary)]">Gene</th>
              <th class="text-left py-2.5 px-3 text-[11px] font-semibold text-[var(--color-text-tertiary)] hidden sm:table-cell">Trait</th>
              {#each genomesVal as g}
                <th class="text-left py-2.5 px-3 text-[11px] font-semibold" style="color: {g.color}">{g.name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each variantComparison as snp (snp.rsid)}
              {@const genos = genomeMatches.map(m => m.map.get(snp.rsid))}
              {@const genotypes = genos.map(g => g?.userGenotype).filter(Boolean)}
              {@const isDiff = new Set(genotypes).size > 1}
              <tr class="border-t border-black/[0.03] hover:bg-black/[0.02] transition-colors {isDiff ? 'bg-amber-50/50' : ''}">
                <td class="py-2.5 px-3 font-mono text-xs text-[var(--color-accent-blue)]">{snp.rsid}</td>
                <td class="py-2.5 px-3 text-xs text-[var(--color-text-secondary)]">{snp.gene}</td>
                <td class="py-2.5 px-3 text-xs text-[var(--color-text-tertiary)] hidden sm:table-cell truncate max-w-[200px]">{snp.trait}</td>
                {#each genomesVal as g, i}
                  {@const match = genos[i]}
                  <td class="py-2.5 px-3">
                    {#if match}
                      <span class="font-mono text-xs font-semibold {riskColor(match.riskLevel)}">{match.userGenotype}</span>
                    {:else}
                      <span class="text-[10px] text-[var(--color-text-tertiary)]">--</span>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</section>
