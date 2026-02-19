<script>
  import { parseGeneticFile } from '@telomere/parsers';
  import { addGenome } from '$lib/stores/genetic-data.js';
  import { goto } from '$app/navigation';
  import GenomeNamePrompt from './GenomeNamePrompt.svelte';

  let dragover = $state(false);
  let phase = $state('idle'); // idle | reading | parsing | matching | naming | error
  let progress = $state(0);
  let snpsFound = $state(0);
  let errorMsg = $state('');
  let isTauri = $state(false);
  let fileName = $state('');
  let parsedSnps = $state(null);
  let parsedMeta = $state(null);

  $effect(() => {
    isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
  });

  async function processContent(text, name) {
    errorMsg = '';
    fileName = name;
    
    try {
      // Phase 1: Reading
      phase = 'reading';
      progress = 15;
      await tick(150);

      // Phase 2: Parsing
      phase = 'parsing';
      progress = 40;
      await tick(100);
      
      const result = parseGeneticFile(text);
      snpsFound = result.metadata.totalSnps;
      progress = 70;
      await tick(200);

      // Phase 3: Matching
      phase = 'matching';
      progress = 85;
      await tick(300);

      // Store parsed data, show naming prompt
      parsedSnps = result.snps;
      parsedMeta = {
        format: result.format,
        totalSnps: result.metadata.totalSnps,
        chromosomeCount: result.metadata.chromosomeCount,
        buildVersion: result.metadata.buildVersion,
        fileName: name
      };

      progress = 100;
      phase = 'naming';
    } catch (e) {
      errorMsg = e.message || 'Failed to parse file. Make sure it\'s a valid genetic data file.';
      phase = 'error';
      progress = 0;
    }
  }

  function tick(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function openTauriDialog() {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const { readTextFile } = await import('@tauri-apps/plugin-fs');
      const selected = await open({
        title: 'Open Genetic Data File',
        multiple: false,
        filters: [
          { name: 'Genetic Data', extensions: ['txt', 'csv', 'vcf', 'tsv'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      if (!selected) return;
      phase = 'reading';
      progress = 5;
      const filePath = typeof selected === 'string' ? selected : selected.path;
      const text = await readTextFile(filePath);
      await processContent(text, filePath.split(/[/\\]/).pop() || 'unknown');
    } catch (e) {
      errorMsg = e.message;
      phase = 'error';
    }
  }

  async function handleBrowserFile(file) {
    if (!file) return;
    const valid = ['.txt', '.csv', '.vcf', '.tsv', '.zip'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!valid.includes(ext)) {
      errorMsg = `Unsupported file type "${ext}". Use .txt, .csv, .vcf, or .tsv files.`;
      phase = 'error';
      return;
    }
    phase = 'reading';
    progress = 5;
    const text = await file.text();
    await processContent(text, file.name);
  }

  function onDrop(e) {
    e.preventDefault();
    dragover = false;
    handleBrowserFile(e.dataTransfer?.files?.[0]);
  }

  function onInput(e) { handleBrowserFile(e.target.files?.[0]); }

  function handleClick() {
    if (phase !== 'idle' && phase !== 'error') return;
    if (isTauri) openTauriDialog();
    else document.getElementById('file-input')?.click();
  }

  function reset() { phase = 'idle'; progress = 0; errorMsg = ''; snpsFound = 0; parsedSnps = null; parsedMeta = null; }

  function onNameChosen(name) {
    if (parsedSnps && parsedMeta) {
      addGenome(name, parsedSnps, parsedMeta);
      goto('/dashboard');
    }
  }

  const phaseLabel = $derived({
    reading: 'Reading file...',
    parsing: `Parsing SNPs...`,
    matching: `Matching ${snpsFound.toLocaleString()} SNPs against database...`,
    done: 'Analysis complete!',
  }[phase] || '');
</script>

<div class="space-y-6">
  {#if phase === 'naming'}
    <!-- Naming prompt (replaces entire drop zone) -->
    <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-12">
      <GenomeNamePrompt onSubmit={onNameChosen} />
    </div>
  {:else}
  <!-- Drop zone -->
  <button
    class="relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50
      {dragover ? 'border-accent-cyan bg-accent-cyan/5 scale-[1.01]' : phase === 'error' ? 'border-accent-red/40' : 'border-white/10 hover:border-accent-cyan/40 hover:bg-white/[0.02]'}
      {phase !== 'idle' && phase !== 'error' ? 'pointer-events-none' : ''}"
    ondragover={(e) => { e.preventDefault(); dragover = true; }}
    ondragleave={() => dragover = false}
    ondrop={onDrop}
    onclick={handleClick}
  >
    <input id="file-input" type="file" accept=".txt,.csv,.vcf,.tsv" class="hidden" onchange={onInput} />

    {#if phase === 'idle' || phase === 'error'}
      <!-- Idle state -->
      <div class="px-8 py-16 space-y-5">
        <div class="w-20 h-20 mx-auto rounded-2xl glass flex items-center justify-center transition-transform {dragover ? 'scale-110' : ''}">
          <svg class="w-10 h-10 text-accent-cyan" fill="none" viewBox="0 0 24 24">
            {#if dragover}
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
            {:else}
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11v6m-3-3h6" opacity="0.5"/>
            {/if}
          </svg>
        </div>
        
        <div>
          <p class="text-text-primary font-semibold text-xl">
            {#if dragover}
              Drop to analyze
            {:else}
              Drop your genetic data file here
            {/if}
          </p>
          <p class="text-text-secondary text-sm mt-2">or click to browse your files</p>
        </div>

        <div class="flex items-center justify-center gap-3 flex-wrap">
          {#each ['23andMe (.txt)', 'AncestryDNA (.txt)', 'MyHeritage (.csv)', 'VCF (.vcf)'] as fmt}
            <span class="px-3 py-1 rounded-full text-xs glass text-text-tertiary">{fmt}</span>
          {/each}
        </div>
      </div>

    {:else}
      <!-- Processing states -->
      <div class="px-8 py-16 space-y-6">
        <!-- Animated DNA icon -->
        <div class="w-20 h-20 mx-auto relative">
          {#if phase === 'done'}
            <div class="w-full h-full rounded-2xl bg-accent-green/10 flex items-center justify-center">
              <svg class="w-10 h-10 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          {:else}
            <div class="w-full h-full rounded-2xl glass flex items-center justify-center">
              <svg class="w-10 h-10 text-accent-cyan animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13c-3.052.513-6.174.513-9.226 0l-.772-.13c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5"/>
              </svg>
            </div>
          {/if}
        </div>

        <div>
          <p class="text-text-primary font-semibold text-lg">{phaseLabel}</p>
          <p class="text-text-secondary text-sm mt-1">
            {#if fileName}<span class="font-mono text-accent-cyan">{fileName}</span> • {/if}
            {#if snpsFound > 0}{snpsFound.toLocaleString()} SNPs found{/if}
          </p>
        </div>

        <!-- Progress bar -->
        <div class="w-80 max-w-full mx-auto">
          <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700 ease-out {phase === 'done' ? 'bg-accent-green' : 'bg-gradient-to-r from-accent-cyan to-accent-blue'}"
              style="width: {progress}%"
            ></div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-text-tertiary">
            <span class="{phase === 'reading' || phase === 'parsing' || phase === 'matching' || phase === 'done' ? 'text-accent-cyan' : ''}">Read</span>
            <span class="{phase === 'parsing' || phase === 'matching' || phase === 'done' ? 'text-accent-cyan' : ''}">Parse</span>
            <span class="{phase === 'matching' || phase === 'done' ? 'text-accent-cyan' : ''}">Match</span>
            <span class="{phase === 'done' ? 'text-accent-green' : ''}">Done</span>
          </div>
        </div>

        <p class="text-text-tertiary text-xs">Everything happens on your device — no data is uploaded</p>
      </div>
    {/if}
  </button>
  {/if}

  <!-- Error state -->
  {#if phase === 'error' && errorMsg}
    <div class="card bg-accent-red/5 border-accent-red/20">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <div class="flex-1">
          <p class="text-sm text-accent-red font-medium">Unable to parse file</p>
          <p class="text-sm text-text-secondary mt-1">{errorMsg}</p>
        </div>
        <button class="text-text-tertiary hover:text-text-secondary text-sm" onclick={reset}>Try again</button>
      </div>
    </div>
  {/if}
</div>
