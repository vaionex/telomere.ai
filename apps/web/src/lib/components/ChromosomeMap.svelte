<script>
  let { chromosomes = new Set() } = $props();
  const chrList = [...Array(22).keys()].map(i => String(i + 1)).concat(['X', 'Y']);
  const sizes = [249,243,198,191,182,171,159,145,138,134,135,133,114,107,102,90,83,80,59,64,47,51,156,57];
</script>

<div class="flex flex-wrap gap-2 items-end justify-center">
  {#each chrList as chr, i}
    {@const active = chromosomes.has(chr)}
    {@const h = Math.max(20, (sizes[i] / 249) * 60)}
    <div class="flex flex-col items-center gap-1 group cursor-default" title="Chromosome {chr}">
      <div
        class="w-3 rounded-full transition-all duration-200"
        style="height: {h}px; background: {active ? 'linear-gradient(to top, #00E5CC, #3B82F6)' : 'rgba(255,255,255,0.08)'}; box-shadow: {active ? '0 0 8px rgba(0,229,204,0.4)' : 'none'}"
      ></div>
      <span class="text-[10px] font-mono {active ? 'text-accent-cyan' : 'text-text-tertiary'}">{chr}</span>
    </div>
  {/each}
</div>
