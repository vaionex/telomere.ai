<script>
  import FileUpload from '$lib/components/FileUpload.svelte';
  import { SAMPLE_GENOME } from '$lib/data/sample-genome.js';
  import { addGenome } from '$lib/stores/genetic-data.js';
  import { goto } from '$app/navigation';

  function loadDemo() {
    addGenome(SAMPLE_GENOME.name, SAMPLE_GENOME.snps, SAMPLE_GENOME.metadata);
    goto('/dashboard');
  }
</script>

<svelte:head>
  <title>Upload Genetic Data — Telomere.ai</title>
  <meta name="description" content="Upload your 23andMe, AncestryDNA, or whole genome sequencing data for free genetic analysis. 100% browser-based — your DNA never leaves your device." />
  <meta property="og:title" content="Free Genetic Analysis — Telomere.ai" />
  <meta property="og:description" content="Analyze your genome for health risks, pharmacogenomics, and traits. Completely private — runs in your browser." />
</svelte:head>

<section class="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16">
  <!-- Background blobs -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div class="absolute top-1/4 -left-32 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl"></div>
  </div>

  <div class="max-w-2xl w-full space-y-8">
    <!-- Privacy banner -->
    <div class="card text-center space-y-3">
      <div class="w-12 h-12 mx-auto rounded-xl bg-accent-green/10 flex items-center justify-center">
        <svg class="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <h2 class="text-lg font-bold text-text-primary">Your DNA never leaves your browser</h2>
      <p class="text-text-secondary text-sm max-w-md mx-auto">Zero servers. Zero uploads. Your genome stays in your browser. All analysis runs locally using JavaScript — nothing is ever sent anywhere.</p>
    </div>

    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl font-bold text-text-primary">Analyze Your Genome</h1>
      <p class="text-text-secondary mt-2">Upload your genetic data file to get started</p>
    </div>

    <!-- Upload component -->
    <FileUpload />

    <!-- Demo option -->
    <div class="text-center">
      <button onclick={loadDemo} class="text-accent-cyan hover:text-accent-blue text-sm font-medium transition-colors inline-flex items-center gap-1.5">
        No genetic data? Try with sample data
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
      </button>
    </div>

    <!-- Supported formats -->
    <div class="text-center text-xs text-text-tertiary space-y-1">
      <p>Supports 23andMe, AncestryDNA, MyHeritage, and VCF files (including 30x WGS .vcf.gz)</p>
      <p>Your file is processed entirely in your browser and never transmitted</p>
    </div>
  </div>
</section>
