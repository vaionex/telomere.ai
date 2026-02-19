<script>
  import { reportsByCategory } from '$lib/stores/reports.js';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import ReportSection from '$lib/components/ReportSection.svelte';
  const findings = $derived($reportsByCategory['longevity'] || []);
</script>

<svelte:head><title>Longevity & Aging Report — Telomere AI</title></svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="mb-8">
    <a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a>
    <div class="flex items-center gap-3 mb-2">
      <span class="text-3xl">🧬</span>
      <h1 class="text-3xl font-bold">Longevity & Aging</h1>
    </div>
    <p class="text-text-secondary">Telomere length variants, FOXO3 longevity gene, APOE status, sirtuins, oxidative stress defense, and other aging-related markers.</p>
  </div>

  {#if !$isLoaded}
    <div class="card text-center py-12">
      <p class="text-text-tertiary mb-4">No genetic data loaded.</p>
      <a href="/upload" class="btn-primary">Open File</a>
    </div>
  {:else}
    <div class="card mb-8 p-6 glow-border">
      <h3 class="font-semibold mb-2 gradient-text">About Longevity Genetics</h3>
      <p class="text-text-secondary text-sm">Longevity is highly polygenic — influenced by hundreds of genetic variants plus lifestyle. Key pathways include telomere maintenance (TERT, TERC), stress resistance (FOXO3), lipoprotein metabolism (APOE, CETP), inflammation (IL-6, TNF-α), and cellular repair (SIRT1, SOD2). Your genetic variants in these pathways interact with diet, exercise, sleep, and stress management.</p>
    </div>

    <ReportSection title="Longevity Findings" description="Variants associated with biological aging and lifespan" icon="🧬" snps={findings} />
  {/if}
</div>
