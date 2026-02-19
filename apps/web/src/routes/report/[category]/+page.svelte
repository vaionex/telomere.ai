<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import { reportsByCategory, categoryMeta } from '$lib/stores/reports.js';
  import SnpCard from '$lib/components/SnpCard.svelte';
  import { get } from 'svelte/store';

  let category = $derived($page.params.category);
  let meta = $derived(categoryMeta[category]);
  let loaded = $state(false);
  let findings = $state([]);

  $effect(() => {
    if (!get(isLoaded)) { goto('/upload'); return; }
    loaded = true;
    const byCat = get(reportsByCategory);
    findings = [...(byCat[category] || [])].sort((a, b) => b.riskPercent - a.riskPercent);
  });
</script>

<svelte:head>
  <title>{meta?.title || 'Report'} — Genetic Report | Telomere.ai</title>
  {#if meta}
    <meta name="description" content="{meta.title}: {meta.description}. Personalized genetic analysis at Telomere.ai." />
  {/if}
  <meta name="robots" content="noindex" />
</svelte:head>

{#if loaded && meta}
<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
  <div class="flex items-center gap-3">
    <a href="/dashboard" class="text-text-tertiary hover:text-text-primary transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </a>
    <div>
      <h1 class="text-2xl font-bold text-text-primary">{meta.title}</h1>
      <p class="text-sm text-text-secondary">{meta.description}</p>
    </div>
  </div>

  {#if findings.length === 0}
    <div class="card text-center py-12">
      <p class="text-text-secondary">No findings in this category for your genome.</p>
      <a href="/dashboard" class="text-accent-blue text-sm mt-2 inline-block hover:underline">Back to dashboard</a>
    </div>
  {:else}
    <p class="text-sm text-text-tertiary">{findings.length} variant{findings.length !== 1 ? 's' : ''} found — sorted by risk level</p>
    <div class="space-y-3">
      {#each findings as snp (snp.rsid)}
        <SnpCard {snp} />
      {/each}
    </div>
  {/if}
</section>
{/if}
