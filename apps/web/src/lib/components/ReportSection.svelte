<script>
  import SnpCard from './SnpCard.svelte';
  let { title = '', description = '', icon = '', snps = [], color = 'accent-cyan' } = $props();
</script>

<section class="space-y-6">
  <div class="flex items-center gap-3">
    {#if icon}<span class="text-2xl">{icon}</span>{/if}
    <div>
      <h2 class="text-xl font-bold">{title}</h2>
      {#if description}<p class="text-text-secondary text-sm">{description}</p>{/if}
    </div>
  </div>

  {#if snps.length > 0}
    <div class="space-y-3">
      {#each snps as snp (snp.rsid)}
        <SnpCard {snp} />
      {/each}
    </div>
  {:else}
    <div class="card text-center py-8">
      <p class="text-text-tertiary">No matching SNPs found in your data for this category.</p>
      <p class="text-text-tertiary text-sm mt-1">Upload your genetic data to see results.</p>
    </div>
  {/if}
</section>
