<script>
  let { percent = 50, size = 80, label = '' } = $props();
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = $derived(circumference - (percent / 100) * circumference);
  const color = $derived(percent >= 70 ? '#EF4444' : percent >= 40 ? '#F59E0B' : '#10B981');
</script>

<div class="inline-flex flex-col items-center gap-1">
  <svg width={size} height={size} viewBox="0 0 80 80" class="transform -rotate-90">
    <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="6"/>
    <circle cx="40" cy="40" r={radius} fill="none" stroke={color} stroke-width="6"
      stroke-dasharray={circumference} stroke-dashoffset={offset}
      stroke-linecap="round" class="transition-all duration-1000 ease-out"
      style="filter: drop-shadow(0 0 6px {color}80)"/>
  </svg>
  <span class="text-xs font-mono" style="color: {color}">{percent}%</span>
  {#if label}<span class="text-xs text-text-tertiary">{label}</span>{/if}
</div>
