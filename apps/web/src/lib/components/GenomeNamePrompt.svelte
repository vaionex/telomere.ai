<script>
  let { onSubmit } = $props();
  
  let name = $state('');
  let suggestions = ['Me', 'Partner', 'Mom', 'Dad', 'Child', 'Sibling'];

  function submit() {
    onSubmit(name.trim() || 'Genome');
  }

  function pick(s) {
    name = s;
    onSubmit(s);
  }
</script>

<div class="max-w-md mx-auto text-center space-y-5">
  <div class="w-16 h-16 mx-auto rounded-2xl bg-accent-green/10 flex items-center justify-center">
    <svg class="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
  </div>
  
  <div>
    <h2 class="text-xl font-bold">File parsed successfully</h2>
    <p class="text-text-secondary text-sm mt-1">Give this genome a name so you can compare with family members later.</p>
  </div>

  <div>
    <input
      type="text"
      bind:value={name}
      placeholder="Enter a name..."
      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-lg font-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan/40 transition-colors"
      onkeydown={(e) => e.key === 'Enter' && submit()}
      autofocus
    />
  </div>

  <div class="flex items-center justify-center gap-2 flex-wrap">
    {#each suggestions as s}
      <button
        class="px-3 py-1.5 rounded-lg text-sm glass text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/30 transition-colors"
        onclick={() => pick(s)}
      >{s}</button>
    {/each}
  </div>

  <button class="btn-primary w-full justify-center" onclick={submit}>
    View Results
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
  </button>
</div>
