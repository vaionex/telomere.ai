<script>
  import { page } from '$app/stores';
  import { lookupSnp } from '@telomere/snp-db';
  import { rawSnps, isLoaded } from '$lib/stores/genetic-data.js';
  import RiskGauge from '$lib/components/RiskGauge.svelte';

  const rsid = $derived($page.params.rsid);
  const snp = $derived(lookupSnp(rsid));
  const userData = $derived($rawSnps.get(rsid));
  const userGenotype = $derived(userData ? (userData.genotype || userData.allele1 + userData.allele2) : null);

  function getRiskLevel(snpInfo, genotype) {
    if (!snpInfo || !genotype) return null;
    const alleles = genotype.split('');
    const riskCount = alleles.filter(a => a === snpInfo.riskAllele).length;
    if (riskCount === 2) return { level: 'high', percent: 85 };
    if (riskCount === 1) return { level: 'moderate', percent: 55 };
    return { level: 'low', percent: 20 };
  }

  const risk = $derived(getRiskLevel(snp, userGenotype));
</script>

<svelte:head><title>{rsid} — {snp?.gene || 'SNP'} — Telomere AI</title></svelte:head>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <a href="/explore" class="text-text-tertiary hover:text-text-secondary text-sm mb-6 inline-block">← Back to Explorer</a>

  {#if !snp}
    <div class="card text-center py-12">
      <h1 class="text-2xl font-bold mb-2">SNP Not Found</h1>
      <p class="text-text-tertiary mb-4"><span class="font-mono">{rsid}</span> is not in our curated database.</p>
      <a href="/explore" class="btn-primary">Browse SNPs</a>
    </div>
  {:else}
    <!-- Header card -->
    <div class="card glow-border mb-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-2xl font-mono font-bold text-accent-cyan">{snp.rsid}</h1>
            <span class="px-2 py-0.5 rounded-full text-xs glass text-text-secondary">{snp.significance}</span>
          </div>
          <p class="text-lg font-semibold mb-1">{snp.gene} — {snp.trait}</p>
          <p class="text-text-tertiary text-sm">Chromosome {snp.chromosome} • Position {snp.position.toLocaleString()}</p>
        </div>
        {#if risk}
          <RiskGauge percent={risk.percent} size={80} label={risk.level} />
        {/if}
      </div>
    </div>

    <!-- Your genotype -->
    {#if userGenotype}
      <div class="card mb-6">
        <h2 class="font-semibold mb-3">Your Genotype</h2>
        <div class="flex items-center gap-4">
          <span class="text-4xl font-mono font-bold gradient-text">{userGenotype}</span>
          <div>
            <p class="text-sm {risk?.level === 'high' ? 'text-accent-red' : risk?.level === 'moderate' ? 'text-accent-amber' : 'text-accent-green'}">
              {risk?.level === 'high' ? snp.riskDescription : risk?.level === 'moderate' ? snp.heterozygousDescription : snp.normalDescription}
            </p>
          </div>
        </div>
      </div>
    {:else if $isLoaded}
      <div class="card mb-6 text-center">
        <p class="text-text-tertiary text-sm">This SNP was not found in your genetic data.</p>
      </div>
    {/if}

    <!-- Details -->
    <div class="grid gap-6">
      <!-- Alleles -->
      <div class="card">
        <h2 class="font-semibold mb-3">Allele Information</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-text-tertiary">Risk Allele</span>
            <p class="font-mono text-lg text-accent-red font-bold">{snp.riskAllele}</p>
          </div>
          <div>
            <span class="text-text-tertiary">Normal Allele</span>
            <p class="font-mono text-lg text-accent-green font-bold">{snp.normalAllele}</p>
          </div>
        </div>
      </div>

      <!-- Population frequency -->
      <div class="card">
        <h2 class="font-semibold mb-3">Population Frequency</h2>
        <div class="space-y-3">
          {#each Object.entries(snp.populationFrequency) as [genotype, freq]}
            {@const pct = Math.round(freq * 100)}
            {@const isUser = userGenotype === genotype}
            <div class="flex items-center gap-3">
              <span class="font-mono text-sm w-8 {isUser ? 'text-accent-cyan font-bold' : 'text-text-secondary'}">{genotype}</span>
              <div class="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700 {isUser ? 'bg-gradient-to-r from-accent-cyan to-accent-blue' : 'bg-white/10'}" style="width: {pct}%"></div>
              </div>
              <span class="text-sm text-text-secondary w-12 text-right">{pct}%</span>
              {#if isUser}<span class="text-xs text-accent-cyan">You</span>{/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Conditions -->
      {#if snp.conditions?.length}
        <div class="card">
          <h2 class="font-semibold mb-3">Associated Conditions</h2>
          <ul class="space-y-2">
            {#each snp.conditions as condition}
              <li class="flex items-center gap-2 text-sm text-text-secondary">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0"></span>
                {condition}
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Recommendations -->
      {#if snp.recommendations?.length}
        <div class="card">
          <h2 class="font-semibold mb-3">Recommendations</h2>
          <ul class="space-y-2">
            {#each snp.recommendations as rec}
              <li class="flex items-start gap-2 text-sm text-text-secondary">
                <span class="text-accent-green mt-0.5">✓</span>
                {rec}
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Categories -->
      <div class="card">
        <h2 class="font-semibold mb-3">Categories</h2>
        <div class="flex gap-2 flex-wrap">
          {#each snp.categories as cat}
            <a href="/explore?category={cat}" class="px-3 py-1.5 rounded-full glass text-sm text-text-secondary hover:text-accent-cyan transition-colors">{cat}</a>
          {/each}
        </div>
      </div>

      <!-- References -->
      {#if snp.references?.length}
        <div class="card">
          <h2 class="font-semibold mb-3">References</h2>
          <div class="space-y-1">
            {#each snp.references as ref}
              {#if ref.startsWith('PMID:')}
                <a href="https://pubmed.ncbi.nlm.nih.gov/{ref.replace('PMID:', '')}" target="_blank" rel="noopener" class="block text-sm text-accent-blue hover:underline font-mono">{ref}</a>
              {:else}
                <span class="block text-sm text-text-secondary font-mono">{ref}</span>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
