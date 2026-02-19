<script>
  import RiskGauge from './RiskGauge.svelte';
  let { snp } = $props();
  const borderColor = $derived(snp.riskLevel === 'high' ? 'border-l-accent-red' : snp.riskLevel === 'moderate' ? 'border-l-accent-amber' : 'border-l-accent-green');
  const desc = $derived(snp.riskLevel === 'high' ? snp.riskDescription : snp.riskLevel === 'moderate' ? (snp.heterozygousDescription || snp.riskDescription) : snp.normalDescription);
</script>

<a href="/snp/{snp.rsid}" class="card border-l-4 {borderColor} flex items-start gap-4 group">
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-3 mb-1">
      <span class="font-mono text-accent-cyan text-sm">{snp.rsid}</span>
      <span class="text-text-secondary text-sm">{snp.gene}</span>
      <span class="px-2 py-0.5 rounded-full text-xs glass {snp.riskLevel === 'high' ? 'text-accent-red' : snp.riskLevel === 'moderate' ? 'text-accent-amber' : 'text-accent-green'}">{snp.riskLevel}</span>
    </div>
    <h3 class="font-semibold text-sm mb-1 group-hover:text-accent-cyan transition-colors">{snp.trait}</h3>
    <p class="text-text-secondary text-xs leading-relaxed">{desc}</p>
    {#if snp.userGenotype}
      <div class="mt-2 flex items-center gap-2">
        <span class="text-xs text-text-tertiary">Your genotype:</span>
        <span class="font-mono text-sm font-bold text-accent-cyan">{snp.userGenotype}</span>
      </div>
    {/if}
  </div>
  <RiskGauge percent={snp.riskPercent} size={64} />
</a>
