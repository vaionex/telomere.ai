<script>
  import { reportsByCategory } from '$lib/stores/reports.js';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import ReportSection from '$lib/components/ReportSection.svelte';

  const findings = $derived($reportsByCategory['health'] || []);
</script>

<svelte:head><title>Health Risks Report — Telomere AI</title></svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="mb-8">
    <a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-4 inline-block">← Back to Dashboard</a>
    <div class="flex items-center gap-3 mb-2">
      <span class="text-3xl">🏥</span>
      <h1 class="text-3xl font-bold">Health Risks</h1>
    </div>
    <p class="text-text-secondary">Cardiovascular, cancer, diabetes, thrombophilia, and other health risk factors identified in your genetic data.</p>
  </div>

  {#if !$isLoaded}
    <div class="card text-center py-12">
      <p class="text-text-tertiary mb-4">No genetic data loaded.</p>
      <a href="/upload" class="btn-primary">Open File</a>
    </div>
  {:else}
    <div class="space-y-4 mb-8">
      <div class="grid grid-cols-3 gap-4">
        <div class="card text-center">
          <div class="text-2xl font-bold text-accent-red">{findings.filter(f => f.riskLevel === 'high').length}</div>
          <div class="text-xs text-text-tertiary">High Risk</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-accent-amber">{findings.filter(f => f.riskLevel === 'moderate').length}</div>
          <div class="text-xs text-text-tertiary">Moderate</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-accent-green">{findings.filter(f => f.riskLevel === 'low').length}</div>
          <div class="text-xs text-text-tertiary">Low Risk</div>
        </div>
      </div>
    </div>

    <ReportSection title="Health Risk Findings" description="SNPs associated with disease risk and health conditions" icon="🏥" snps={findings} />

    <div class="mt-8 card bg-accent-amber/5 border-accent-amber/20">
      <p class="text-sm text-text-secondary"><strong class="text-accent-amber">⚠️ Important:</strong> These results are for informational purposes only. Having a risk allele does not mean you will develop a condition. Always consult with a healthcare provider or genetic counselor for medical advice.</p>
    </div>
  {/if}
</div>
