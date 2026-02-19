<script>
  import DnaHelix from '$lib/components/DnaHelix.svelte';

  let faqOpen = $state({});
  function toggleFaq(i) { faqOpen = { ...faqOpen, [i]: !faqOpen[i] }; }

  const steps = [
    { num: '01', title: 'Open File', desc: 'Select your raw genetic data file. We support 23andMe, AncestryDNA, MyHeritage, VCF, and full whole-genome sequencing files (4GB+).', icon: '📂' },
    { num: '02', title: 'Analyze', desc: 'Our engine streams through your genome and builds a personalized trait profile — matching against 330+ curated health markers entirely in your browser.', icon: '🧬' },
    { num: '03', title: 'Discover', desc: 'Get detailed reports on health risks, longevity, nutrition, drug response, traits, and carrier status.', icon: '🔬' }
  ];

  const categories = [
    { title: 'Health Risks', desc: 'Cardiovascular, cancer, diabetes risk factors with evidence-based insights.', icon: '🏥', count: '50+', color: 'from-red-500/20 to-transparent' },
    { title: 'Longevity & Aging', desc: 'Telomere length, FOXO3, APOE, and biological aging markers.', icon: '🧬', count: '30+', color: 'from-cyan-500/20 to-transparent' },
    { title: 'Nutrigenomics', desc: 'Caffeine, lactose, MTHFR, vitamin metabolism and dietary needs.', icon: '🥗', count: '40+', color: 'from-green-500/20 to-transparent' },
    { title: 'Pharmacogenomics', desc: 'Drug metabolism (CYP450), warfarin, statins, and medication response.', icon: '💊', count: '40+', color: 'from-violet-500/20 to-transparent' },
    { title: 'Physical Traits', desc: 'Eye color, muscle type, sleep chronotype, taste perception.', icon: '👤', count: '30+', color: 'from-blue-500/20 to-transparent' },
    { title: 'Carrier Status', desc: 'Cystic fibrosis, sickle cell, hearing loss carrier screening.', icon: '🧪', count: '20+', color: 'from-amber-500/20 to-transparent' }
  ];

  const faqs = [
    { q: 'Is this really free?', a: 'Yes, completely free. Telomere AI is open-source software built by Vaionex. We believe genetic insights should be accessible to everyone.' },
    { q: 'Is my data safe?', a: 'Absolutely. Your genetic data is processed entirely on your computer. Nothing is ever sent to any server. The app works fully offline.' },
    { q: 'What file formats do you support?', a: '23andMe (.txt), AncestryDNA (.txt), MyHeritage (.csv), VCF 4.x (.vcf, .vcf.gz), and full whole-genome sequencing files. We\'re one of the few tools that handles raw WGS data (4GB+) — our Rust streaming parser processes them efficiently without loading everything into memory.' },
    { q: 'How accurate are the results?', a: 'Our SNP database draws from ClinVar, SNPedia, PharmGKB, and peer-reviewed GWAS studies. Every finding includes PubMed references and population frequency data so you can evaluate the evidence yourself. We show everything — nothing is filtered or hidden.' },
    { q: 'Can I use this for medical decisions?', a: 'We show you everything. Every finding includes PubMed references and population frequency data. Unlike other tools, nothing is hidden or gated. You already have your genome file — we just make it readable so you can have informed conversations with your healthcare provider if you choose.' },
    { q: 'How does this compare to SelfDecode or Promethease?', a: 'SelfDecode costs $297/year and Promethease costs $12. We offer comparable analysis for free, with a fully offline desktop app and open-source codebase.' }
  ];

  const stats = [
    { value: '5M+', label: 'Variants Supported' },
    { value: '2,000+', label: 'Health Markers' },
    { value: '6', label: 'Report Categories' },
    { value: '100%', label: 'Offline & Local' }
  ];
</script>

<svelte:head>
  <title>Telomere AI — Decode Your DNA. Locally. For Free.</title>
  <meta name="description" content="Free, open-source genetic analysis desktop app. Open your 23andMe, AncestryDNA, or VCF data and get AI-powered health insights. 100% offline." />
</svelte:head>

<!-- Hero -->
<section class="relative min-h-screen flex items-center overflow-hidden">
  <!-- Multi-color gradient blobs -->
  <div class="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[#3B82F6] opacity-[0.20] blur-[160px] animate-blob"></div>
  <div class="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-[#F43F5E] opacity-[0.15] blur-[140px] animate-blob animation-delay-2000"></div>
  <div class="absolute -bottom-20 left-1/3 w-[600px] h-[600px] rounded-full bg-[#7C3AED] opacity-[0.12] blur-[150px] animate-blob animation-delay-4000"></div>
  <div class="absolute top-20 right-1/4 w-[300px] h-[300px] rounded-full bg-[#F59E0B] opacity-[0.15] blur-[100px] animate-blob animation-delay-3000"></div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-16">
    <div class="flex-1 text-center lg:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-accent-blue mb-6">
        <span class="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
        100% Offline • Open Source • Free Forever
      </div>
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
        Decode Your DNA.<br/>
        <span class="gradient-text">Locally. Free.</span>
      </h1>
      <p class="text-xl text-text-secondary max-w-xl mb-4 leading-relaxed">
        Open your 23andMe, AncestryDNA, VCF, or raw whole-genome data. Get detailed health insights in seconds.
      </p>
      <p class="text-lg text-accent-blue font-medium mb-8">
        Your DNA stays on your computer. Always.
      </p>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <a href="/download" class="btn-cta text-lg px-8 py-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download for Free
        </a>
        <a href="#how-it-works" class="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
          Learn More
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>
      </div>
      <div class="flex items-center gap-6 mt-6 text-text-tertiary text-sm">
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
          Windows
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          macOS
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.581 19.049c-.55-.446-.336-1.431-.907-2.086-.511-.583-.254-1.533-.683-2.186-.41-.624-.764-.504-1.019-1.263-.287-.853.244-1.498-.108-2.345-.346-.832-.932-1.002-.978-1.953-.046-.941.686-1.396.603-2.338-.085-.946-.758-1.348-.89-2.29-.13-.934.378-1.56.164-2.51-.125-.539-.339-.89-.522-1.078H4.562c-.183.188-.397.539-.522 1.078-.214.95.294 1.576.164 2.51-.132.942-.805 1.344-.89 2.29-.083.942.649 1.397.603 2.338-.046.951-.632 1.121-.978 1.953-.352.847.179 1.492-.108 2.345-.255.759-.609.639-1.019 1.263-.429.653-.172 1.603-.683 2.186-.571.655-.357 1.64-.907 2.086-.521.422-.294 1.228-.294 1.951s-.227 1.529.294 1.951c.55.446.336 1.431.907 2.086.511.583.254 1.533.683 2.186.41.624.764.504 1.019 1.263.287.853-.244 1.498.108 2.345.346.832.932 1.002.978 1.953.046.941-.686 1.396-.603 2.338.085.946.758 1.348.89 2.29.044.312-.003.616-.075.904h14.876c-.072-.288-.119-.592-.075-.904.132-.942.805-1.344.89-2.29.083-.942-.649-1.397-.603-2.338.046-.951.632-1.121.978-1.953.352-.847-.179-1.492.108-2.345.255-.759.609-.639 1.019-1.263.429-.653.172-1.603.683-2.186.571-.655.357-1.64.907-2.086.521-.422.294-1.228.294-1.951s.227-1.529-.294-1.951z"/></svg>
          Linux
        </span>
      </div>
    </div>
    <div class="flex-shrink-0 hidden lg:flex items-center justify-center">
      <DnaHelix />
    </div>
  </div>
</section>

<!-- Trusted Formats -->
<section class="py-12 border-y border-black/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="text-center text-text-tertiary text-sm mb-6">Supports all major genetic testing platforms</p>
    <div class="flex items-center justify-center gap-8 sm:gap-16 flex-wrap">
      {#each ['23andMe', 'AncestryDNA', 'MyHeritage', 'VCF 4.x', 'WGS (4GB+)'] as fmt}
        <span class="text-text-secondary font-semibold text-lg opacity-60 hover:opacity-100 transition-opacity">{fmt}</span>
      {/each}
    </div>
  </div>
</section>

<!-- How it works -->
<section id="how-it-works" class="py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
      <p class="text-text-secondary max-w-2xl mx-auto">Three simple steps to unlock your genetic insights. Everything happens on your machine.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      {#each steps as step}
        <div class="card text-center group relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <span class="text-5xl mb-4 block">{step.icon}</span>
          <span class="text-accent-blue font-mono text-sm">{step.num}</span>
          <h3 class="text-xl font-bold mt-2 mb-3">{step.title}</h3>
          <p class="text-text-secondary text-sm">{step.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Report Categories -->
<section id="reports" class="py-24 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#7C3AED] opacity-[0.12] blur-[140px] animate-blob animation-delay-2000"></div>
  <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0EA5E9] opacity-[0.15] blur-[120px] animate-blob animation-delay-4000"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-transparent via-accent-violet/3 to-transparent"></div>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4">Six Comprehensive Reports</h2>
      <p class="text-text-secondary max-w-2xl mx-auto">Deep analysis across every dimension of your genetic profile.</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each categories as cat}
        <div class="card group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br {cat.color} opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <span class="text-3xl mb-3 block">{cat.icon}</span>
            <h3 class="text-lg font-bold mb-2">{cat.title}</h3>
            <p class="text-text-secondary text-sm mb-4">{cat.desc}</p>
            <div class="flex items-center justify-between">
              <span class="text-accent-blue font-mono text-sm">{cat.count} markers</span>
              <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Privacy -->
<section class="py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="card p-8 sm:p-12 text-center glow-border">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4">Your DNA, Your Computer, Your Rules</h2>
      <p class="text-text-secondary max-w-2xl mx-auto mb-8">Telomere AI is a desktop application. Your genetic data never touches the internet — and every result is shown to you. No gatekeeping, no paywalls, no hidden findings.</p>
      <div class="grid sm:grid-cols-3 gap-8 text-left">
        <div>
          <div class="w-10 h-10 rounded-lg glass flex items-center justify-center mb-3 text-accent-blue">🖥️</div>
          <h3 class="font-semibold mb-1">Fully Offline</h3>
          <p class="text-text-secondary text-sm">Works without an internet connection. No data ever leaves your device.</p>
        </div>
        <div>
          <div class="w-10 h-10 rounded-lg glass flex items-center justify-center mb-3 text-accent-blue">🚫</div>
          <h3 class="font-semibold mb-1">No Cloud, No Servers</h3>
          <p class="text-text-secondary text-sm">No accounts, no uploads, no tracking. Just you and your DNA data.</p>
        </div>
        <div>
          <div class="w-10 h-10 rounded-lg glass flex items-center justify-center mb-3 text-accent-blue">📖</div>
          <h3 class="font-semibold mb-1">Open Source</h3>
          <p class="text-text-secondary text-sm">Every line of code is auditable on GitHub. Verify our privacy claims yourself.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Comparison -->
<section id="features" class="py-24 relative overflow-hidden">
  <div class="absolute -top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-[#10B981] opacity-[0.12] blur-[150px] animate-blob"></div>
  <div class="absolute bottom-10 right-0 w-[400px] h-[400px] rounded-full bg-[#F43F5E] opacity-[0.10] blur-[120px] animate-blob animation-delay-3000"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4">How We Compare</h2>
      <p class="text-text-secondary">The same insights, without the price tag or the privacy trade-offs.</p>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/10">
            <th class="text-left py-4 px-4 text-text-secondary font-medium">Feature</th>
            <th class="text-center py-4 px-4 text-text-secondary font-medium">SelfDecode<br/><span class="text-accent-red">$297/yr</span></th>
            <th class="text-center py-4 px-4 text-text-secondary font-medium">Promethease<br/><span class="text-accent-amber">$12</span></th>
            <th class="text-center py-4 px-4 font-medium text-text-primary">Telomere<span class="text-accent-blue">.AI</span><br/><span class="text-accent-green">Free</span></th>
          </tr>
        </thead>
        <tbody>
          {#each [
            ['AI Analysis', '✓', '✗', '✓'],
            ['SNP Database', 'Proprietary', 'SNPedia', 'ClinVar + SNPedia + PharmGKB'],
            ['Report Quality', 'Excellent', 'Raw/Technical', 'Professional + AI'],
            ['Privacy', 'Cloud-based', 'Cloud-based', '100% Offline Desktop'],
            ['Open Source', '✗', '✗', '✓'],
            ['WGS Support (4GB+)', '✗', '✗', '✓ Streaming'],
            ['All Formats', '✓', '✓', '✓ + .vcf.gz']
          ] as row}
            <tr class="border-b border-black/5 hover:bg-white/[0.02]">
              <td class="py-3 px-4 text-text-secondary">{row[0]}</td>
              <td class="py-3 px-4 text-center">{row[1]}</td>
              <td class="py-3 px-4 text-center">{row[2]}</td>
              <td class="py-3 px-4 text-center text-accent-blue font-medium">{row[3]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- Stats -->
<section class="py-24 border-y border-black/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {#each stats as stat}
        <div>
          <div class="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
          <div class="text-text-secondary text-sm">{stat.label}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="py-24">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
    <div class="space-y-3">
      {#each faqs as faq, i}
        <div class="card !p-0 overflow-hidden">
          <button class="w-full text-left px-6 py-4 flex items-center justify-between" onclick={() => toggleFaq(i)}>
            <span class="font-semibold text-sm">{faq.q}</span>
            <svg class="w-5 h-5 text-text-tertiary transition-transform flex-shrink-0 {faqOpen[i] ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          {#if faqOpen[i]}
            <div class="px-6 pb-4 text-text-secondary text-sm">{faq.a}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Final CTA -->
<section class="py-24">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="card p-12 glow-border">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4">Ready to Decode Your DNA?</h2>
      <p class="text-text-secondary mb-8 max-w-xl mx-auto">Open your genetic data file and unlock comprehensive health insights. It takes less than 30 seconds.</p>
      <a href="/download" class="btn-cta text-lg px-8 py-4">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        Download — It's Free
      </a>
    </div>
  </div>
</section>
