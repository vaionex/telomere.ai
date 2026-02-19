<script>
  import RiskGauge from './RiskGauge.svelte';

  let { variants = [], emptyMessage = 'No variants found.' } = $props();
  let expandedSnp = $state(null);

  function toggle(rsid) { expandedSnp = expandedSnp === rsid ? null : rsid; }

  function riskBg(level) {
    return level === 'high' ? 'bg-red-500/10 text-red-400' : level === 'moderate' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400';
  }
</script>

{#if variants.length === 0}
  <div class="text-center py-12 card">
    <p class="text-text-tertiary">{emptyMessage}</p>
    <a href="/upload" class="btn-primary mt-4 inline-block">Open File</a>
  </div>
{:else}
  <div class="space-y-1.5">
    {#each variants as snp (snp.rsid)}
      <button class="w-full text-left" onclick={() => toggle(snp.rsid)}>
        <div class="rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all {expandedSnp === snp.rsid ? 'border-accent-cyan/30 bg-white/[0.04]' : ''}">
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="w-2 h-2 rounded-full flex-shrink-0 {snp.riskLevel === 'high' ? 'bg-red-400' : snp.riskLevel === 'moderate' ? 'bg-amber-400' : 'bg-emerald-400'}"></div>
            <span class="font-mono text-accent-cyan text-sm w-28 flex-shrink-0">{snp.rsid}</span>
            <span class="text-text-secondary text-sm w-20 flex-shrink-0 hidden sm:block">{snp.gene}</span>
            <span class="text-sm text-text-primary flex-1 min-w-0 truncate">{snp.trait}</span>
            <span class="font-mono text-sm font-bold text-accent-cyan w-8 text-center flex-shrink-0">{snp.userGenotype}</span>
            <span class="px-2 py-0.5 rounded text-xs flex-shrink-0 hidden sm:inline {riskBg(snp.riskLevel)}">{snp.riskLevel}</span>
            <svg class="w-4 h-4 text-text-tertiary transition-transform flex-shrink-0 {expandedSnp === snp.rsid ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>

          {#if expandedSnp === snp.rsid}
            <div class="px-4 pb-4 pt-2 border-t border-white/5 space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <div class="flex items-center gap-3">
                    <RiskGauge percent={snp.riskPercent} size={56} />
                    <div>
                      <span class="font-mono text-2xl font-bold gradient-text">{snp.userGenotype}</span>
                      <p class="text-xs text-text-tertiary">Chr{snp.chromosome}:{snp.position?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="flex gap-4 text-sm">
                    <div><span class="text-text-tertiary text-xs">Risk allele</span><br/><span class="font-mono text-accent-red font-bold">{snp.riskAllele}</span></div>
                    <div><span class="text-text-tertiary text-xs">Normal allele</span><br/><span class="font-mono text-accent-green font-bold">{snp.normalAllele}</span></div>
                  </div>
                </div>
              </div>

              <p class="text-sm text-text-secondary leading-relaxed">
                {snp.riskLevel === 'high' ? snp.riskDescription : snp.riskLevel === 'moderate' ? (snp.heterozygousDescription || snp.riskDescription) : snp.normalDescription}
              </p>

              {#if snp.populationFrequency}
                <div>
                  <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">Population Frequency</h4>
                  <div class="space-y-1">
                    {#each Object.entries(snp.populationFrequency) as [gt, freq]}
                      {@const pct = Math.round(freq * 100)}
                      {@const isYou = snp.userGenotype === gt}
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-xs w-6 {isYou ? 'text-accent-cyan font-bold' : 'text-text-tertiary'}">{gt}</span>
                        <div class="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div class="h-full rounded-full {isYou ? 'bg-accent-cyan' : 'bg-white/10'}" style="width: {pct}%"></div>
                        </div>
                        <span class="text-xs text-text-tertiary w-10 text-right">{pct}%</span>
                        {#if isYou}<span class="text-xs text-accent-cyan">You</span>{/if}
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if snp.conditions?.length}
                <div>
                  <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Associated Conditions</h4>
                  <div class="flex flex-wrap gap-1">
                    {#each snp.conditions as c}<span class="px-2 py-0.5 rounded text-xs glass text-text-secondary">{c}</span>{/each}
                  </div>
                </div>
              {/if}

              {#if snp.recommendations?.length}
                <div>
                  <h4 class="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Recommendations</h4>
                  <ul class="space-y-0.5">
                    {#each snp.recommendations as rec}
                      <li class="text-xs text-text-secondary flex items-start gap-1.5"><span class="text-accent-green">&#10003;</span> {rec}</li>
                    {/each}
                  </ul>
                </div>
              {/if}

              <div class="flex items-center justify-between pt-1">
                <div class="flex gap-2">
                  {#each (snp.references || []) as ref}
                    {#if ref.startsWith('PMID:')}
                      <a href="https://pubmed.ncbi.nlm.nih.gov/{ref.replace('PMID:', '')}" target="_blank" rel="noopener"
                        class="text-xs font-mono text-accent-blue hover:underline" onclick={(e) => e.stopPropagation()}>{ref}</a>
                    {/if}
                  {/each}
                </div>
                <a href="/snp/{snp.rsid}" class="text-xs text-accent-cyan hover:underline" onclick={(e) => e.stopPropagation()}>Full details →</a>
              </div>
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
{/if}
