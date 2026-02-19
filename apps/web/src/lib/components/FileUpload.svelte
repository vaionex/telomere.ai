<script>
  import { parseGeneticFile } from '@telomere/parsers';
  import { rawSnps, fileMetadata } from '$lib/stores/genetic-data.js';
  import { goto } from '$app/navigation';

  let dragover = $state(false);
  let parsing = $state(false);
  let progress = $state(0);
  let error = $state('');
  let isTauri = $state(false);

  $effect(() => {
    isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
  });

  async function processContent(text, fileName) {
    error = '';
    parsing = true;
    progress = 30;

    try {
      await new Promise(r => setTimeout(r, 200));
      const result = parseGeneticFile(text);
      progress = 80;

      await new Promise(r => setTimeout(r, 200));
      rawSnps.set(result.snps);
      fileMetadata.set({
        format: result.format,
        totalSnps: result.metadata.totalSnps,
        chromosomeCount: result.metadata.chromosomeCount,
        buildVersion: result.metadata.buildVersion,
        fileName
      });
      progress = 100;

      await new Promise(r => setTimeout(r, 400));
      goto('/dashboard');
    } catch (e) {
      error = e.message;
      parsing = false;
      progress = 0;
    }
  }

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

      progress = 10;
      parsing = true;
      const filePath = typeof selected === 'string' ? selected : selected.path;
      const text = await readTextFile(filePath);
      const fileName = filePath.split(/[/\\]/).pop() || 'unknown';
      await processContent(text, fileName);
    } catch (e) {
      error = e.message;
      parsing = false;
      progress = 0;
    }
  }

  async function handleBrowserFile(file) {
    if (!file) return;
    progress = 10;
    parsing = true;
    const text = await file.text();
    await processContent(text, file.name);
  }

  function onDrop(e) {
    e.preventDefault();
    dragover = false;
    handleBrowserFile(e.dataTransfer?.files?.[0]);
  }

  function onInput(e) {
    handleBrowserFile(e.target.files?.[0]);
  }

  function handleClick() {
    if (isTauri) {
      openTauriDialog();
    } else {
      document.getElementById('file-input')?.click();
    }
  }
</script>

<div
  class="relative rounded-xl border-2 border-dashed transition-all duration-200 p-12 text-center cursor-pointer {dragover ? 'border-accent-cyan bg-accent-cyan/5' : 'border-white/10 hover:border-white/20'}"
  role="button"
  tabindex="0"
  ondragover={(e) => { e.preventDefault(); dragover = true; }}
  ondragleave={() => dragover = false}
  ondrop={onDrop}
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
  <input id="file-input" type="file" accept=".txt,.csv,.vcf,.tsv,.zip" class="hidden" onchange={onInput} />

  {#if parsing}
    <div class="space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full border-4 border-accent-cyan/30 border-t-accent-cyan animate-spin"></div>
      <p class="text-text-primary font-semibold">Parsing your genetic data...</p>
      <div class="w-64 mx-auto h-2 bg-white/5 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full transition-all duration-500" style="width: {progress}%"></div>
      </div>
      <p class="text-text-secondary text-sm">Processing locally — your data never leaves this device</p>
    </div>
  {:else}
    <div class="space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full glass flex items-center justify-center">
        <svg class="w-8 h-8 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
        </svg>
      </div>
      <div>
        <p class="text-text-primary font-semibold text-lg">
          {isTauri ? 'Click to open your genetic data file' : 'Drop your genetic data file here'}
        </p>
        <p class="text-text-secondary text-sm mt-1">
          {isTauri ? 'Select' : 'or click to browse'} • 23andMe, AncestryDNA, MyHeritage, VCF supported
        </p>
      </div>
      <div class="flex items-center justify-center gap-4 text-text-tertiary text-xs">
        <span>🔒 100% local processing</span>
        <span>•</span>
        <span>📁 .txt, .csv, .vcf</span>
        <span>•</span>
        <span>⚡ Instant parsing</span>
      </div>
    </div>
  {/if}

  {#if error}
    <p class="mt-4 text-accent-red text-sm">{error}</p>
  {/if}
</div>
