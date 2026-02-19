<script>
  import { reportsByCategory } from '$lib/stores/reports.js';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import ReportSection from '$lib/components/ReportSection.svelte';
  const findings = $derived($reportsByCategory['traits'] || []);
</script>

<svelte:head><title>Physical Traits Report — Telomere AI</title></svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="mb-8">
    <a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a>
    <div class="flex items-center gap-3 mb-2">
      <span class="text-3xl">👤</span>
      <h1 class="text-3xl font-bold">Physical Traits</h1>
    </div>
    <p class="text-text-secondary">Eye color, hair color, muscle fiber type, sleep chronotype, taste perception, empathy, and other genetically-influenced traits.</p>
  </div>

  {#if !$isLoaded}
    <div class="card text-center py-12">
      <p class="text-text-tertiary mb-4">No genetic data loaded.</p>
      <a href="/upload" class="btn-primary">Open File</a>
    </div>
  {:else}
    <ReportSection title="Trait Findings" description="Variants associated with physical and behavioral traits" icon="👤" snps={findings} />
  {/if}
</div>
