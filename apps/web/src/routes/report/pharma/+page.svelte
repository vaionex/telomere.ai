<script>
  import { reportsByCategory } from '$lib/stores/reports.js';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import ReportSection from '$lib/components/ReportSection.svelte';
  const findings = $derived($reportsByCategory['pharma'] || []);
</script>

<svelte:head><title>Pharmacogenomics Report — Telomere AI</title></svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="mb-8">
    <a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a>
    <div class="flex items-center gap-3 mb-2">
      <span class="text-3xl">💊</span>
      <h1 class="text-3xl font-bold">Pharmacogenomics</h1>
    </div>
    <p class="text-text-secondary">Drug metabolism enzymes (CYP2D6, CYP2C19, CYP2C9), warfarin sensitivity, statin myopathy risk, and medication response predictions.</p>
  </div>

  {#if !$isLoaded}
    <div class="card text-center py-12">
      <p class="text-text-tertiary mb-4">No genetic data loaded.</p>
      <a href="/upload" class="btn-primary">Open File</a>
    </div>
  {:else}
    <div class="card mb-8 bg-accent-violet/5 border-accent-violet/20">
      <p class="text-sm text-text-secondary"><strong class="text-accent-violet">💊 Clinical Note:</strong> Pharmacogenomic results should be shared with your healthcare provider. Many drugs have FDA pharmacogenomic labels, and your prescriber can use this information to optimize dosing and drug selection. Consider requesting a formal pharmacogenomic consultation.</p>
    </div>

    <ReportSection title="Drug Metabolism Findings" description="Variants affecting how you metabolize medications" icon="💊" snps={findings} />
  {/if}
</div>
