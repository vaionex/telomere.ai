<script>
  import { page } from '$app/stores';
  import { genomes, activeGenomeIndex, canCompare, compareMode, setActiveGenome, removeGenome, renameGenome, isLoaded } from '$lib/stores/genetic-data.js';
  import { activeSection } from '$lib/stores/navigation.js';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let editingIdx = $state(null);
  let editName = $state('');
  let currentPath = $state('');

  const unsub = page.subscribe(p => { currentPath = p.url?.pathname || ''; });

  function startEdit(idx) {
    editingIdx = idx;
    editName = $genomes[idx]?.name || '';
    setTimeout(() => document.getElementById(`sidebar-genome-${idx}`)?.focus(), 10);
  }

  function finishEdit(idx) {
    if (editName.trim()) renameGenome(idx, editName.trim());
    editingIdx = null;
  }

  // Keyboard shortcuts
  function handleKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      goto('/upload');
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown);
  }

  let currentSection = $state('overview');
  const sectionUnsub = activeSection.subscribe(v => { currentSection = v; });
  let dataLoaded = $state(false);
  const loadedUnsub = isLoaded.subscribe(v => { dataLoaded = v; });

  const navItems = [
    { path: '/upload', label: 'Open File', icon: 'upload' },
    { path: '/analysis', label: 'Analysis', icon: 'analysis' },
    { path: '/compare', label: 'Compare', icon: 'compare', needsCompare: true },
    { path: '/explore', label: 'Explore SNPs', icon: 'explore' },
  ];

  const analysisSections = [
    { id: 'overview', label: 'Overview', emoji: '📊' },
    { id: 'health', label: 'Health Risks', emoji: '🏥' },
    { id: 'pharma', label: 'Pharmacogenomics', emoji: '💊' },
    { id: 'nutrition', label: 'Nutrigenomics', emoji: '🥗' },
    { id: 'traits', label: 'Traits', emoji: '👤' },
    { id: 'longevity', label: 'Longevity', emoji: '🧬' },
    { id: 'carrier', label: 'Carrier Status', emoji: '🧪' },
    { id: 'riskscores', label: 'Risk Scores', emoji: '📈' },
  ];

  function isActive(path) {
    if (path === '/analysis') return currentPath.startsWith('/analysis') || currentPath.startsWith('/report');
    return currentPath === path || currentPath.startsWith(path + '/');
  }
</script>

<aside class="fixed top-0 left-0 bottom-0 w-56 bg-white/50 backdrop-blur-xl border-r border-black/5 flex flex-col z-40">
  <!-- App title -->
  <div class="h-12 flex items-center gap-2 px-4 border-b border-black/5 shrink-0" style="-webkit-app-region: drag">
    <svg class="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none">
      <path d="M16 2C12 8 8 12 8 16s4 8 8 14c4-6 8-10 8-14s-4-8-8-14z" stroke="url(#sb-grad)" stroke-width="2" fill="none"/>
      <path d="M10 10q6 6 12 0M10 22q6-6 12 0" stroke="url(#sb-grad)" stroke-width="1.5" opacity="0.6"/>
      <defs><linearGradient id="sb-grad" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#3B82F6"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs>
    </svg>
    <span class="text-sm font-bold text-text-primary tracking-tight">Telomere<span class="text-accent-blue font-medium text-xs">.ai</span></span>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
    {#each navItems as item}
      {#if !item.needsCompare || $canCompare}
        <a
          href={item.path}
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
            {isActive(item.path) ? 'bg-accent-blue/10 text-accent-blue font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-black/[0.03]'}"
        >
          {#if item.icon === 'upload'}
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          {:else if item.icon === 'analysis'}
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          {:else if item.icon === 'compare'}
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
          {:else if item.icon === 'explore'}
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          {/if}
          {item.label}
        </a>
      {/if}
    {/each}
    <!-- Analysis sub-sections (show when on analysis page with data) -->
    {#if dataLoaded && currentPath.startsWith('/analysis')}
      <div class="mt-2 pt-2 border-t border-black/5">
        <p class="px-3 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">Reports</p>
        {#each analysisSections as section}
          <button
            onclick={() => { activeSection.set(section.id); goto('/analysis'); }}
            class="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all text-left
              {currentSection === section.id ? 'bg-accent-blue/10 text-accent-blue font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-black/[0.03]'}"
          >
            <span class="w-4 text-center text-[11px]">{section.emoji}</span>
            {section.label}
          </button>
        {/each}
      </div>
    {/if}
  </nav>

  <!-- Loaded Genomes -->
  {#if $genomes.length > 0}
    <div class="border-t border-black/5 px-2 py-3">
      <p class="px-3 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Genomes</p>
      <div class="space-y-0.5">
        {#each $genomes as genome, idx (genome.id)}
          <div class="group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer
            {$activeGenomeIndex === idx ? 'bg-accent-blue/5' : 'hover:bg-black/[0.02]'}"
            role="button"
            tabindex="0"
            onclick={() => { setActiveGenome(idx); goto('/analysis'); }}
            ondblclick={() => startEdit(idx)}
          >
            <span class="w-2 h-2 rounded-full shrink-0" style="background: {genome.color}"></span>
            {#if editingIdx === idx}
              <input
                id="sidebar-genome-{idx}"
                type="text"
                bind:value={editName}
                class="flex-1 min-w-0 text-xs bg-transparent border-b border-accent-blue/30 focus:outline-none text-text-primary"
                onblur={() => finishEdit(idx)}
                onkeydown={(e) => { if (e.key === 'Enter') finishEdit(idx); if (e.key === 'Escape') editingIdx = null; }}
              />
            {:else}
              <span class="flex-1 min-w-0 text-xs truncate {$activeGenomeIndex === idx ? 'text-text-primary font-medium' : 'text-text-secondary'}">{genome.name}</span>
            {/if}
            {#if $genomes.length > 1}
              <button
                class="w-4 h-4 shrink-0 text-text-tertiary hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"
                onclick={(e) => { e.stopPropagation(); removeGenome(idx); }}
                title="Remove"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Bottom info -->
  <div class="border-t border-black/5 px-4 py-3 shrink-0">
    <p class="text-[10px] text-text-tertiary text-center">100% Offline • Open Source</p>
  </div>
</aside>
