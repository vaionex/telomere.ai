<script>
  import { genomes, activeGenomeIndex, compareMode, canCompare, setActiveGenome, removeGenome, renameGenome } from '$lib/stores/genetic-data.js';
  import { goto } from '$app/navigation';

  let editingIdx = $state(null);
  let editName = $state('');

  function startEdit(idx) {
    editingIdx = idx;
    editName = $genomes[idx]?.name || '';
    // Focus input on next tick
    setTimeout(() => document.getElementById(`genome-name-${idx}`)?.focus(), 10);
  }

  function finishEdit(idx) {
    if (editName.trim()) renameGenome(idx, editName.trim());
    editingIdx = null;
  }

  function handleAdd() {
    goto('/upload');
  }
</script>

{#if $genomes.length > 0}
  <div class="flex items-center gap-2 flex-wrap">
    {#each $genomes as genome, idx (genome.id)}
      <div class="relative group">
        {#if editingIdx === idx}
          <input
            id="genome-name-{idx}"
            type="text"
            bind:value={editName}
            class="h-9 px-3 rounded-lg bg-white/10 border border-white/20 text-sm text-text-primary focus:outline-none focus:border-accent-cyan w-28"
            onblur={() => finishEdit(idx)}
            onkeydown={(e) => { if (e.key === 'Enter') finishEdit(idx); if (e.key === 'Escape') editingIdx = null; }}
          />
        {:else}
          <button
            class="h-9 px-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
              {$activeGenomeIndex === idx ? 'bg-white/10 border border-white/20 text-text-primary' : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'}"
            onclick={() => setActiveGenome(idx)}
            ondblclick={() => startEdit(idx)}
            title="Click to view • Double-click to rename"
          >
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background: {genome.color}"></span>
            <span class="max-w-24 truncate">{genome.name}</span>
            {#if $genomes.length > 1}
              <button
                class="ml-1 w-4 h-4 rounded-full text-text-tertiary hover:text-accent-red hover:bg-red-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onclick={(e) => { e.stopPropagation(); removeGenome(idx); }}
                title="Remove"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            {/if}
          </button>
        {/if}
      </div>
    {/each}

    <!-- Add another -->
    {#if $genomes.length < 5}
      <button
        class="h-9 px-3 rounded-lg text-sm text-text-tertiary hover:text-accent-cyan hover:bg-white/5 flex items-center gap-1.5 transition-colors border border-dashed border-white/10 hover:border-accent-cyan/30"
        onclick={handleAdd}
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Genome
      </button>
    {/if}

    <!-- Compare toggle -->
    {#if $canCompare}
      <div class="ml-auto">
        <button
          class="h-9 px-3 rounded-lg text-sm flex items-center gap-2 transition-all
            {$compareMode ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30' : 'text-text-tertiary hover:text-text-secondary hover:bg-white/5'}"
          onclick={() => compareMode.update(v => !v)}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
          </svg>
          Compare
        </button>
      </div>
    {/if}
  </div>
{/if}
