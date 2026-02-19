<script>
  import { reportsByCategory } from '$lib/stores/reports.js';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import ReportSection from '$lib/components/ReportSection.svelte';
  const findings = $derived($reportsByCategory['carrier'] || []);
</script>

<svelte:head><title>Carrier Status Report — Telomere AI</title></svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="mb-8">
    <a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a>
    <div class="flex items-center gap-3 mb-2">
      <span class="text-3xl">🧪</span>
      <h1 class="text-3xl font-bold">Carrier Status</h1>
    </div>
    <p class="text-text-secondary">Recessive condition carrier screening for cystic fibrosis, sickle cell disease, Tay-Sachs, hearing loss, PKU, SMA, and other conditions relevant to family planning.</p>
  </div>

  {#if !$isLoaded}
    <div class="card text-center py-12">
      <p class="text-text-tertiary mb-4">No genetic data loaded.</p>
      <a href="/upload" class="btn-primary">Open File</a>
    </div>
  {:else}
    <div class="card mb-8 bg-accent-amber/5 border-accent-amber/20">
      <p class="text-sm text-text-secondary"><strong class="text-accent-amber">🧬 Family Planning Note:</strong> Being a carrier of a recessive condition typically means you are unaffected but could pass the variant to your children. If both parents carry the same recessive mutation, each child has a 25% chance of being affected. Genetic counseling is recommended if carrier status is identified.</p>
    </div>

    <ReportSection title="Carrier Status Findings" description="Recessive condition carrier variants" icon="🧪" snps={findings} />
  {/if}
</div>
