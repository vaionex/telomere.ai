<script>
  import { SNP_MAP } from '@telomere/snp-db';
  import { categoryMeta } from '$lib/stores/reports.js';
  import RiskGauge from './RiskGauge.svelte';

  let { matches = [], totalVariants = 0, done = false, onFinish = () => {} } = $props();

  function assessRisk(snpInfo, genotype) {
    const alleles = genotype.split('');
    const riskCount = alleles.filter(a => a === snpInfo.riskAllele).length;
    if (riskCount === 2) return 'high';
    if (riskCount === 1) return 'moderate';
    return 'low';
  }

  const enriched = $derived(matches.map(m => {
    const db = SNP_MAP.get(m.rsid);
    if (!db) return null;
    const riskLevel = assessRisk(db, m.genotype);
    return {
      ...db,
      userGenotype: m.genotype,
      riskLevel,
      riskPercent: riskLevel === 'high' ? 85 : riskLevel === 'moderate' ? 55 : 20
    };
  }).filter(Boolean));

  const categoryCounts = $derived(() => {
    const counts = {};
    for (const snp of enriched) {
      for (const cat of snp.categories) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  });

  const riskBorderColor = (level) =>
    level === 'high' ? 'border-l-accent-red' : level === 'moderate' ? 'border-l-accent-amber' : 'border-l-accent-green';

  const riskDesc = (snp) =>
    snp.riskLevel === 'high' ? snp.riskDescription : snp.riskLevel === 'moderate' ? (snp.heterozygousDescription || snp.riskDescription) : snp.normalDescription;
</script>

<div class="space-y-6 animate-in">
  <!-- Category pills -->
  {#if enriched.length > 0}
    <div class="flex flex-wrap gap-2 justify-center">
      {#each Object.entries(categoryCounts()) as [cat, count]}
        {@const meta = categoryMeta[cat]}
        {#if meta}
          <span class="px-3 py-1.5 rounded-full text-xs glass flex items-center gap-1.5">
            <span>{meta.icon}</span>
            <span class="text-text-secondary">{meta.title}:</span>
            <span class="font-bold text-text-primary">{count}</span>
          </span>
        {/if}
      {/each}
    </div>
  {/if}

  <!-- Live match list -->
  <div class="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
    {#each enriched as snp, i (snp.rsid)}
      <a href="/snp/{snp.rsid}"
        class="card border-l-4 {riskBorderColor(snp.riskLevel)} flex items-start gap-4 group opacity-0 slide-in"
        style="animation-delay: {Math.min(i * 40, 400)}ms"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <span class="font-mono text-accent-cyan text-sm">{snp.rsid}</span>
            <span class="text-text-secondary text-sm">{snp.gene}</span>
            <span class="px-2 py-0.5 rounded-full text-xs glass {snp.riskLevel === 'high' ? 'text-accent-red' : snp.riskLevel === 'moderate' ? 'text-accent-amber' : 'text-accent-green'}">{snp.riskLevel}</span>
          </div>
          <h3 class="font-semibold text-sm mb-1 group-hover:text-accent-cyan transition-colors">{snp.trait}</h3>
          <p class="text-text-secondary text-xs leading-relaxed">{riskDesc(snp)}</p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-xs text-text-tertiary">Your genotype:</span>
            <span class="font-mono text-sm font-bold text-accent-cyan">{snp.userGenotype}</span>
          </div>
        </div>
        <RiskGauge percent={snp.riskPercent} size={64} />
      </a>
    {/each}
  </div>

  <!-- Completion banner -->
  {#if done}
    <div class="card text-center space-y-4 bg-accent-green/5 border-accent-green/20">
      <div class="w-12 h-12 mx-auto rounded-xl bg-accent-green/10 flex items-center justify-center">
        <svg class="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div>
        <p class="text-text-primary font-semibold">Scan complete</p>
        <p class="text-text-secondary text-sm">{totalVariants.toLocaleString()} variants scanned · {enriched.length} SNPs matched</p>
      </div>
      <button
        class="px-6 py-2.5 rounded-xl bg-accent-cyan text-black font-semibold text-sm hover:bg-accent-cyan/90 transition-colors"
        onclick={onFinish}
      >
        View Full Dashboard →
      </button>
    </div>
  {:else if enriched.length === 0}
    <div class="text-center text-text-tertiary text-sm py-4">
      <span class="inline-block animate-pulse">Waiting for first matches...</span>
    </div>
  {/if}
</div>

<style>
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }
</style>
