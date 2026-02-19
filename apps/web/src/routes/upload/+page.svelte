<script>
  import FileUpload from '$lib/components/FileUpload.svelte';
</script>

<svelte:head>
  <title>Open Genetic Data — Telomere AI</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">Open Your <span class="gradient-text">Genetic Data</span></h1>
    <p class="text-text-secondary max-w-xl mx-auto">Your file is processed entirely on this device. Nothing is ever sent to any server.</p>
  </div>

  <FileUpload />

  <div class="mt-12 grid sm:grid-cols-3 gap-6">
    <div class="card text-center">
      <span class="text-2xl mb-2 block">🖥️</span>
      <h3 class="font-semibold text-sm mb-1">100% Local</h3>
      <p class="text-text-tertiary text-xs">Processed on your computer. Works offline.</p>
    </div>
    <div class="card text-center">
      <span class="text-2xl mb-2 block">⚡</span>
      <h3 class="font-semibold text-sm mb-1">Instant Analysis</h3>
      <p class="text-text-tertiary text-xs">Parse 500,000+ SNPs in seconds.</p>
    </div>
    <div class="card text-center">
      <span class="text-2xl mb-2 block">📊</span>
      <h3 class="font-semibold text-sm mb-1">6 Report Types</h3>
      <p class="text-text-tertiary text-xs">Health, longevity, nutrition, pharma, traits, and carrier status.</p>
    </div>
  </div>

  <div class="mt-12 card">
    <h3 class="font-semibold mb-3">How to get your raw data</h3>
    <div class="space-y-2 text-sm text-text-secondary">
      <p><strong class="text-text-primary">23andMe:</strong> Settings → 23andMe Data → Download Raw Data</p>
      <p><strong class="text-text-primary">AncestryDNA:</strong> Settings → Download DNA Data → Confirm & Download</p>
      <p><strong class="text-text-primary">MyHeritage:</strong> DNA → Manage DNA kits → Download raw DNA data</p>
      <p><strong class="text-text-primary">VCF:</strong> Any VCF 4.x file from a genetic testing provider or research study.</p>
    </div>
  </div>
</div>
