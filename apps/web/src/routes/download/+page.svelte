<script>
  const version = '0.1.0';
  const platforms = [
    {
      name: 'Windows',
      icon: 'windows',
      file: `Telomere.AI_${version}_x64-setup.exe`,
      alt: `Telomere.AI_${version}_x64_en-US.msi`,
      size: '~45 MB',
      req: 'Windows 10 or later',
      primary: true,
    },
    {
      name: 'macOS (Apple Silicon)',
      icon: 'apple',
      file: `Telomere.AI_${version}_aarch64.dmg`,
      size: '~42 MB',
      req: 'macOS 12 or later (M1/M2/M3)',
      primary: true,
    },
    {
      name: 'macOS (Intel)',
      icon: 'apple',
      file: `Telomere.AI_${version}_x64.dmg`,
      size: '~44 MB',
      req: 'macOS 12 or later (Intel)',
      primary: false,
    },
    {
      name: 'Linux (AppImage)',
      icon: 'linux',
      file: `Telomere.AI_${version}_amd64.AppImage`,
      size: '~48 MB',
      req: 'Ubuntu 20.04+, Fedora 36+',
      primary: true,
    },
    {
      name: 'Linux (.deb)',
      icon: 'linux',
      file: `telomere-ai_${version}_amd64.deb`,
      size: '~12 MB',
      req: 'Debian/Ubuntu',
      primary: false,
    },
  ];

  const features = [
    { icon: '🔒', title: 'Zero Network Access', desc: 'The app never connects to the internet. Your genetic data stays on your machine — period.' },
    { icon: '⚡', title: 'Native Performance', desc: 'Built with Rust. Parses 600,000+ SNPs in under 2 seconds on modern hardware.' },
    { icon: '🧬', title: '2,000+ Health Markers', desc: 'Curated database from ClinVar, SNPedia, and peer-reviewed GWAS studies.' },
    { icon: '📊', title: '6 Report Categories', desc: 'Health risks, longevity, nutrigenomics, pharmacogenomics, traits, and carrier status.' },
  ];
</script>

<svelte:head>
  <title>Download Telomere AI — Free Desktop App</title>
  <meta name="description" content="Download Telomere AI for Windows, macOS, or Linux. Free, open-source genetic analysis that runs entirely on your computer." />
</svelte:head>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <!-- Header -->
  <div class="text-center mb-16">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-accent-cyan mb-6">
      <span class="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
      v1.0.0 • Open Source • Free Forever
    </div>
    <h1 class="text-4xl sm:text-5xl font-bold mb-4">Download <span class="gradient-text">Telomere AI</span></h1>
    <p class="text-text-secondary text-lg max-w-2xl mx-auto">A native desktop app that analyzes your genetic data entirely offline. No accounts, no uploads, no tracking.</p>
  </div>

  <!-- Download Cards -->
  <div class="grid gap-4 mb-8">
    {#each platforms.filter(p => p.primary) as platform}
      <a href="https://github.com/vaionex/telomere.ai/releases/latest/download/{platform.file}" class="card flex items-center gap-6 group cursor-pointer hover:glow-border">
        <div class="w-14 h-14 rounded-xl glass flex items-center justify-center text-2xl flex-shrink-0">
          {#if platform.icon === 'windows'}
            <svg class="w-7 h-7 text-accent-cyan" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
          {:else if platform.icon === 'apple'}
            <svg class="w-7 h-7 text-accent-cyan" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          {:else}
            <svg class="w-7 h-7 text-accent-cyan" viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.311.001-.465.003-.653.014-1.304.079-1.948.227-1.24.287-2.14.917-2.74 1.717C6.75 2.747 6.39 3.737 6.2 4.807c-.13.748-.14 1.535-.06 2.337H4.56c-.53 0-.96.43-.96.96v12.8c0 .53.43.96.96.96h14.88c.53 0 .96-.43.96-.96V8.104c0-.53-.43-.96-.96-.96h-1.67c.08-.802.07-1.589-.06-2.337-.19-1.07-.55-2.06-1.15-2.86-.6-.8-1.5-1.43-2.74-1.717A9.14 9.14 0 0012.504 0zm-.028 1.627c.462-.004.917.046 1.36.146.828.19 1.41.597 1.84 1.168.43.57.72 1.336.88 2.218.098.53.111 1.083.063 1.645h-8.24c-.048-.562-.035-1.115.064-1.645.16-.882.45-1.648.88-2.218.43-.571 1.012-.978 1.84-1.168a7.47 7.47 0 011.313-.146z"/></svg>
          {/if}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-lg group-hover:text-accent-cyan transition-colors">{platform.name}</h3>
          <p class="text-text-tertiary text-sm">{platform.req} • {platform.size}</p>
        </div>
        <div class="flex items-center gap-2 text-accent-cyan">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span class="text-sm font-medium">Download</span>
        </div>
      </a>
    {/each}
  </div>

  <!-- Other downloads -->
  <details class="mb-16">
    <summary class="text-text-tertiary text-sm cursor-pointer hover:text-text-secondary transition-colors">Other platforms and formats</summary>
    <div class="mt-4 grid gap-3">
      {#each platforms.filter(p => !p.primary) as platform}
        <a href="https://github.com/vaionex/telomere.ai/releases/latest/download/{platform.file}" class="card !py-3 flex items-center gap-4 group">
          <span class="text-text-tertiary text-sm flex-1">{platform.name}</span>
          <span class="text-text-tertiary text-xs">{platform.size}</span>
          <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        </a>
      {/each}
      <a href="https://github.com/vaionex/telomere.ai/releases" target="_blank" rel="noopener" class="text-accent-blue text-sm hover:underline mt-2 inline-block">View all releases on GitHub →</a>
    </div>
  </details>

  <!-- Why Desktop -->
  <div class="mb-16">
    <h2 class="text-2xl font-bold text-center mb-8">Why a Desktop App?</h2>
    <div class="grid sm:grid-cols-2 gap-6">
      {#each features as feat}
        <div class="card">
          <span class="text-2xl mb-3 block">{feat.icon}</span>
          <h3 class="font-semibold mb-1">{feat.title}</h3>
          <p class="text-text-secondary text-sm">{feat.desc}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Source code -->
  <div class="card text-center glow-border">
    <h3 class="font-semibold mb-2">Open Source</h3>
    <p class="text-text-secondary text-sm mb-4">Telomere AI is fully open source. Audit the code, contribute, or build from source.</p>
    <a href="https://github.com/vaionex/telomere.ai" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-accent-cyan hover:underline text-sm">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      View on GitHub
    </a>
  </div>
</div>
