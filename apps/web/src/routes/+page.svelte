<script>
  import DnaHelix from '$lib/components/DnaHelix.svelte';

  let faqOpen = $state({});
  function toggleFaq(i) { faqOpen = { ...faqOpen, [i]: !faqOpen[i] }; }

  const steps = [
    { num: '01', title: 'Open File', desc: 'Select your raw genetic data file from your computer. We support 23andMe, AncestryDNA, MyHeritage, and VCF formats.', icon: '📂' },
    { num: '02', title: 'Analyze', desc: 'Our engine parses 500,000+ SNPs and matches them against our curated database of health markers — entirely on your machine.', icon: '🧬' },
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
    { q: 'What file formats do you support?', a: '23andMe raw data (.txt), AncestryDNA (.txt), MyHeritage (.csv), and VCF 4.x files. Just download your raw data from your testing provider and open it here.' },
    { q: 'How accurate are the results?', a: 'Our SNP database uses data from ClinVar, SNPedia, PharmGKB, and peer-reviewed GWAS studies. Each finding includes PubMed references. This is for informational purposes — always consult a healthcare provider.' },
    { q: 'Can I use this for medical decisions?', a: 'No. Telomere AI is for educational and informational purposes only. It is not a diagnostic tool. Always consult with a qualified healthcare professional or genetic counselor.' },
    { q: 'How does this compare to SelfDecode or Promethease?', a: 'SelfDecode costs $297/year and Promethease costs $12. We offer comparable analysis for free, with a fully offline desktop app and open-source codebase.' }
  ];

  const stats = [
    { value: '500,000+', label: 'SNPs Parsed' },
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
  <div class="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 via-transparent to-transparent"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-[120px]"></div>

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-16">
    <div class="flex-1 text-center lg:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-accent-cyan mb-6">
        <span class="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
        100% Offline • Open Source • Free Forever
      </div>
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
        Decode Your DNA.<br/>
        <span class="gradient-text">Locally. Free.</span>
      </h1>
      <p class="text-xl text-text-secondary max-w-xl mb-4 leading-relaxed">
        Open your 23andMe, AncestryDNA, or VCF data. Get detailed health insights in seconds.
      </p>
      <p class="text-lg text-accent-cyan font-medium mb-8">
        Your DNA stays on your computer. Always.
      </p>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <a href="/upload" class="btn-primary text-lg px-8 py-4 glow-cyan">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
          Open File
        </a>
        <a href="#how-it-works" class="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
          Learn More
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>
      </div>
    </div>
    <div class="flex-shrink-0 hidden lg:flex items-center justify-center">
      <DnaHelix />
    </div>
  </div>
</section>

<!-- Trusted Formats -->
<section class="py-12 border-y border-white/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="text-center text-text-tertiary text-sm mb-6">Supports all major genetic testing platforms</p>
    <div class="flex items-center justify-center gap-8 sm:gap-16 flex-wrap">
      {#each ['23andMe', 'AncestryDNA', 'MyHeritage', 'VCF 4.x'] as fmt}
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
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <span class="text-5xl mb-4 block">{step.icon}</span>
          <span class="text-accent-cyan font-mono text-sm">{step.num}</span>
          <h3 class="text-xl font-bold mt-2 mb-3">{step.title}</h3>
          <p class="text-text-secondary text-sm">{step.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Report Categories -->
<section id="reports" class="py-24 relative">
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
              <span class="text-accent-cyan font-mono text-sm">{cat.count} markers</span>
              <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
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
      <p class="text-text-secondary max-w-2xl mx-auto mb-8">Telomere AI is a desktop application. Your genetic data never touches the internet.</p>
      <div class="grid sm:grid-cols-3 gap-8 text-left">
        <div>
          <div class="w-10 h-10 rounded-lg glass flex items-center justify-center mb-3 text-accent-cyan">🖥️</div>
          <h3 class="font-semibold mb-1">Fully Offline</h3>
          <p class="text-text-secondary text-sm">Works without an internet connection. No data ever leaves your device.</p>
        </div>
        <div>
          <div class="w-10 h-10 rounded-lg glass flex items-center justify-center mb-3 text-accent-cyan">🚫</div>
          <h3 class="font-semibold mb-1">No Cloud, No Servers</h3>
          <p class="text-text-secondary text-sm">No accounts, no uploads, no tracking. Just you and your DNA data.</p>
        </div>
        <div>
          <div class="w-10 h-10 rounded-lg glass flex items-center justify-center mb-3 text-accent-cyan">📖</div>
          <h3 class="font-semibold mb-1">Open Source</h3>
          <p class="text-text-secondary text-sm">Every line of code is auditable on GitHub. Verify our privacy claims yourself.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Comparison -->
<section id="features" class="py-24 relative">
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
            <th class="text-center py-4 px-4 font-medium gradient-text">Telomere AI<br/><span class="text-accent-green">Free</span></th>
          </tr>
        </thead>
        <tbody>
          {#each [
            ['AI Analysis', '✓', '✗', '✓'],
            ['SNP Database', 'Proprietary', 'SNPedia', 'ClinVar + SNPedia + PharmGKB'],
            ['Report Quality', 'Excellent', 'Raw/Technical', 'Professional + AI'],
            ['Privacy', 'Cloud-based', 'Cloud-based', '100% Offline Desktop'],
            ['Open Source', '✗', '✗', '✓'],
            ['All Formats', '✓', '✓', '✓']
          ] as row}
            <tr class="border-b border-white/5 hover:bg-white/[0.02]">
              <td class="py-3 px-4 text-text-secondary">{row[0]}</td>
              <td class="py-3 px-4 text-center">{row[1]}</td>
              <td class="py-3 px-4 text-center">{row[2]}</td>
              <td class="py-3 px-4 text-center text-accent-cyan font-medium">{row[3]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- Stats -->
<section class="py-24 border-y border-white/5">
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
      <a href="/upload" class="btn-primary text-lg px-8 py-4 glow-cyan">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
        Open File — It's Free
      </a>
    </div>
  </div>
</section>
