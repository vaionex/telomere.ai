<script>
  import { reportsByCategory, categoryMeta } from '$lib/stores/reports.js';
  import { isLoaded } from '$lib/stores/genetic-data.js';
  import VariantList from '$lib/components/VariantList.svelte';

  const CAT = 'health';
  const meta = categoryMeta[CAT];
  const findings = $derived($reportsByCategory[CAT] || []);
  const highCount = $derived(findings.filter(f => f.riskLevel === 'high').length);
  const modCount = $derived(findings.filter(f => f.riskLevel === 'moderate').length);
</script>

<svelte:head><title>{meta.title} — Telomere AI</title></svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <a href="/dashboard" class="text-text-tertiary hover:text-text-secondary text-sm mb-6 inline-flex items-center gap-1">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    Back to Dashboard
  </a>

  <div class="flex items-start gap-4 mb-8">
    <div class="w-14 h-14 rounded-2xl glass flex items-center justify-center text-3xl flex-shrink-0">{meta.icon}</div>
    <div>
      <h1 class="text-2xl font-bold">{meta.title}</h1>
      <p class="text-text-secondary text-sm mt-1">{meta.description}</p>
    </div>
  </div>

  {#if $isLoaded && findings.length > 0}
    <div class="flex items-center gap-3 mb-6">
      <span class="text-sm text-text-secondary">{findings.length} variants found</span>
      {#if highCount > 0}<span class="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400">{highCount} high risk</span>{/if}
      {#if modCount > 0}<span class="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400">{modCount} moderate</span>{/if}
    </div>
  {/if}

  <VariantList variants={findings} emptyMessage={$isLoaded ? `No ${meta.title.toLowerCase()} variants found in your data.` : 'Load your genetic data to see results.'} />

  <div class="mt-8 rounded-xl bg-white/[0.02] border border-white/5 p-4">
    <p class="text-xs text-text-tertiary leading-relaxed">
      <strong class="text-text-secondary">Note:</strong> These results are for informational purposes only. 
      Having a risk variant does not mean you will develop a condition. Always consult a healthcare professional for medical advice.
    </p>
  </div>
</div>
